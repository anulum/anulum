# SPDX-License-Identifier: AGPL-3.0-or-later

import json
import subprocess
import sys
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class ProfileValidationTests(unittest.TestCase):
    def test_checked_in_profile_passes(self) -> None:
        result = subprocess.run(
            [sys.executable, "tools/validate_profile.py"],
            cwd=ROOT,
            capture_output=True,
            text=True,
            check=False,
        )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_manifest_counts_are_consistent(self) -> None:
        data = json.loads((ROOT / "profile-data.json").read_text(encoding="utf-8"))
        repositories = [repo for group in data["portfolios"] for repo in group["repositories"]]
        self.assertEqual(len(repositories), data["stats"]["portfolio_repositories"])
        self.assertEqual(len(data["pypi_projects"]), data["stats"]["pypi_projects"])


if __name__ == "__main__":
    unittest.main()
