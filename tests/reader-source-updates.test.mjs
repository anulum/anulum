// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — reader-source-updates public behaviour contracts

import test from "node:test";
import assert from "node:assert/strict";
import { withAtlasPage, openRoute } from "./atlas-runtime.mjs";

test(
  "source-updates filters preserve the complete source population when cleared",
  { timeout: 120000 },
  async () => {
    await withAtlasPage(async (page) => {
      await openRoute(page, { view: "source-updates" });
      const count = await page.locator(".project-card").count();
      assert.ok(count > 0);
      await page
        .getByRole("searchbox", { name: "Search source updates" })
        .fill("NO_MATCH_7a2b86c1");
      assert.equal(await page.locator(".project-card").count(), 0);
      await page
        .getByRole("searchbox", { name: "Search source updates" })
        .fill("");
      assert.equal(await page.locator(".project-card").count(), count);
    });
  },
);
