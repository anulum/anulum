# SPDX-License-Identifier: AGPL-3.0-or-later
# Commercial license available
# © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
# © Code 2020–2026 Miroslav Šotek. All rights reserved.
# ORCID: 0009-0009-3560-0851
# Contact: www.anulum.li | protoscience@anulum.li
# ANULUM — Actual technical source and citation validation tests
"""Exercise the complete captured corpus through its public validator and CLI."""

from __future__ import annotations

import contextlib
import copy
import io
import json
import subprocess
import sys
import tempfile
import unittest
from collections.abc import Callable
from pathlib import Path
from typing import Any

from tools import atlas_sources

ROOT = Path(__file__).resolve().parents[1]


class AtlasSourceTests(unittest.TestCase):
    def setUp(self) -> None:
        self.data: dict[str, Any] = json.loads((ROOT / "docs/atlas/technical_explanations_candidate.json").read_bytes())
        self.document_project_index = next(
            index for index, row in enumerate(self.data["library"]["projects"]) if row["documents"]
        )

    def test_complete_corpus_and_cli_do_not_modify_the_source(self) -> None:
        path = ROOT / "docs/atlas/technical_explanations_candidate.json"
        before = path.read_bytes()
        atlas_sources.validate(self.data)
        result = subprocess.run(
            [sys.executable, str(ROOT / "tools/atlas_sources.py"), str(path)],
            capture_output=True,
            text=True,
            check=False,
            timeout=30,
        )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertEqual(path.read_bytes(), before)

    def test_captured_document_identity_and_projection_refusals(self) -> None:
        mutations: list[Callable[[dict[str, Any]], None]] = [
            lambda d: d.__setitem__("library", None),
            lambda d: d["library"].__setitem__("projects", None),
            lambda d: d["library"].__setitem__("projects", [None]),
            lambda d: d["library"]["projects"][0].__setitem__("project_id", ""),
            lambda d: d["library"]["projects"].append(copy.deepcopy(d["library"]["projects"][0])),
            lambda d: d["library"]["projects"][self.document_project_index]["documents"].append(
                copy.deepcopy(d["library"]["projects"][self.document_project_index]["documents"][0])
            ),
            lambda d: d["library"]["projects"][self.document_project_index]["documents"][0].__setitem__("label", None),
            lambda d: d["library"]["projects"][self.document_project_index]["documents"][0].__setitem__("lines", None),
            lambda d: d["library"]["projects"][self.document_project_index]["documents"][0].__setitem__("lines", []),
            lambda d: d["library"]["projects"][self.document_project_index]["documents"][0]["lines"].append(12),
            lambda d: d["library"]["projects"][self.document_project_index]["documents"][0].__setitem__(
                "source_sha256", "changed"
            ),
            lambda d: d["library"]["projects"][self.document_project_index]["documents"][0].__setitem__(
                "projection_sha256", "0" * 64
            ),
            lambda d: d["library"]["projects"][self.document_project_index]["documents"][0]["lines"].append(
                "Unrecorded source edit"
            ),
        ]
        self.refuse_mutations(mutations)
        with self.assertRaises(ValueError):
            atlas_sources.validate([self.data])
        invalid: dict[object, object] = {key: value for key, value in self.data.items()}
        invalid[12] = invalid.pop("library")
        with self.assertRaises(ValueError):
            atlas_sources.validate(invalid)

    def test_exact_reference_identity_interval_and_excerpt_refusals(self) -> None:
        mutations: list[Callable[[dict[str, Any]], None]] = [
            lambda d: d["references"].append(copy.deepcopy(d["references"][0])),
            lambda d: d["references"][0].__setitem__("document", "Missing version"),
            lambda d: d["references"][0].__setitem__("source_sha256", "0" * 64),
            lambda d: d["references"][0].__setitem__("projection_sha256", "0" * 64),
            lambda d: d["references"][0].__setitem__("captured_at_utc", "Different capture"),
            lambda d: d["references"][0].__setitem__("start", True),
            lambda d: d["references"][0].__setitem__("end", "30"),
            lambda d: d["references"][0].__setitem__("start", 0),
            lambda d: d["references"][0].__setitem__("end", 10**9),
            lambda d: d["references"][0].__setitem__("end", 1),
            lambda d: d["references"][0].__setitem__("excerpt", "Different passage"),
        ]
        self.refuse_mutations(mutations)

    def test_explanation_and_optional_current_implementation_need_sources(self) -> None:
        mutations: list[Callable[[dict[str, Any]], None]] = [
            lambda d: d.__setitem__("guides", []),
            lambda d: d["guides"].append(copy.deepcopy(d["guides"][0])),
            lambda d: d["guides"][0].__setitem__("purpose", None),
            lambda d: d["guides"][0]["scope"].__setitem__("text", " "),
            lambda d: d["guides"][0]["scope"].__setitem__("references", []),
            lambda d: d["guides"][0]["scope"].__setitem__("references", "Unbound"),
            lambda d: d["guides"][0]["scope"].__setitem__("references", [True]),
            lambda d: d["guides"][0]["scope"].__setitem__("references", ["Missing reference"]),
            lambda d: d["guides"][0].__setitem__("implementation", [d["guides"][0]["scope"] | {"references": []}]),
        ]
        self.refuse_mutations(mutations)

    def refuse_mutations(self, mutations: list[Callable[[dict[str, Any]], None]]) -> None:
        for index, mutate in enumerate(mutations):
            with self.subTest(index=index):
                data = copy.deepcopy(self.data)
                mutate(data)
                with self.assertRaises(ValueError):
                    atlas_sources.validate(data)

    def test_cli_actual_files_accept_and_refuse_without_exception_text(self) -> None:
        with tempfile.TemporaryDirectory(prefix="atlas-source-cli-") as directory:
            path = Path(directory) / "captured.json"
            path.write_text(json.dumps(self.data))
            output = io.StringIO()
            with contextlib.redirect_stdout(output):
                self.assertEqual(atlas_sources.main([str(path)]), 0)
                self.data["references"][0]["excerpt"] = "Wrong passage"
                path.write_text(json.dumps(self.data))
                self.assertEqual(atlas_sources.main([str(path)]), 1)
                path.write_bytes(b"{invalid JSON")
                self.assertEqual(atlas_sources.main([str(path)]), 1)
                self.assertEqual(atlas_sources.main([str(path.with_name("absent.json"))]), 1)
            self.assertNotIn("Traceback", output.getvalue())
            self.assertIn("Atlas source validation failed.", output.getvalue())


if __name__ == "__main__":
    unittest.main()
