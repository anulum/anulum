#!/usr/bin/env python3
# SPDX-License-Identifier: AGPL-3.0-or-later
"""Keep the README's live blocks and the Zenodo cache current.

Two public sources feed the profile:

* ``https://anulum.li/news/feed.xml``: every release of the public projects, generated
  on the institute site from the repositories' own ``CHANGELOG.md`` files.
* the Zenodo REST API: every record whose creator carries the owner's ORCID.

``--refresh`` fetches both into ``tools/feeds.json`` (the committed cache, so every
offline gate and test is reproducible). Without flags the tool renders the cache into
the marker-delimited blocks of every README listed in the manifest and replaces each
block whole; exactly one marker pair per block per file is required, and a second run
changes nothing. ``--check`` fails when a README block differs from the cache.
``--verified DATE`` sets ``verified_at`` in the manifest and in the READMEs' verified
markers (used by the online validation workflow after every target passed).

Usage: ``python3 tools/profile_feeds.py [--refresh] [--check] [--verified YYYY-MM-DD]``
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import re
import sys
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "profile-data.json"
CACHE = ROOT / "tools" / "feeds.json"
USER_AGENT = "anulum-profile/1 (+https://github.com/anulum/anulum)"
TIMEOUT = 20.0
ZENODO_PAGE = 25  # the search API rejects larger pages for this query
BLOCKS = ("releases", "publication")

HEADINGS: dict[str, dict[str, str]] = {
    "README.md": {"releases": "Latest releases", "publication": "Latest publication"},
    "README.de.md": {"releases": "Neueste Releases", "publication": "Neueste Publikation"},
    "README.sk.md": {"releases": "Najnovšie vydania", "publication": "Najnovšia publikácia"},
    "README.zh-CN.md": {"releases": "最新发布", "publication": "最新出版物"},
    "README.ja.md": {"releases": "最新リリース", "publication": "最新の出版物"},
}
COLUMNS: dict[str, dict[str, str]] = {
    "README.md": {
        "date": "Date",
        "project": "Project",
        "release": "Release",
        "change": "Change",
        "type": "Type",
        "output": "Output",
        "doi": "DOI",
    },
    "README.de.md": {
        "date": "Datum",
        "project": "Projekt",
        "release": "Release",
        "change": "Änderung",
        "type": "Typ",
        "output": "Ergebnis",
        "doi": "DOI",
    },
    "README.sk.md": {
        "date": "Dátum",
        "project": "Projekt",
        "release": "Vydanie",
        "change": "Zmena",
        "type": "Typ",
        "output": "Výstup",
        "doi": "DOI",
    },
    "README.zh-CN.md": {
        "date": "日期",
        "project": "项目",
        "release": "版本",
        "change": "变更",
        "type": "类型",
        "output": "成果",
        "doi": "DOI",
    },
    "README.ja.md": {
        "date": "日付",
        "project": "プロジェクト",
        "release": "リリース",
        "change": "変更",
        "type": "種別",
        "output": "成果",
        "doi": "DOI",
    },
}
NEWS_LINK = "[anulum.li/news](https://anulum.li/news/)"
ZENODO_LINK = "[Zenodo](https://zenodo.org/search?q=creators.orcid%3A%220009-0009-3560-0851%22)"
SOURCE_NOTE: dict[str, str] = {
    "README.md": f"Rendered from {NEWS_LINK} (the projects' CHANGELOG files) and {ZENODO_LINK} on {{date}}.",
    "README.de.md": f"Gerendert aus {NEWS_LINK} (den CHANGELOG-Dateien der Projekte) und {ZENODO_LINK} am {{date}}.",
    "README.sk.md": f"Vykreslené z {NEWS_LINK} (súbory CHANGELOG projektov) a {ZENODO_LINK} dňa {{date}}.",
    "README.zh-CN.md": f"根据 {NEWS_LINK}（各项目的 CHANGELOG 文件）和 {ZENODO_LINK} 于 {{date}} 生成。",
    "README.ja.md": f"{NEWS_LINK}（各プロジェクトの CHANGELOG）と {ZENODO_LINK} から {{date}} に生成。",
}
RESOURCE_LABELS = {
    "publication/preprint": "Preprint",
    "publication/conferencepaper": "Conference paper record",
    "publication/technicalnote": "Technical note",
    "publication/report": "Technical report",
    "publication/": "Publication",
    "software/": "Software archive",
}


def fetch(url: str, accept: str) -> bytes:
    """GET ``url`` with the profile's user agent."""
    request = urllib.request.Request(url, headers={"Accept": accept, "User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=TIMEOUT) as response:
        data: bytes = response.read()
        return data


def parse_feed(xml_bytes: bytes, limit: int) -> list[dict[str, str]]:
    """Return the newest ``limit`` release items of the anulum.li RSS feed."""
    root = ET.fromstring(xml_bytes)
    items: list[dict[str, str]] = []
    for item in root.iter("item"):
        title = item.findtext("title", "")
        match = re.fullmatch(r"(?P<project>.+?) (?P<version>v?\d[^ ]*) — (?P<headline>.+)", title, re.S)
        if not match:
            continue
        pub = item.findtext("pubDate", "")
        date = dt.datetime.strptime(pub, "%a, %d %b %Y %H:%M:%S %z").date().isoformat() if pub else ""
        items.append(
            {
                "project": match["project"].strip(),
                "version": match["version"].strip(),
                "headline": match["headline"].strip(),
                "link": item.findtext("link", "").strip(),
                "date": date,
            }
        )
    items.sort(key=lambda entry: entry["date"], reverse=True)
    return items[:limit]


def fetch_zenodo(orcid: str) -> list[dict[str, Any]]:
    """Return every Zenodo record (latest version each) whose creators carry ``orcid``."""
    query = urllib.parse.quote(f'creators.orcid:"{orcid}"')
    records: list[dict[str, Any]] = []
    page = 1
    while True:
        payload = json.loads(
            fetch(f"https://zenodo.org/api/records?q={query}&size={ZENODO_PAGE}&page={page}", "application/json")
        )
        hits = payload["hits"]["hits"]
        for hit in hits:
            meta = hit["metadata"]
            if not any(creator.get("orcid") == orcid for creator in meta.get("creators", [])):
                continue
            kind = meta["resource_type"]
            records.append(
                {
                    "id": int(hit["id"]),
                    "doi": hit["doi"],
                    "conceptdoi": hit.get("conceptdoi", ""),
                    "title": meta["title"].strip(),
                    "date": meta["publication_date"],
                    "type": f"{kind.get('type', '')}/{kind.get('subtype', '')}",
                    "version": str(meta.get("version", "") or ""),
                    "license": (meta.get("license") or {}).get("id", ""),
                }
            )
        if len(hits) < ZENODO_PAGE:
            break
        page += 1
    records.sort(key=lambda record: (record["date"], record["id"]), reverse=True)
    return records


def refresh(data: dict[str, Any]) -> dict[str, Any]:
    """Fetch both sources and write the cache."""
    feeds = data["feeds"]
    cache = {
        "fetched_at": dt.datetime.now(dt.UTC).date().isoformat(),
        "releases": parse_feed(
            fetch(feeds["news_feed"], "application/rss+xml, application/xml"), feeds["releases_shown"]
        ),
        "zenodo": fetch_zenodo(data["profile"]["orcid"].rsplit("/", 1)[-1]),
    }
    CACHE.write_text(json.dumps(cache, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return cache


def resource_label(record: dict[str, Any]) -> str:
    """Human label for a Zenodo resource type."""
    kind = str(record["type"])
    return RESOURCE_LABELS.get(kind, RESOURCE_LABELS.get(kind.split("/")[0] + "/", kind))


def plain(text: str) -> str:
    """Make fetched prose safe for a table cell under the READMEs' style rules (no em dash, no pipe)."""
    return text.replace("—", "-").replace("|", "/").strip()


def render_block(name: str, readme: str, cache: dict[str, Any], data: dict[str, Any]) -> str:
    """Render one block body (without markers) for ``readme``."""
    heading = HEADINGS[readme][name]
    columns = COLUMNS[readme]
    if name == "releases":
        rows = [
            f"| {entry['date']} | {plain(entry['project'])} | [{entry['version']}]({entry['link']}) | "
            f"{plain(entry['headline'])} |"
            for entry in cache["releases"]
        ]
        table = (
            f"| {columns['date']} | {columns['project']} | {columns['release']} | {columns['change']} |\n"
            "|---|---|---|---|\n" + "\n".join(rows)
        )
    else:
        publications = [record for record in cache["zenodo"] if record["type"].startswith("publication/")]
        latest = publications[0]
        doi = f"[{latest['doi']}](https://doi.org/{latest['doi']})"
        table = (
            f"| {columns['date']} | {columns['type']} | {columns['output']} | {columns['doi']} |\n"
            "|---|---|---|---|\n"
            f"| {latest['date']} | {resource_label(latest)} | {plain(latest['title'])} | {doi} |"
        )
    note = SOURCE_NOTE[readme].format(date=cache["fetched_at"])
    return f"### {heading}\n\n{table}\n\n<sub>{note}</sub>"


def marker(name: str, edge: str) -> str:
    """Return the HTML comment that opens or closes a block."""
    return f"<!-- profile-feeds:{name}:{edge} -->"


def replace_block(text: str, name: str, body: str, where: str) -> str:
    """Replace the whole marker-delimited block ``name`` in ``text``."""
    start, end = marker(name, "start"), marker(name, "end")
    if text.count(start) != 1 or text.count(end) != 1:
        raise ValueError(f"{where}: expected exactly one {name} block, found {text.count(start)}/{text.count(end)}")
    head, rest = text.split(start, 1)
    _, tail = rest.split(end, 1)
    return f"{head}{start}\n{body}\n{end}{tail}"


def render_readmes(data: dict[str, Any], cache: dict[str, Any], verified: str | None = None) -> dict[Path, str]:
    """Return every README with its blocks (and optionally the verified date) rendered."""
    out: dict[Path, str] = {}
    for readme in data["translations"]:
        path = ROOT / readme
        text = path.read_text(encoding="utf-8")
        for name in BLOCKS:
            text = replace_block(text, name, render_block(name, readme, cache, data), readme)
        if verified:
            text = replace_verified(text, verified, readme)
        out[path] = text
    return out


def replace_verified(text: str, date: str, where: str) -> str:
    """Replace every ``<!-- verified-at -->…<!-- /verified-at -->`` date in ``text``."""
    pattern = re.compile(r"(<!-- verified-at -->)\d{4}-\d{2}-\d{2}(<!-- /verified-at -->)")
    if not pattern.search(text):
        raise ValueError(f"{where}: no verified-at marker")
    return pattern.sub(rf"\g<1>{date}\g<2>", text)


def main(argv: list[str] | None = None) -> int:
    """Refresh, render or check the live blocks."""
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    parser.add_argument("--refresh", action="store_true", help="fetch the feed and Zenodo into tools/feeds.json first")
    parser.add_argument("--check", action="store_true", help="fail if any README block differs from the cache")
    parser.add_argument("--verified", metavar="YYYY-MM-DD", help="set verified_at in the manifest and the READMEs")
    args = parser.parse_args(argv)

    data = json.loads(MANIFEST.read_text(encoding="utf-8"))
    if args.verified:
        dt.date.fromisoformat(args.verified)
        data["verified_at"] = args.verified
    cache = refresh(data) if args.refresh else json.loads(CACHE.read_text(encoding="utf-8"))
    rendered = render_readmes(data, cache, args.verified)
    if args.check:
        stale = [path for path, text in rendered.items() if path.read_text(encoding="utf-8") != text]
        for path in stale:
            print(f"ERROR: README block out of date: {path.relative_to(ROOT)}")
        if stale:
            return 1
        print(f"Live blocks are current ({len(rendered)} files, cache {cache['fetched_at']}).")
        return 0
    for path, text in rendered.items():
        if path.read_text(encoding="utf-8") != text:
            path.write_text(text, encoding="utf-8")
            print(f"updated {path.relative_to(ROOT)}")
    if args.verified:
        text = MANIFEST.read_text(encoding="utf-8")
        text, count = re.subn(r'"verified_at": "\d{4}-\d{2}-\d{2}"', f'"verified_at": "{args.verified}"', text)
        if count != 1:
            raise ValueError("manifest verified_at not found exactly once")
        MANIFEST.write_text(text, encoding="utf-8")
        print(f"verified_at set to {args.verified}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
