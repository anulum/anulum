// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — reader-compare public behaviour contracts

import test from "node:test";
import assert from "node:assert/strict";
import { withAtlasPage, openRoute } from "./atlas-runtime.mjs";
import { technical } from "./atlas-data.mjs";

test(
  "comparison controls retain distinct source identities and the three-system limit",
  { timeout: 120000 },
  async () => {
    await withAtlasPage(async (page) => {
      await openRoute(page, { view: "compare" });
      const inputs = page.locator('input[name="systems"]');
      assert.equal(await inputs.count(), technical.guides.length);
      for (let i = 0; i < 3; i++) await inputs.nth(i).check();
      assert.equal(await page.locator(".comparison-project").count(), 3);
      assert.equal(await inputs.nth(3).isDisabled(), true);
      await inputs.nth(0).uncheck();
      assert.equal(await page.locator(".comparison-project").count(), 2);
      assert.equal(await inputs.nth(3).isDisabled(), false);
      await page
        .getByRole("button", { name: "Clear selection", exact: true })
        .click();
      assert.equal(await page.locator(".comparison-project").count(), 0);
      assert.equal(
        await inputs
          .first()
          .evaluate((node) => node === document.activeElement),
        true,
      );
      for (let i = 0; i < technical.guides.length; i += 3) {
        const ids = technical.guides
          .slice(i, i + 3)
          .map((guide) => guide.project_id);
        await openRoute(page, { view: "compare", entries: ids.join(",") });
        if (ids.length >= 2)
          assert.equal(
            await page.locator(".comparison-project").count(),
            ids.length,
          );
      }
      for (const entries of [
        "absent-source-id",
        technical.guides[0].project_id + "," + technical.guides[0].project_id,
        technical.guides
          .slice(0, 4)
          .map((guide) => guide.project_id)
          .join(","),
      ]) {
        await openRoute(page, { view: "compare", entries });
        assert.match(
          await page.locator("#content").innerText(),
          /requires distinct project identities/,
        );
        assert.equal(
          await page
            .getByRole("link", { name: "Choose systems", exact: true })
            .count(),
          1,
        );
      }
    });
  },
);
