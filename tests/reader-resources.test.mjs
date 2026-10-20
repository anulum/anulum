// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — reader-resources public behaviour contracts

import test from "node:test";
import assert from "node:assert/strict";
import { withAtlasPage, openRoute } from "./atlas-runtime.mjs";
import { budget } from "./atlas-data.mjs";

test(
  "shared resource cards retain quantities and reciprocal target links",
  { timeout: 600000 },
  async () => {
    await withAtlasPage(async (page) => {
      await openRoute(page, { view: "resources" });
      assert.equal(
        await page.locator(".shared-card").count(),
        budget.shared.length,
      );
      for (const shared of budget.shared) {
        const card = page.locator(".shared-card").filter({
          has: page.getByRole("heading", { name: shared.name, exact: true }),
        });
        assert.equal(await card.getAttribute("id"), "resource-" + shared.id);
        assert.ok((await card.innerText()).includes(shared.quantity));
        await openRoute(page, { view: "resources", resource: shared.id });
        assert.equal(
          await page.locator(".shared-card.highlight").getAttribute("id"),
          "resource-" + shared.id,
        );
      }
      await openRoute(page, {
        view: "resources",
        resource: "absent-source-id",
      });
      assert.equal(await page.locator(".shared-card.highlight").count(), 0);
    });
  },
);
