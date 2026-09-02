#!/usr/bin/env python3
# SPDX-License-Identifier: AGPL-3.0-or-later
"""Validate the profile inventory and its rendered source surfaces."""

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "profile-data.json"


def main() -> int:
    data = json.loads(MANIFEST.read_text(encoding="utf-8"))
    errors: list[str] = []

    translations = data["translations"]
    readmes: dict[str, str] = {}
    for relative in translations:
        path = ROOT / relative
        if not path.is_file():
            errors.append(f"missing translation: {relative}")
            continue
        readmes[relative] = path.read_text(encoding="utf-8")

    portfolios = data["portfolios"]
    repositories = [
        repository
        for portfolio in portfolios
        for repository in portfolio["repositories"]
    ]
    public = [repo for repo in repositories if repo["access"] == "public"]
    private = [repo for repo in repositories if repo["access"] == "private"]
    stats = data["stats"]

    checks = {
        "portfolio_repositories": len(repositories),
        "public_portfolio_repositories": len(public),
        "private_portfolio_repositories": len(private),
        "standalone_public_repositories": len(data["standalone_repositories"]),
        "pypi_projects": len(data["pypi_projects"]),
    }
    for key, observed in checks.items():
        if stats[key] != observed:
            errors.append(f"{key}: manifest says {stats[key]}, observed {observed}")

    names = [repo["name"] for repo in repositories]
    if len(names) != len(set(names)):
        errors.append("portfolio repository names are not unique")

    public_urls = [repo["url"] for repo in public]
    standalone_urls = [repo["url"] for repo in data["standalone_repositories"]]
    if any(url is None for url in public_urls + standalone_urls):
        errors.append("a public repository is missing its URL")
    if any(repo["url"] is not None for repo in private):
        errors.append("a private repository exposes a URL")

    required_urls = [*public_urls, *standalone_urls]
    required_private_names = [repo["name"] for repo in private]
    for relative, text in readmes.items():
        for translation in translations:
            if translation not in text:
                errors.append(f"{relative}: missing language link {translation}")
        for url in required_urls:
            if url not in text:
                errors.append(f"{relative}: missing public repository URL {url}")
        for name in required_private_names:
            if name not in text:
                errors.append(f"{relative}: missing private portfolio name {name}")
        if data["profile"]["pypi"] not in text:
            errors.append(f"{relative}: missing PyPI profile")
        if "—" in text:
            errors.append(f"{relative}: contains a forbidden em dash")
        for forbidden in data["forbidden_public_names"]:
            if forbidden in text:
                errors.append(f"{relative}: exposes forbidden name {forbidden}")

    english = readmes.get("README.md", "")
    for project in data["pypi_projects"]:
        url = f"https://pypi.org/project/{project}/"
        if url not in english:
            errors.append(f"README.md: missing PyPI project URL {url}")
    for url in data["evidence_links"]:
        if url not in english:
            errors.append(f"README.md: missing evidence URL {url}")

    for asset in ("assets/profile-header.svg", "assets/ecosystem-map.svg", "assets/anulum-logo.jpg"):
        if not (ROOT / asset).is_file():
            errors.append(f"missing profile asset: {asset}")

    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        return 1

    print(
        "Profile validation passed: "
        f"{len(portfolios)} portfolios, {len(repositories)} portfolio repositories, "
        f"{len(public) + len(data['standalone_repositories'])} public projects, "
        f"{len(data['pypi_projects'])} PyPI projects, {len(readmes)} languages."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
