// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — legacy-budget public behaviour contracts

import test from "node:test";
import assert from "node:assert/strict";
import { withAtlasPage, baseUrl, navigate } from "./atlas-runtime.mjs";
import { budget } from "./atlas-data.mjs";

test(
  "preliminary budget scenarios retain their source identity and separate totals",
  { timeout: 120000 },
  async () => {
    await withAtlasPage(async (page) => {
      for (const scenario of budget.scenarios) {
        await navigate(
          page,
          baseUrl +
            "budget.html#" +
            new URLSearchParams({ scenario: scenario.id }),
        );
        await page.locator("#scenario-view .metric").first().waitFor();
        assert.equal(await page.locator("#scenario").inputValue(), scenario.id);
        const text = await page.locator("#scenario-view").innerText();
        assert.ok(
          (await page.locator("#scenario option:checked").innerText()).includes(
            scenario.title,
          ),
        );
        assert.ok(text.includes(scenario.state));
        assert.ok(!text.includes("NaN"));
      }
      await page.locator("#family").selectOption("Institute");
      assert.equal(
        await page.locator("#scenario option").count(),
        budget.scenarios.length,
      );
    });
  },
);
