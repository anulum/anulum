// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — reader-visuals public behaviour contracts

import test from "node:test";
import assert from "node:assert/strict";
import { withAtlasPage, openRoute } from "./atlas-runtime.mjs";

test(
  "visuals filters preserve the complete source population when cleared",
  { timeout: 120000 },
  async () => {
    await withAtlasPage(async (page) => {
      await openRoute(page, { view: "visuals" });
      const total = await page
        .locator(".visual-grid > figure:visible,.visual-grid > article:visible")
        .count();
      assert.ok(total > 0);
      await page.locator("#visual-search").fill("NO_MATCH_7a2b86c1");
      assert.equal(await page.locator(".visual-grid > :visible").count(), 0);
      await page
        .getByRole("button", { name: "Clear filters", exact: true })
        .click();
      assert.equal(
        await page.locator(".visual-grid > :visible").count(),
        total,
      );
      for (const id of ["visual-group", "visual-kind"]) {
        const values = await page
          .locator("#" + id + " option")
          .evaluateAll(function galleryFilterValues(options) {
            return options.map(
              (option) => /** @type {HTMLOptionElement} */ (option).value,
            );
          });
        for (const value of values)
          await page.locator("#" + id).selectOption(value);
        await page
          .getByRole("button", { name: "Clear filters", exact: true })
          .click();
      }
    });
  },
);

test("project illustration filters survive a form submission and clear explicitly", async () => {
  await withAtlasPage(async (page) => {
    await openRoute(page, { view: "visuals" });
    const project = await page
      .locator(".visual-card")
      .first()
      .getAttribute("data-project");
    assert.ok(project);
    await openRoute(page, { view: "visuals", projectFilter: project });
    const visible = page.locator(".visual-card:visible");
    assert.ok((await visible.count()) > 0);
    for (const card of await visible.all())
      assert.equal(await card.getAttribute("data-project"), project);
    await page.locator("#visual-search").press("Enter");
    assert.ok(new URL(page.url()).hash.includes("projectFilter="));
    await page
      .getByRole("button", { name: "Clear filters", exact: true })
      .click();
    assert.equal(
      new URLSearchParams(new URL(page.url()).hash.slice(1)).has(
        "projectFilter",
      ),
      false,
    );
  });
});
