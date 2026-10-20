// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — reader-map-scene public behaviour contracts

import test from "node:test";
import assert from "node:assert/strict";
import { withAtlasPage, openRoute } from "./atlas-runtime.mjs";
import { atlas } from "./atlas-data.mjs";

test(
  "map scene levels retain project identities and programme families",
  { timeout: 600000 },
  async () => {
    await withAtlasPage(async (page) => {
      for (const node of atlas.nodes) {
        await openRoute(page, { view: "map", focus: node.id });
        assert.equal(
          await page.locator(".map-focused-project h2").innerText(),
          node.name,
        );
        assert.ok((await page.locator(".map-entry[data-entry]").count()) > 0);
      }
      for (const group of atlas.groups) {
        await openRoute(page, { view: "map", group: group.id });
        assert.ok((await page.locator(".map-entry").count()) > 0);
      }
    });
  },
);
