// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — atlas-entry-accessibility public behaviour contracts

import test from "node:test";
import assert from "node:assert/strict";
import { writeFile, mkdir } from "node:fs/promises";
import AxeBuilder from "@axe-core/playwright";
import { withAtlasPage, baseUrl, navigate } from "./atlas-runtime.mjs";

/** Entry accessibility contract: each complete static reader supports desktop and phone accessibility checks and prepared reservation metadata. */
test(
  "actual atlas entries have no automated accessibility violations on desktop and phone",
  { timeout: 180000 },
  async () => {
    await withAtlasPage(async (page) => {
      for (const width of [1440, 390]) {
        await page.setViewportSize({ width, height: 1000 });
        for (const name of [
          "index.html",
          "resources.html",
          "budget.html",
          "atlas_full.html",
        ]) {
          await navigate(page, baseUrl + name);
          await page.locator("h1").waitFor();
          assert.equal(
            await page
              .locator('meta[name="tdm-reservation"]')
              .getAttribute("content"),
            "1",
          );
          const result = await new AxeBuilder({ page }).analyze();
          await mkdir("coverage/accessibility", { recursive: true });
          await writeFile(
            "coverage/accessibility/" + name + "-" + width + ".json",
            JSON.stringify(result, null, 2),
          );
          assert.deepEqual(
            result.violations.map((row) => ({
              id: row.id,
              count: row.nodes.length,
              targets: row.nodes.slice(0, 3).map((node) => node.target),
            })),
            [],
            name + " at " + width + " CSS pixels",
          );
        }
      }
    });
  },
);
