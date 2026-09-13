#!/usr/bin/env python3
# SPDX-License-Identifier: AGPL-3.0-or-later
"""Validate the profile inventory and its rendered source surfaces."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "profile-data.json"
LEGACY_ASSETS = ("assets/profile-header.svg", "assets/ecosystem-map.svg")


def expected_counts_line(data: dict[str, Any]) -> str:
    """Recompute the ``counts:`` line every rendered SVG must carry in its ``<desc>``.

    Computed independently of ``render_profile_assets.py`` so the gate checks the
    pictures against the manifest, not against the renderer's own arithmetic.
    """
    per: list[tuple[str, int, int]] = []
    for portfolio in data["portfolios"]:
        repos = portfolio["repositories"]
        per.append(
            (
                portfolio["id"],
                sum(1 for repo in repos if repo["access"] == "public"),
                sum(1 for repo in repos if repo["access"] == "private"),
            )
        )
    groups = " ".join(f"{key}={public}/{private}" for key, public, private in per)
    return (
        f"counts: portfolios={len(per)} repositories={sum(p + q for _, p, q in per)} "
        f"public={sum(p for _, p, _ in per)} private={sum(q for _, _, q in per)} "
        f"standalone={len(data['standalone_repositories'])} verified={data['verified_at']}; {groups}"
    )


def check_rendered_assets(data: dict[str, Any], readmes: dict[str, str]) -> list[str]:
    """Verify the generated SVGs exist, carry the manifest counts, and are what every README embeds."""
    errors: list[str] = []
    expected = expected_counts_line(data)
    assets = data["rendered_assets"]
    for relative in assets:
        path = ROOT / relative
        if not path.is_file():
            errors.append(f"missing rendered asset: {relative}")
            continue
        text = path.read_text(encoding="utf-8")
        if expected not in text:
            errors.append(f"{relative}: <desc> counts differ from the manifest (re-run tools/render_profile_assets.py)")
        if "<text" in text:
            errors.append(f"{relative}: contains <text> elements; glyphs must be outlined")
    for relative in LEGACY_ASSETS:
        if (ROOT / relative).exists():
            errors.append(f"legacy hand-drawn asset still present: {relative}")
    for relative, text in readmes.items():
        for asset in assets:
            if f'srcset="{asset}"' not in text:
                errors.append(f"{relative}: <picture> block does not reference {asset}")
        for legacy in LEGACY_ASSETS:
            if legacy in text:
                errors.append(f"{relative}: still references legacy asset {legacy}")
    return errors


def main() -> int:
    """Run every offline profile check and return the process exit code."""
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
    repositories = [repository for portfolio in portfolios for repository in portfolio["repositories"]]
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
        if "/blob/main/" in url:
            errors.append(f"evidence URL is mutable: {url}")

    if data["verified_at"] not in english:
        errors.append("README.md: missing manifest verification date")

    for doi in data["dois"]:
        if f"https://doi.org/{doi}" not in english:
            errors.append(f"README.md: missing DOI {doi}")

    for relative in data["cv"].values():
        if not (ROOT / relative).is_file():
            errors.append(f"missing CV or publication surface: {relative}")

    resume_path = ROOT / data["cv"]["json_resume"]
    if resume_path.is_file():
        json.loads(resume_path.read_text(encoding="utf-8"))
    pdf_path = ROOT / data["cv"]["pdf"]
    if pdf_path.is_file() and not pdf_path.read_bytes().startswith(b"%PDF-"):
        errors.append(f"invalid PDF header: {data['cv']['pdf']}")

    if not (ROOT / "assets" / "anulum-logo.jpg").is_file():
        errors.append("missing profile asset: assets/anulum-logo.jpg")
    errors.extend(check_rendered_assets(data, readmes))

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
