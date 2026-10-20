// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — reader-documents public behaviour contracts

import test from "node:test";
import assert from "node:assert/strict";
import { withAtlasPage, openRoute } from "./atlas-runtime.mjs";
import { atlas } from "./atlas-data.mjs";

test(
  "documents filters preserve the complete source population when cleared",
  { timeout: 120000 },
  async () => {
    await withAtlasPage(async (page) => {
      await openRoute(page, { view: "documents" });
      await page.locator("#document-library-query").fill("NO_MATCH_7a2b86c1");
      assert.equal(
        await page.locator(".document-catalogue article").count(),
        0,
      );
      await page.locator("#document-library-query").press("Enter");
      await page
        .getByRole("button", { name: "Clear filters", exact: true })
        .click();
      assert.ok(
        (await page.locator(".document-catalogue article").count()) > 0,
      );
      for (const group of atlas.groups)
        await page.locator("#document-library-owner").selectOption(group.id);
      await page
        .getByRole("button", { name: "Clear filters", exact: true })
        .click();
    });
  },
);
