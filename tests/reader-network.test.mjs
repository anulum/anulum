// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — reader-network public behaviour contracts

import test from "node:test";
import assert from "node:assert/strict";
import { withAtlasPage, openRoute } from "./atlas-runtime.mjs";
import { atlas } from "./atlas-data.mjs";

test(
  "native interface cards preserve every incident source and proposal edge",
  { timeout: 600000 },
  async () => {
    await withAtlasPage(async (page) => {
      for (const node of atlas.nodes) {
        await openRoute(page, { project: node.id, tab: "interfaces" });
        const all = atlas.edges.filter(
          (edge) => edge.from === node.id || edge.to === node.id,
        );
        const declared = all.filter(
          (edge) =>
            !["architect proposal", "architect design"].includes(
              edge.layer || "",
            ),
        );
        assert.equal(
          await page.locator(".interface-card").count(),
          declared.length,
        );
        await page.locator("#include-interface-proposals").check();
        assert.equal(await page.locator(".interface-card").count(), all.length);
        for (const edge of all)
          assert.ok(
            (await page.locator(".interface-list").innerText()).includes(
              edge.kind,
            ),
          );
        await page.locator("#include-interface-proposals").uncheck();
        assert.equal(
          await page.locator(".interface-card").count(),
          declared.length,
        );
      }
    });
  },
);
