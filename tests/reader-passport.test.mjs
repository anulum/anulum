// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — reader-passport public behaviour contracts

import test from "node:test";
import assert from "node:assert/strict";
import { withAtlasPage, openRoute } from "./atlas-runtime.mjs";
import { atlas } from "./atlas-data.mjs";

test(
  "every passport exposes six native panels and its original source state",
  { timeout: 600000 },
  async () => {
    await withAtlasPage(async (page) => {
      for (const node of atlas.nodes) {
        await openRoute(page, { project: node.id });
        assert.equal(await page.locator("#content h1").innerText(), node.name);
        assert.equal(
          await page.locator(".passport-heading .badge").innerText(),
          node.work_status,
        );
        const tabs = page.getByRole("tab");
        assert.equal(await tabs.count(), 6);
        for (let i = 0; i < 6; i++) {
          await tabs.nth(i).click();
          assert.equal(await tabs.nth(i).getAttribute("aria-selected"), "true");
          assert.equal(await page.getByRole("tabpanel").count(), 1);
          if (i === 2) {
            await page.locator("#include-interface-proposals").check();
            assert.equal(
              await page.locator(".interface-card").count(),
              atlas.edges.filter(
                (edge) => edge.from === node.id || edge.to === node.id,
              ).length,
            );
            await page.locator("#include-interface-proposals").uncheck();
            assert.equal(
              await page.locator(".interface-card").count(),
              atlas.edges.filter(
                (edge) =>
                  (edge.from === node.id || edge.to === node.id) &&
                  !["architect proposal", "architect design"].includes(
                    edge.layer || "",
                  ),
              ).length,
            );
          }
        }
        await tabs.first().focus();
        for (const key of ["ArrowRight", "End", "ArrowLeft", "Home", "x"]) {
          await page.keyboard.press(key);
          assert.equal(
            await page.locator('[role="tab"][aria-selected="true"]').count(),
            1,
          );
        }
      }
    });
  },
);
