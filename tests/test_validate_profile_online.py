# SPDX-License-Identifier: AGPL-3.0-or-later

import importlib.util
import sys
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location(
    "validate_profile_online", ROOT / "tools" / "validate_profile_online.py"
)
assert SPEC and SPEC.loader
MODULE = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = MODULE
SPEC.loader.exec_module(MODULE)


class OnlineValidationTests(unittest.TestCase):
    def test_pep503_normalization(self) -> None:
        self.assertEqual(MODULE.pep503("SCPN.Quantum_Control"), "scpn-quantum-control")

    def test_evidence_links_require_full_commit_sha(self) -> None:
        with self.assertRaises(ValueError):
            MODULE.evidence_target("https://github.com/anulum/example/blob/main/VALIDATION.md")

    def test_evidence_link_maps_to_contents_api(self) -> None:
        sha = "a" * 40
        target = MODULE.evidence_target(
            f"https://github.com/anulum/example/blob/{sha}/docs/evidence.md"
        )
        self.assertEqual(target.kind, "github-file")
        self.assertIn(f"?ref={sha}", target.url)


if __name__ == "__main__":
    unittest.main()
