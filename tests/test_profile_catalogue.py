# SPDX-License-Identifier: AGPL-3.0-or-later
# Commercial license available
# © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
# © Code 2020–2026 Miroslav Šotek. All rights reserved.
# ORCID: 0009-0009-3560-0851
# Contact: www.anulum.li | protoscience@anulum.li
# ANULUM public catalogue refresh and refusal tests
"""Exercise the actual catalogue CLI against editable copies of the public profile."""

from __future__ import annotations

import json
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]


class ProfileCatalogueTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary = tempfile.TemporaryDirectory(prefix="anulum-catalogue-")
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.data: dict[str, Any] = json.loads((ROOT / "profile-data.json").read_text())
        for filename in self.data["translations"]:
            shutil.copy2(ROOT / filename, self.root / filename)
        for source in self.data["inventory_sources"]:
            if "path" in source:
                target = self.root / source["path"]
                target.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(ROOT / source["path"], target)

    def cli(self, *, check: bool = True) -> subprocess.CompletedProcess[str]:
        (self.root / "profile-data.json").write_text(json.dumps(self.data, ensure_ascii=False))
        return subprocess.run(
            [sys.executable, str(ROOT / "tools/profile_catalogue.py"), "--root", str(self.root)]
            + (["--check"] if check else []),
            capture_output=True,
            text=True,
            check=False,
        )

    def test_current_public_profile_passes_without_writes(self) -> None:
        before = {path.name: path.read_bytes() for path in self.root.glob("README*.md")}
        result = self.cli()
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertEqual(before, {path.name: path.read_bytes() for path in self.root.glob("README*.md")})

    def test_changed_package_version_requires_all_languages_to_refresh(self) -> None:
        self.data["package_versions"][0]["version"] = "99.0.0-review-fixture"
        stale = self.cli()
        self.assertNotEqual(stale.returncode, 0)
        for filename in self.data["translations"]:
            self.assertIn(filename, stale.stdout)
        refreshed = self.cli(check=False)
        self.assertEqual(refreshed.returncode, 0, refreshed.stdout + refreshed.stderr)
        self.assertEqual(self.cli().returncode, 0)
        for filename in self.data["translations"]:
            self.assertIn("99.0.0-review-fixture", (self.root / filename).read_text())

    def test_refresh_preserves_news_sponsorship_and_unmanaged_content(self) -> None:
        originals = {}
        for filename in self.data["translations"]:
            text = (self.root / filename).read_text()
            originals[filename] = text
        self.data["catalogue"][0]["scope"] += " & <review-fixture> | source text"
        result = self.cli(check=False)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        for filename, original in originals.items():
            actual = (self.root / filename).read_text()
            for block in ["releases", "publication"]:
                start, end = f"<!-- profile-feeds:{block}:start -->", f"<!-- profile-feeds:{block}:end -->"
                self.assertEqual(original.split(start)[1].split(end)[0], actual.split(start)[1].split(end)[0])
            self.assertIn("&amp; &lt;review-fixture&gt; &#124; source text", actual)
            self.assertIn(original.split("<!-- profile-catalogue:partner:end -->")[1], actual)

    def test_private_repository_url_is_refused(self) -> None:
        private = next(row for row in self.data["catalogue"] if row["access"] == "private")
        private["url"] = "https://github.com/anulum/private-review-fixture"
        result = self.cli(check=False)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("public URL/access mismatch", result.stdout)
        for filename in self.data["translations"]:
            self.assertNotIn("private-review-fixture", (self.root / filename).read_text())

    def test_repository_and_destination_double_count_is_refused(self) -> None:
        self.data["catalogue"][0]["repository"] = False
        result = self.cli()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("repository membership differ", result.stdout)
        self.assertIn("local Git repository omitted", result.stdout)

    def test_duplicate_identity_and_unknown_group_are_refused(self) -> None:
        self.data["catalogue"][1]["id"] = self.data["catalogue"][0]["id"].lower()
        self.data["catalogue"][1]["group"] = "unknown"
        self.data["catalogue"][1]["work_status"] = "completed"
        result = self.cli()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("duplicate catalogue identity", result.stdout)
        self.assertIn("invalid group or work status", result.stdout)

    def test_source_change_requires_explicit_reconciliation(self) -> None:
        source = next(x for x in self.data["inventory_sources"] if "path" in x)
        path = self.root / source["path"]
        path.write_bytes(path.read_bytes() + b"\n")
        result = self.cli()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("reconcile the dated inventory", result.stdout)

    def test_missing_generation_boundary_is_refused(self) -> None:
        path = self.root / "README.sk.md"
        path.write_text(path.read_text().replace("<!-- profile-catalogue:inventory:end -->", ""))
        result = self.cli()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("expected one start and end marker", result.stdout)

    def test_distribution_inventory_mismatch_is_refused(self) -> None:
        self.data["pypi_projects"].pop()
        result = self.cli()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("package versions and publication inventory differ", result.stdout)


if __name__ == "__main__":
    unittest.main()
