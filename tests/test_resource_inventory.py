# SPDX-License-Identifier: AGPL-3.0-or-later
# Commercial license available
# © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
# © Code 2020–2026 Miroslav Šotek. All rights reserved.
# ORCID: 0009-0009-3560-0851
# Contact: www.anulum.li | protoscience@anulum.li
# ANULUM — Resource inventory native JavaScript test entry point
"""Include the native resource-inventory tests in the profile's existing test discovery."""

import subprocess
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class ResourceInventoryTests(unittest.TestCase):
    def test_native_selection_and_csv_consumer_contracts(self) -> None:
        result = subprocess.run(
            ["node", "--test", "tests/test_resource_inventory.mjs"],
            cwd=ROOT,
            capture_output=True,
            text=True,
            check=False,
            timeout=60,
        )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
