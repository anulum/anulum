# SPDX-License-Identifier: AGPL-3.0-or-later

import json
import subprocess
import sys
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Any, ClassVar

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))

import render_profile_assets as renderer  # noqa: E402
import validate_profile as validator  # noqa: E402


class RenderProfileAssetsTests(unittest.TestCase):
    data: ClassVar[dict[str, Any]]
    rendered: ClassVar[dict[Path, str]]

    @classmethod
    def setUpClass(cls) -> None:
        cls.data = json.loads((ROOT / "profile-data.json").read_text(encoding="utf-8"))
        cls.rendered = renderer.render_all(cls.data)

    def test_renders_every_declared_asset(self) -> None:
        declared = {ROOT / relative for relative in self.data["rendered_assets"]}
        self.assertEqual(set(self.rendered), declared)

    def test_counts_line_matches_independent_recomputation(self) -> None:
        expected = validator.expected_counts_line(self.data)
        for path, text in self.rendered.items():
            self.assertIn(expected, text, path.name)

    def test_text_is_outlined_and_names_are_present(self) -> None:
        for path, text in self.rendered.items():
            self.assertNotIn("<text", text, path.name)
            self.assertIn('aria-label="', text, path.name)
        header = self.rendered[ROOT / "assets" / "profile-header-dark.svg"]
        self.assertIn(f'aria-label="{self.data["profile"]["name"].upper()}"', header)
        graph = self.rendered[ROOT / "assets" / "ecosystem-map-light.svg"]
        for portfolio in self.data["portfolios"]:
            label = portfolio["short_name"].replace("&", "&amp;")
            self.assertIn(f'aria-label="{label}"', graph)

    def test_every_asset_is_well_formed_xml(self) -> None:
        for path, text in self.rendered.items():
            root = ET.fromstring(text)
            self.assertEqual(root.tag, "{http://www.w3.org/2000/svg}svg", path.name)
            glyphs = root.findall(".//{http://www.w3.org/2000/svg}use")
            name_glyphs = len(self.data["profile"]["name"].replace(" ", ""))
            self.assertGreaterEqual(len(glyphs), name_glyphs, path.name)

    def test_render_is_deterministic(self) -> None:
        again = renderer.render_all(self.data)
        self.assertEqual(again, self.rendered)

    def test_themes_share_geometry_and_differ_only_in_palette(self) -> None:
        dark = self.rendered[ROOT / "assets" / "ecosystem-map-dark.svg"]
        light = self.rendered[ROOT / "assets" / "ecosystem-map-light.svg"]
        self.assertNotEqual(dark, light)

        def strip(text: str) -> str:
            return "".join(ch for ch in text if ch not in "#0123456789abcdef")

        self.assertEqual(
            strip(dark.replace("dark theme", "")),
            strip(light.replace("light theme", "")),
        )

    def test_manifest_count_change_is_visible_in_the_picture(self) -> None:
        mutated = json.loads(json.dumps(self.data))
        mutated["portfolios"][0]["repositories"].pop()
        changed = renderer.render_all(mutated)
        for path, text in changed.items():
            self.assertNotIn(validator.expected_counts_line(self.data), text, path.name)
            self.assertIn(validator.expected_counts_line(mutated), text, path.name)

    def test_unknown_portfolio_id_is_rejected(self) -> None:
        mutated = json.loads(json.dumps(self.data))
        mutated["portfolios"][0]["id"] = "unmapped"
        with self.assertRaises(ValueError):
            renderer.render_all(mutated)

    def test_checked_in_assets_are_current(self) -> None:
        result = subprocess.run(
            [sys.executable, "tools/render_profile_assets.py", "--check"],
            cwd=ROOT,
            capture_output=True,
            text=True,
            check=False,
        )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
