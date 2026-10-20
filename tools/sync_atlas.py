# SPDX-License-Identifier: AGPL-3.0-or-later
# Commercial license available
# © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
# © Code 2020–2026 Miroslav Šotek. All rights reserved.
# ORCID: 0009-0009-3560-0851
# Contact: www.anulum.li | protoscience@anulum.li
# ANULUM — Import and verify the static research atlas

"""Import a fingerprinted atlas export or check the integrated static tree.

Only manifest-listed assets cross the import boundary. Existing local changes,
removed assets and unexpected destination files require explicit reconciliation.
Source dates, representations and qualification boundaries are retained.
JSON ownership sidecars and the drawing ownership wrapper are supplied here;
illustration credits use the public project identity.
"""

from __future__ import annotations

import argparse
import hashlib
import html
import json
import re
import sys
from pathlib import Path, PurePosixPath
from typing import cast

if not __package__:
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from tools.atlas_sources import validate as validate_sources

ROOT = Path(__file__).resolve().parents[1]
DESTINATION = ROOT / "docs" / "atlas"
MANIFEST = "atlas-manifest.json"
DATASETS = {
    "atlas-data": "public_atlas_data.json",
    "resource-data": "public_resources_data.json",
    "budget-data": "public_budget_data.json",
    "source-update-data": "source_update_candidate.json",
    "visual-data": "visual_catalogue.json",
    "direct-source-data": "direct_repository_sources.json",
    "document-library-data": "document_library_candidate.json",
    "technical-data": "technical_explanations_candidate.json",
}
FORBIDDEN = re.compile(
    rb"/(?:home|media)/anulum/|\.coordination/|docs/internal/|"
    rb"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|"
    rb"\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,})"
)
PUBLIC_LABELS = re.compile(rb"\bCEO (?:Codex|Claude)\b|\bP-00[12]\b|KYMA earlier bases|kyma-history:", re.IGNORECASE)
TEXT_SUFFIXES = {".html", ".css", ".js", ".json", ".svg", ".license"}


def _object(raw: bytes) -> dict[str, object]:
    value: object = json.loads(raw)
    if not isinstance(value, dict) or any(not isinstance(k, str) for k in value):
        raise ValueError("Manifest must be a JSON object")
    return cast(dict[str, object], value)


def _files(manifest: dict[str, object]) -> dict[str, str]:
    value = manifest.get("files")
    if not isinstance(value, dict) or not value:
        raise ValueError("Manifest requires a nonempty file inventory")
    result: dict[str, str] = {}
    for name, digest in value.items():
        if not isinstance(name, str) or not isinstance(digest, str):
            raise ValueError("File inventory requires string paths and fingerprints")
        path = PurePosixPath(name)
        if (
            path.is_absolute()
            or name != path.as_posix()
            or ".." in path.parts
            or "\\" in name
            or name in {MANIFEST, "README.md"}
            or path.suffix not in TEXT_SUFFIXES | {".pdf", ".png"}
        ):
            raise ValueError("Unsafe or unsupported atlas member")
        if not re.fullmatch(r"[0-9a-f]{64}", digest):
            raise ValueError("Invalid asset fingerprint")
        result[name] = digest
    if not {"index.html", *DATASETS.values()} <= result.keys():
        raise ValueError("Atlas entry page or required dataset missing")
    return result


def _read_members(root: Path, files: dict[str, str]) -> dict[str, bytes]:
    result: dict[str, bytes] = {}
    resolved = root.resolve()
    for name, expected in files.items():
        path = root / name
        if not path.resolve().is_relative_to(resolved) or path.is_symlink():
            raise ValueError("Atlas member escapes its source tree")
        raw = path.read_bytes()
        if hashlib.sha256(raw).hexdigest() != expected:
            raise ValueError("Atlas asset changed: " + name)
        if path.suffix in TEXT_SUFFIXES and FORBIDDEN.search(raw):
            raise ValueError("Internal path or credential material refused: " + name)
        if path.suffix in TEXT_SUFFIXES and PUBLIC_LABELS.search(raw):
            raise ValueError("Internal atlas attribution or experiment/proposal label refused: " + name)
        result[name] = raw
    return result


def _publication(members: dict[str, bytes]) -> None:
    """Check source rights against repository-owned policy before importing output."""
    policy = _object((ROOT / "tools/atlas_publication_policy.json").read_bytes())
    public = set(cast(list[str], policy["public_sources"]))
    public_guides = set(cast(list[str], policy["public_guides"]))
    withheld = cast(dict[str, dict[str, object]], policy["withheld_nodes"])
    denied = cast(list[str], policy["withheld_assets"])
    approved = cast(dict[str, list[str]], policy["approved_static_assets"])
    for name, raw in members.items():
        if name in denied or (
            PurePosixPath(name).suffix in {".svg", ".png", ".pdf"}
            and (name not in approved or hashlib.sha256(raw).hexdigest() not in approved[name])
        ):
            raise ValueError("Repository-internal contents are not publishable.")
    library = _object(members["document_library_candidate.json"])
    technical = _object(members["technical_explanations_candidate.json"])
    for corpus in [library, cast(dict[str, object], technical["library"])]:
        for row in cast(list[dict[str, object]], corpus["projects"]):
            if row["project_id"] not in public and row["documents"]:
                raise ValueError("Repository-internal contents are not publishable.")
    direct = _object(members["direct_repository_sources.json"])
    for row in cast(list[dict[str, object]], direct["projects"]):
        if row["project_id"] not in public and any(
            row[key]
            for key in (
                "documents",
                "declared_package_metadata",
                "boundary_declarations",
                "readme_excerpts",
                "architecture_documents",
            )
        ):
            raise ValueError("Repository-internal contents are not publishable.")
    if (
        any(row["project"] not in public for row in cast(list[dict[str, object]], technical["references"]))
        or any(row["project_id"] not in public_guides for row in cast(list[dict[str, object]], technical["guides"]))
        or any(key in withheld for key in cast(dict[str, object], technical["guide_source_captures"]))
    ):
        raise ValueError("Repository-internal contents are not publishable.")
    visual = _object(members["visual_catalogue.json"])
    updates = _object(members["source_update_candidate.json"])
    if any(row["project"] in withheld for row in cast(list[dict[str, str]], visual["illustrations"])) or any(
        row["project_id"] in withheld for row in cast(list[dict[str, str]], updates["projects"])
    ):
        raise ValueError("Repository-internal contents are not publishable.")
    atlas = _object(members["public_atlas_data.json"])
    for node in cast(list[dict[str, object]], atlas["nodes"]):
        identity = cast(str, node["id"])
        if identity in withheld and node != withheld[identity]:
            raise ValueError("Repository-internal contents are not publishable.")
    for edge in cast(list[dict[str, str]], atlas["edges"]):
        if (edge["from"] in withheld or edge["to"] in withheld) and edge != {
            "from": edge["from"],
            "to": edge["to"],
            "kind": edge["kind"],
            "evidence": "Architecture relationship; repository contents are not published.",
        }:
            raise ValueError("Repository-internal contents are not publishable.")
    pattern = r'<g\b(?=[^>]*\bclass="node")(?=[^>]*\bdata-id="([^"]+)")[^>]*>[\s\S]*?</g>'
    for card in re.finditer(pattern, members["atlas_full.html"].decode()):
        approved_node = withheld.get(card[1])
        if approved_node is not None:
            expected = html.escape(
                f"{approved_node['name']}: {approved_node['function']}\n"
                f"{approved_node['phase']}\nLicence: {approved_node['licence']}"
            )
            title = re.search(r"<title[^>]*>([\s\S]*?)</title>", card[0])
            if title is None or " ".join(title[1].split()) != " ".join(expected.split()):
                raise ValueError("Repository-internal contents are not publishable.")
            phase = (
                "architecture stage: a reviewed boundary and validation tooling, no model"
                if approved_node.get("repository_record")
                else "Contents are not published."
            )
            expected_label = html.escape(
                f"{approved_node['name']} {approved_node['work_status']} · {phase} Licence: {approved_node['licence']}"
            )
            label = re.search(r'\baria-label="([^"]*)"', card[0])
            if label is None or label[1] != expected_label:
                raise ValueError("Accessible label does not match the approved publication label.")
            description_id = "atlas-purpose-" + hashlib.sha256(str(approved_node["id"]).encode()).hexdigest()[:16]
            description = re.search(r'\baria-describedby="([^"]*)"', card[0])
            if description is None or description[1] != description_id or f'id="{description_id}"' not in title[0]:
                raise ValueError("Accessible description does not match the approved project purpose.")


def _content(members: dict[str, bytes]) -> None:
    _publication(members)
    html = members["index.html"].decode()
    for element, name in DATASETS.items():
        matches = re.findall(
            r'<script id="' + element + r'" type="application/json">(.*?)</script>',
            html,
            flags=re.DOTALL,
        )
        if len(matches) != 1 or json.loads(matches[0]) != json.loads(members[name]):
            raise ValueError("Embedded dataset differs: " + name)
    validate_sources(json.loads(members["technical_explanations_candidate.json"]))


def _ownership(label: str) -> str:
    return (
        "SPDX-License-Identifier: AGPL-3.0-or-later\n"
        "Commercial license available\n"
        "© Concepts 1996–2026 Miroslav Šotek. All rights reserved.\n"
        "© Code 2020–2026 Miroslav Šotek. All rights reserved.\n"
        "ORCID: 0009-0009-3560-0851\n"
        "Contact: www.anulum.li | protoscience@anulum.li\n"
        "ANULUM — " + label + "\n"
    )


def _project(members: dict[str, bytes]) -> dict[str, dict[str, str]]:
    changes: dict[str, dict[str, str]] = {}
    for name, original in list(members.items()):
        if name.endswith(".svg") and b"SPDX-License-Identifier:" not in original[:1000]:
            header = "<!--\n" + _ownership("Architecture illustration") + "-->\n"
            members[name] = header.encode() + original
            changes[name] = {
                "source_sha256": hashlib.sha256(original).hexdigest(),
                "projection_sha256": hashlib.sha256(members[name]).hexdigest(),
            }
    visual = _object(members["visual_catalogue.json"])
    illustrations = visual.get("illustrations")
    if not isinstance(illustrations, list) or any(not isinstance(row, dict) for row in illustrations):
        raise ValueError("Illustration catalogue must contain object records")
    for value in illustrations:
        row = cast(dict[str, object], value)
        drawing = row.get("asset")
        if isinstance(drawing, str) and drawing in changes:
            row["asset_sha256"] = hashlib.sha256(members[drawing]).hexdigest()
            row["author"] = "Concepts and code: Miroslav Šotek. Illustration prepared by Arcane Sapience."
    members["visual_catalogue.json"] = (json.dumps(visual, ensure_ascii=False, indent=2) + "\n").encode()
    payload = json.dumps(visual, ensure_ascii=False, separators=(",", ":")).replace("<", chr(92) + "u003c").encode()
    pattern = rb'(<script id="visual-data" type="application/json">)(.*?)(</script>)'
    members["index.html"] = re.sub(
        pattern, lambda match: match[1] + payload + match[3], members["index.html"], flags=re.DOTALL
    )
    for name in [*members, MANIFEST]:
        if name.endswith(".json"):
            members[name + ".license"] = (
                _ownership(PurePosixPath(name).name + " ownership")
                + "SPDX-FileCopyrightText: 1996-2026 Miroslav Šotek <protoscience@anulum.li> (concepts)\n"
                + "SPDX-FileCopyrightText: 2020-2026 Miroslav Šotek <protoscience@anulum.li> (code)\n"
            ).encode()
    return changes


def check(destination: Path = DESTINATION) -> dict[str, str]:
    """Check asset hashes, public boundaries and embedded dataset correspondence.

    Parameters
    ----------
    destination : Path
        Integrated atlas directory.

    Returns
    -------
    dict[str, str]
        Verified relative asset paths and SHA-256 fingerprints.

    Raises
    ------
    ValueError
        An asset, dataset, inventory or public boundary differs.
    """
    files = _files(_object((destination / MANIFEST).read_bytes()))
    actual = {p.relative_to(destination).as_posix() for p in destination.rglob("*") if p.is_file()}
    if actual - {MANIFEST, "README.md", "LICENSE"} != files.keys():
        raise ValueError("Atlas destination contains missing or unlisted files")
    _content(_read_members(destination, files))
    return files


def sync(source: Path, manifest: Path, expected_sha256: str, destination: Path = DESTINATION) -> None:
    """Import a pinned export after checking source and existing local ownership.

    Parameters
    ----------
    source : Path
        Static export directory.
    manifest : Path
        Export manifest containing version and exact file fingerprints.
    expected_sha256 : str
        Separately selected SHA-256 of the complete export manifest.
    destination : Path
        Integrated atlas directory.

    Raises
    ------
    ValueError
        Source custody, local edits or destination membership would be lost.
    """
    raw = manifest.read_bytes()
    if hashlib.sha256(raw).hexdigest() != expected_sha256:
        raise ValueError("Export manifest fingerprint mismatch")
    metadata = _object(raw)
    version = metadata.get("version")
    if not isinstance(version, str) or not version.strip():
        raise ValueError("Export version missing")
    files = _files(metadata)
    members = _read_members(source, files)
    projections = _project(members)
    files = {name: hashlib.sha256(raw).hexdigest() for name, raw in members.items()}
    _content(members)
    if destination.is_symlink():
        raise ValueError("Atlas destination must not be a symlink")
    if (destination / MANIFEST).exists():
        previous = check(destination)
        if previous.keys() - files.keys():
            raise ValueError("Export removes assets; reconcile retained content explicitly")
    elif destination.exists() and any(destination.iterdir()):
        raise ValueError("Unmanaged atlas destination is not empty")
    receipt = {
        "schema": "anulum-atlas-snapshot/1",
        "version": version,
        "source_manifest_sha256": expected_sha256,
        "qualification": "Development snapshot; source-content and scientific review remain open.",
        "ownership_projections": metadata.get("ownership_projections", projections),
        "files": files,
    }
    destination.mkdir(parents=True, exist_ok=True)
    for name, content in members.items():
        target = destination / name
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(content)
    (destination / MANIFEST).write_text(json.dumps(receipt, indent=2) + "\n")
    check(destination)


def main() -> int:
    """Run import or read-only verification of the integrated atlas.

    Returns
    -------
    int
        Zero for a verified tree; one for a refused import or invalid tree.
    """
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Verify without writing")
    parser.add_argument("--source", type=Path, help="Selected static export directory")
    parser.add_argument("--manifest", type=Path, help="Fingerprint inventory for that export")
    parser.add_argument("--expected-manifest-sha256", help="Selected manifest SHA-256")
    args = parser.parse_args()
    values = (args.source, args.manifest, args.expected_manifest_sha256)
    if args.check and any(values):
        parser.error("--check cannot be combined with import arguments")
    if not args.check and not all(values):
        parser.error("Provide --check or all three import arguments")
    try:
        if not args.check:
            sync(args.source, args.manifest, args.expected_manifest_sha256)
        files = check()
    except (OSError, ValueError) as exc:
        print(str(exc))
        return 1
    print(f"Atlas verified: {len(files)} assets and {len(DATASETS)} embedded datasets")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
