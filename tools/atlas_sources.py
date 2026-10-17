# SPDX-License-Identifier: AGPL-3.0-or-later
# Commercial license available
# © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
# © Code 2020–2026 Miroslav Šotek. All rights reserved.
# ORCID: 0009-0009-3560-0851
# Contact: www.anulum.li | protoscience@anulum.li
# ANULUM — Captured technical source and citation integrity
"""Verify reading-view fingerprints, versioned documents and exact cited passages."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from pathlib import Path
from typing import cast

RECORD_SECTIONS = (
    "inputs",
    "outputs",
    "components",
    "connections",
    "limits",
    "external_roles",
    "model_layers",
    "source_notes",
    "implementation",
)


def _rows(value: object) -> list[dict[str, object]]:
    """Require object records with string keys."""
    if not isinstance(value, list) or any(
        not isinstance(row, dict) or any(not isinstance(key, str) for key in row) for row in value
    ):
        raise ValueError("Technical source records must be objects")
    return cast(list[dict[str, object]], value)


def _text(value: object) -> str:
    """Require supplied nonempty text."""
    if not isinstance(value, str) or not value.strip():
        raise ValueError("Technical source text is missing")
    return value


def _identity(value: object) -> dict[str, object]:
    """Require one string-keyed object."""
    return _rows([value])[0]


def validate(value: object) -> None:
    """Check that every explanation resolves to the captured source it cites.

    Parameters
    ----------
    value : object
        Complete decoded technical-explanation dataset, including its library.

    Raises
    ------
    ValueError
        Document identities, projected bytes, references or narratives disagree.

    Notes
    -----
    This checks documentary correspondence. Original source bytes, semantic
    correctness, source-owner acceptance and scientific execution need their
    own evidence. A reference's original fingerprint must match its document
    declaration; it is not independently recomputed from the reading view.
    """
    data = _identity(value)
    library = _identity(data.get("library"))
    documents: dict[tuple[str, str], dict[str, object]] = {}
    owners: set[str] = set()
    for project in _rows(library.get("projects")):
        owner = _text(project.get("project_id"))
        if owner in owners:
            raise ValueError("Duplicate technical source owner")
        owners.add(owner)
        for document in _rows(project.get("documents")):
            key = (owner, _text(document.get("label")))
            if key in documents:
                raise ValueError("Duplicate versioned technical document")
            lines = document.get("lines")
            if not isinstance(lines, list) or not lines or any(not isinstance(line, str) for line in lines):
                raise ValueError("Technical document lines must be text")
            for name in ("source_sha256", "projection_sha256"):
                if not re.fullmatch(r"[0-9a-f]{64}", _text(document.get(name))):
                    raise ValueError("Invalid technical source fingerprint")
            raw = "\n".join(cast(list[str], lines)).encode()
            if hashlib.sha256(raw).hexdigest() != document["projection_sha256"]:
                raise ValueError("Technical reading view fingerprint differs")
            documents[key] = document
    references: set[str] = set()
    for reference in _rows(data.get("references")):
        identity = _text(reference.get("id"))
        key = (_text(reference.get("project")), _text(reference.get("document")))
        if identity in references or key not in documents:
            raise ValueError("Duplicate or unresolved technical reference")
        document = documents[key]
        for name in ("source_sha256", "projection_sha256", "captured_at_utc"):
            if _text(reference.get(name)) != _text(document.get(name)):
                raise ValueError("Technical reference source binding differs")
        first, last = reference.get("start"), reference.get("end")
        lines = cast(list[str], document["lines"])
        if type(first) is not int or type(last) is not int or not 1 <= first <= last <= len(lines):
            raise ValueError("Technical reference interval is outside its document")
        if reference.get("excerpt") != "\n".join(lines[first - 1 : last]):
            raise ValueError("Technical reference excerpt differs")
        references.add(identity)
    guides = _rows(data.get("guides"))
    if not guides:
        raise ValueError("Technical explanations are missing")
    identities: set[str] = set()
    for guide in guides:
        identity = _text(guide.get("project_id"))
        if identity in identities:
            raise ValueError("Duplicate technical explanation")
        identities.add(identity)
        records = _rows([guide.get("purpose"), guide.get("scope")])
        for section in RECORD_SECTIONS:
            records.extend(_rows(guide.get(section, [])))
        for record in records:
            _text(record.get("text"))
            ids = record.get("references")
            if (
                not isinstance(ids, list)
                or not ids
                or any(not isinstance(item, str) or item not in references for item in ids)
            ):
                raise ValueError("Technical narrative has unresolved source references")


def main(argv: list[str] | None = None) -> int:
    """Read a complete dataset and return its documentary integrity status.

    Parameters
    ----------
    argv : list[str] or None
        Optional command-line arguments; the sole positional argument is JSON.

    Returns
    -------
    int
        Zero for a coherent dataset; one for unreadable or inconsistent input.
    """
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("dataset", type=Path)
    args = parser.parse_args(argv)
    try:
        validate(json.loads(args.dataset.read_bytes()))
    except (OSError, ValueError):
        print("Atlas source validation failed.")
        return 1
    print("Atlas source passages and reading-view fingerprints verified.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
