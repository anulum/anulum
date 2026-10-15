#!/usr/bin/env python3
# SPDX-License-Identifier: AGPL-3.0-or-later
# Commercial license available
# © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
# © Code 2020–2026 Miroslav Šotek. All rights reserved.
# ORCID: 0009-0009-3560-0851
# Contact: www.anulum.li | protoscience@anulum.li
# ANULUM profile catalogue rendering and consistency checks
"""Render dated, multilingual catalogue and package sections from the profile inventory."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
LANGUAGES = {
    "README.md": "en",
    "README.de.md": "de",
    "README.sk.md": "sk",
    "README.zh-CN.md": "zh",
    "README.ja.md": "ja",
}


def marker(section: str, edge: str) -> str:
    """Return a bounded generated-section marker."""
    return f"<!-- profile-catalogue:{section}:{edge} -->"


def cell(value: str) -> str:
    """Escape source strings for a Markdown table without introducing raw HTML."""
    return (
        value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("|", "&#124;").replace("\n", " ")
    )


def render_catalogue(data: dict[str, Any], language: str) -> str:
    """Render the six group inventories, preserving repository and destination denominators."""
    tr = data["catalogue_locales"][language]
    stats = data["stats"]
    values = {
        "repositories": stats["portfolio_repositories"],
        "public": stats["public_portfolio_repositories"],
        "private": stats["private_portfolio_repositories"],
        "unpublished": stats["unpublished_portfolio_repositories"],
        "destinations": stats["catalogue_entries"] - stats["portfolio_repositories"],
    }
    lines = [
        f"**{tr['snapshot']}: {data['catalogue_as_of']}**",
        "",
        tr["summary"].format(**values),
        "",
        tr["source"],
        "",
        '<p align="center">',
        '  <img alt="Portfolio repositories" src="assets/badges/mapped-repositories.svg">',
        '  <img alt="Research groups" src="assets/badges/portfolios.svg">',
        '  <img alt="Public repositories" src="assets/badges/public-projects.svg">',
        '  <img alt="Private repositories" src="assets/badges/private-systems.svg">',
        "</p>",
        "",
        '<p align="center"><picture>',
        '  <source media="(prefers-color-scheme: dark)" srcset="assets/ecosystem-map-dark.svg">',
        '  <source media="(prefers-color-scheme: light)" srcset="assets/ecosystem-map-light.svg">',
        '  <img src="assets/ecosystem-map-dark.svg" width="1200" alt="Anulum: six research groups">',
        "</picture></p>",
        "",
        tr["atlas"],
        "",
        f"[{tr['catalogue']}](docs/atlas/README.md) · [anulum.li/portfolio/](https://anulum.li/portfolio/)",
        "",
        tr["scope"],
        "",
    ]
    for index, group in enumerate(data["portfolios"]):
        rows = [row for row in data["catalogue"] if row["group"] == group["id"]]
        title = f"{index + 1:02d} · {group['name']}"
        lines += [
            "<details>",
            f"<summary><strong>{title}</strong> · {len(group['repositories'])} {tr['repo_count']} · "
            f"{len(rows)} {tr['entry_count']}</summary>",
            "",
            tr["formation"] if group["id"] == "discovery" else tr["descriptions"][index],
            "",
        ]
        if group["id"] in data["group_map_urls"]:
            lines += [f"[{tr['maps']}]({data['group_map_urls'][group['id']]})", ""]
        if rows:
            lines += ["| " + " | ".join(tr["labels"]) + " |", "|---|---|---|---|---|"]
        for row in rows:
            name = cell(row["name"])
            project = f"[{name}]({row['url']})" if row["url"] else name
            role = f"{tr['status']} · {cell(row['kind'])} · {cell(row['stage'])}"
            access = tr[row["access"]] if row["repository"] else tr["destination"]
            lines.append(
                f"| {project}<br><sub>{cell(row['scope'])}</sub> | {role} | {access} | "
                f"{cell(row['licence'])} | {row['source_date']} |"
            )
        shared = [row["name"] for row in data["catalogue"] if group["id"] in row["shared_with"]]
        if shared:
            lines += ["", "↔ " + " · ".join(shared)]
        if group["id"] == "reactor":
            urls = [data["reactor_hub"], data["reactor_compare"]] + [f["url"] for f in data["reactor_families"]]
            lines += [
                "",
                f"**{tr['portals']}**: " + " · ".join(f"[{url.rstrip('/').rsplit('/', 1)[-1]}]({url})" for url in urls),
            ]
        lines += ["", "</details>", ""]
    lines += [f"**{tr['other']}**", "", tr["other_note"], ""]
    for repository in data["standalone_repositories"]:
        lines.append(f"- [{repository['name']}]({repository['url']}) · {tr['status']} · AGPL-3.0-or-later · 2026-10-15")
    return "\n".join(lines).rstrip()


def render_packages(data: dict[str, Any], language: str) -> str:
    """Render dated versions without implying DOI or hardware equivalence."""
    tr = data["catalogue_locales"][language]
    lines = [
        tr["packages_note"].format(packages=len(data["package_versions"]), date=data["catalogue_as_of"]),
        "",
        "<details>",
        f"<summary><strong>{tr['packages']}</strong> · {len(data['package_versions'])}</summary>",
        "",
        f"| PyPI | {tr['version']} |",
        "|---|---|",
    ]
    lines += [
        f"| [{x['name']}](https://pypi.org/project/{x['name']}/) | {x['version']} |" for x in data["package_versions"]
    ]
    return "\n".join(lines + ["", "</details>"])


def render_partner(data: dict[str, Any], language: str) -> str:
    """Render the owner-authorised founding offer, separately from sponsorship."""
    tr = data["catalogue_locales"][language]
    return f"### {tr['partner_title']}\n\n{tr['partner']}"


def replace_section(text: str, section: str, body: str) -> str:
    """Replace one explicitly delimited section; refuse absent or duplicate bounds."""
    start, end = marker(section, "start"), marker(section, "end")
    if text.count(start) != 1 or text.count(end) != 1:
        raise ValueError(f"{section}: expected one start and end marker")
    before, rest = text.split(start)
    previous, after = rest.split(end)
    if end in before or start in after:
        raise ValueError(f"{section}: reversed or nested markers")
    return before + start + "\n" + body + "\n" + end + after


def render_readmes(data: dict[str, Any], root: Path = ROOT) -> dict[Path, str]:
    """Project the same inventory and versions into all five existing README structures."""
    result = {}
    for filename in data["translations"]:
        language = LANGUAGES[filename]
        text = (root / filename).read_text(encoding="utf-8")
        for section, body in [
            ("inventory", render_catalogue(data, language)),
            ("packages", render_packages(data, language)),
            ("partner", render_partner(data, language)),
        ]:
            text = replace_section(text, section, body)
        result[root / filename] = text
    return result


def validate_inventory(data: dict[str, Any], root: Path = ROOT) -> list[str]:
    """Check source binding, unique identities, access boundaries and repository classification."""
    errors = []
    rows = data["catalogue"]
    ids = [row["id"].casefold() for row in rows]
    if len(ids) != len(set(ids)):
        errors.append("duplicate catalogue identity")
    groups = {group["id"] for group in data["portfolios"]}
    actual = {row["id"] for row in rows if row["repository"]}
    listed = {row["id"] for group in data["portfolios"] for row in group["repositories"]}
    if actual != listed:
        errors.append("catalogue and portfolio repository membership differ")
    for row in rows:
        if row["group"] not in groups or row["work_status"] != "in-progress":
            errors.append(f"{row['id']}: invalid group or work status")
        if row["access"] not in {"public", "private", "unpublished"}:
            errors.append(f"{row['id']}: invalid access")
        if bool(row["url"]) != (row["access"] == "public"):
            errors.append(f"{row['id']}: public URL/access mismatch")
        if row["local_repository"] and not row["repository"]:
            errors.append(f"{row['id']}: local Git repository omitted from repository inventory")
    packages = [entry["name"] for entry in data["package_versions"]]
    if len(packages) != len(set(packages)) or packages != data["pypi_projects"]:
        errors.append("package versions and publication inventory differ")
    for source in data["inventory_sources"]:
        if "path" in source:
            digest = hashlib.sha256((root / source["path"]).read_bytes()).hexdigest()
            if digest != source["sha256"]:
                errors.append(f"source changed; reconcile the dated inventory: {source['path']}")
    return errors


def check(data: dict[str, Any], root: Path = ROOT) -> list[str]:
    """Return inventory defects and stale generated language sections."""
    errors = validate_inventory(data, root)
    try:
        for path, rendered in render_readmes(data, root).items():
            if path.read_text(encoding="utf-8") != rendered:
                errors.append(f"{path.name}: stale catalogue section")
    except (ValueError, KeyError) as exc:
        errors.append(str(exc))
    return errors


def main() -> int:
    """Write the bounded sections or check drift without changing the tree."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true")
    parser.add_argument("--root", type=Path, default=ROOT)
    args = parser.parse_args()
    data = json.loads((args.root / "profile-data.json").read_text(encoding="utf-8"))
    errors = validate_inventory(data, args.root)
    if not errors and not args.check:
        for path, text in render_readmes(data, args.root).items():
            path.write_text(text, encoding="utf-8")
    elif not errors:
        errors = check(data, args.root)
    for error in errors:
        print(f"ERROR: {error}")
    return bool(errors)


if __name__ == "__main__":
    raise SystemExit(main())
