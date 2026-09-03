#!/usr/bin/env python3
# SPDX-License-Identifier: AGPL-3.0-or-later
"""Bounded online checks for the public profile inventory."""

from __future__ import annotations

import concurrent.futures
import json
import os
import re
import socket
import time
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
RETRYABLE = {408, 425, 429, 500, 502, 503, 504}
TIMEOUT = 8.0
ATTEMPTS = 3
MAX_BODY = 1_048_576


@dataclass(frozen=True)
class Target:
    key: str
    kind: str
    url: str
    expected: str = ""


def pep503(name: str) -> str:
    return re.sub(r"[-_.]+", "-", name).lower()


def request_json(url: str) -> dict:
    headers = {"Accept": "application/json", "User-Agent": "anulum-profile-validator/1"}
    token = os.environ.get("GITHUB_TOKEN")
    if token and urllib.parse.urlparse(url).hostname == "api.github.com":
        headers["Authorization"] = f"Bearer {token}"
        headers["X-GitHub-Api-Version"] = "2022-11-28"
    request = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(request, timeout=TIMEOUT) as response:
        body = response.read(MAX_BODY + 1)
        if len(body) > MAX_BODY:
            raise ValueError("response exceeds 1 MiB")
        return json.loads(body)


def check(target: Target) -> tuple[str, str, str]:
    for attempt in range(ATTEMPTS):
        try:
            payload = request_json(target.url)
            if target.kind == "github-repository":
                if payload.get("full_name", "").lower() != target.expected.lower():
                    raise ValueError(f"returned {payload.get('full_name')!r}")
                if payload.get("private") or payload.get("visibility") != "public":
                    raise ValueError("repository is not public")
            elif target.kind == "github-file":
                if payload.get("type") != "file":
                    raise ValueError("target is not a file")
            elif target.kind == "pypi":
                actual = payload.get("info", {}).get("name", "")
                if pep503(actual) != pep503(target.expected):
                    raise ValueError(f"returned package {actual!r}")
                owners = {
                    role.get("user")
                    for role in payload.get("ownership", {}).get("roles", [])
                    if role.get("role") == "Owner"
                }
                if "anulum" not in owners:
                    raise ValueError("anulum is not listed as owner")
            elif target.kind == "doi":
                if payload.get("responseCode") != 1:
                    raise ValueError(f"Handle responseCode={payload.get('responseCode')!r}")
                if payload.get("handle", "").lower() != target.expected.lower():
                    raise ValueError("Handle identifier mismatch")
            return target.key, "PASS", ""
        except urllib.error.HTTPError as exc:
            if exc.code not in RETRYABLE:
                return target.key, "FAIL", f"HTTP {exc.code}"
            reason = f"HTTP {exc.code}"
        except (urllib.error.URLError, TimeoutError, socket.timeout) as exc:
            reason = type(exc).__name__
        except (json.JSONDecodeError, ValueError) as exc:
            return target.key, "FAIL", str(exc)
        if attempt + 1 < ATTEMPTS:
            time.sleep(0.5 * (2**attempt))
    return target.key, "UNAVAILABLE", reason


def evidence_target(url: str) -> Target:
    match = re.fullmatch(
        r"https://github\.com/([^/]+)/([^/]+)/blob/([0-9a-f]{40})/(.+)", url
    )
    if not match:
        raise ValueError(f"evidence link is not commit-pinned: {url}")
    owner, repository, ref, path = match.groups()
    quoted_path = urllib.parse.quote(path)
    api = f"https://api.github.com/repos/{owner}/{repository}/contents/{quoted_path}?ref={ref}"
    return Target(f"evidence:{repository}:{path}", "github-file", api)


def build_targets(data: dict) -> list[Target]:
    targets: list[Target] = []
    for portfolio in data["portfolios"]:
        for repository in portfolio["repositories"]:
            if repository["access"] != "public":
                continue
            slug = repository["url"].removeprefix("https://github.com/")
            targets.append(
                Target(f"github:{slug}", "github-repository", f"https://api.github.com/repos/{slug}", slug)
            )
    for repository in data["standalone_repositories"]:
        slug = repository["url"].removeprefix("https://github.com/")
        targets.append(
            Target(f"github:{slug}", "github-repository", f"https://api.github.com/repos/{slug}", slug)
        )
    for project in data["pypi_projects"]:
        targets.append(Target(f"pypi:{project}", "pypi", f"https://pypi.org/pypi/{project}/json", project))
    targets.extend(evidence_target(url) for url in data["evidence_links"])
    dois = list(data["dois"])
    for relative in ("README.md", "PUBLICATIONS.md"):
        text = (ROOT / relative).read_text(encoding="utf-8")
        for doi in re.findall(r"https://doi\.org/(10\.\d{4,9}/[A-Za-z0-9._/-]+)", text):
            if doi not in dois:
                dois.append(doi)
    targets.extend(
        Target(f"doi:{doi}", "doi", f"https://hdl.handle.net/api/handles/{doi}", doi)
        for doi in dois
    )
    return targets


def main() -> int:
    data = json.loads((ROOT / "profile-data.json").read_text(encoding="utf-8"))
    targets = build_targets(data)
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
        results = list(executor.map(check, targets))
    failures = 0
    for key, status, detail in results:
        print(f"{status:11} {key}{': ' + detail if detail else ''}")
        failures += status != "PASS"
    print(f"Online profile validation: {len(targets) - failures}/{len(targets)} passed")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
