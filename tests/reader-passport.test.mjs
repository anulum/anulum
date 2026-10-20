// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — reader-passport public behaviour contracts

import { withAtlasSourceVariant } from "./atlas-source-variant.mjs";
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

test(
  "incomplete dossiers and hostile track labels remain readable plain text",
  { timeout: 120000 },
  async () => {
    let missing = "",
      tracked = "",
      label = "";
    await withAtlasSourceVariant(
      ({ atlas }) => {
        missing = atlas.nodes[0].id;
        Reflect.deleteProperty(atlas.nodes[0], "dossier");
        const node = atlas.nodes[1];
        tracked = node.id;
        label = node.name + ' <img src=x onerror="window.atlasInjected=true">';
        node.dossier.programme_tracks = [{ name: label, scope: node.function }];
        Reflect.deleteProperty(node.dossier, "current_surfaces");
        node.dossier.expected_outputs[0].basis = "";
        Reflect.deleteProperty(node, "sources");
        node.group = "absent-source-group";
      },
      async (servedBase) => {
        await withAtlasPage(
          async (page) => {
            for (const project of [missing, tracked]) {
              for (const [tab, index] of /** @type {[string,number][]} */ ([
                ["overview", 0],
                ["outputs", 1],
                ["interfaces", 2],
                ["resources", 3],
                ["sources", 4],
                ["visuals", 5],
              ])) {
                await openRoute(page, { project, tab });
                assert.equal(await page.locator("#content h1").count(), 1);
                assert.equal(
                  await page
                    .locator("#passport-tab-" + index)
                    .getAttribute("aria-selected"),
                  "true",
                );
              }
            }
            await openRoute(page, { project: tracked, tab: "outputs" });
            assert.ok(
              (await page.locator("#content").innerText()).includes(label),
            );
            assert.equal(await page.locator('img[src="x"]').count(), 0);
          },
          { servedBase },
        );
      },
    );
  },
);
