# SPDX-License-Identifier: AGPL-3.0-or-later

import json
import re
import subprocess
import sys
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Any, ClassVar

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))

import render_badges as badges  # noqa: E402


class RenderBadgesTests(unittest.TestCase):
    data: ClassVar[dict[str, Any]]
    spec: ClassVar[list[dict[str, Any]]]
    rendered: ClassVar[dict[Path, str]]

    @classmethod
    def setUpClass(cls) -> None:
        cls.data = json.loads((ROOT / "profile-data.json").read_text(encoding="utf-8"))
        cls.spec = json.loads((ROOT / "tools" / "badges.json").read_text(encoding="utf-8"))
        cls.rendered = badges.render_all(cls.data, cls.spec)

    def test_every_badge_is_well_formed_svg_without_text_elements(self) -> None:
        for path, text in self.rendered.items():
            root = ET.fromstring(text)
            self.assertEqual(root.tag, "{http://www.w3.org/2000/svg}svg", path.name)
            self.assertNotIn("<text", text, path.name)
            self.assertIn("<title>", text, path.name)

    def test_counts_come_from_the_manifest(self) -> None:
        by_slug = {badges.output_path(e).name: e for e in self.spec}
        for name, entry in by_slug.items():
            wording = entry.get("label", "") + entry["message"]
            if "{stats." not in wording:
                continue
            resolved = badges.resolve(wording, self.data)
            self.assertNotIn("{stats.", resolved, name)
            self.assertIn(
                f"<title>{badges.resolve(entry.get('label', ''), self.data)}",
                self.rendered[badges.output_path(entry)],
                name,
            )
        self.assertIn(
            "<title>39: MAPPED REPOSITORIES</title>", self.rendered[badges.OUT_DIR / "mapped-repositories.svg"]
        )

    def test_manifest_change_changes_the_badge(self) -> None:
        mutated = json.loads(json.dumps(self.data))
        mutated["stats"]["pypi_projects"] = 21
        changed = badges.render_all(mutated, self.spec)
        self.assertNotEqual(
            changed[badges.OUT_DIR / "pypi-count.en.svg"], self.rendered[badges.OUT_DIR / "pypi-count.en.svg"]
        )
        self.assertEqual(changed[badges.OUT_DIR / "python.svg"], self.rendered[badges.OUT_DIR / "python.svg"])

    def test_cjk_wording_is_outlined_from_the_noto_subsets(self) -> None:
        for name in ("lang-zh.svg", "lang-ja.svg", "cv-pdf.zh.svg", "sponsors.ja.svg"):
            self.assertGreater(self.rendered[badges.OUT_DIR / name].count("<use "), 1, name)

    def test_text_colour_follows_luminance(self) -> None:
        self.assertEqual(badges.text_colour("D7FF64"), badges.DARK_TEXT)
        self.assertEqual(badges.text_colour("000000"), badges.LIGHT_TEXT)

    def test_duplicate_outputs_are_rejected(self) -> None:
        doubled = self.spec + [self.spec[0]]
        with self.assertRaises(ValueError):
            badges.render_all(self.data, doubled)

    def test_every_readme_badge_reference_has_a_rendered_file(self) -> None:
        rendered_names = {path.name for path in self.rendered}
        for readme in self.data["translations"]:
            text = (ROOT / readme).read_text(encoding="utf-8")
            self.assertNotIn("img.shields.io/badge/", text, readme)
            for ref in re.findall(r'src="assets/badges/([^"]+)"', text):
                self.assertIn(ref, rendered_names, f"{readme}: {ref}")

    def test_checked_in_badges_are_current(self) -> None:
        result = subprocess.run(
            [sys.executable, "tools/render_badges.py", "--check"], cwd=ROOT, capture_output=True, text=True, check=False
        )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
