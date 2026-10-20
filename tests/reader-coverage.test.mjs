// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — reader-coverage public behaviour contracts

import { withAtlasSourceVariant } from "./atlas-source-variant.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { withAtlasPage, openRoute } from "./atlas-runtime.mjs";
import { atlas } from "./atlas-data.mjs";

test(
  "source field coverage filters and exports retain the displayed original identities",
  { timeout: 120000 },
  async () => {
    await withAtlasPage(async (page) => {
      await openRoute(page, { view: "coverage" });
      assert.equal(
        await page.locator("[data-coverage-project]").count(),
        atlas.nodes.length,
      );
      for (const id of ["coverage-programme", "coverage-missing"]) {
        const values = await page
          .locator("#" + id + " option")
          .evaluateAll(function coverageFilterValues(options) {
            return options.map(
              (option) => /** @type {HTMLOptionElement} */ (option).value,
            );
          });
        for (const value of values) {
          await page.locator("#" + id).selectOption(value);
          const rows = await page
            .locator("[data-coverage-project]")
            .evaluateAll((elements) =>
              elements.map((element) =>
                element.getAttribute("data-coverage-project"),
              ),
            );
          assert.equal(new Set(rows).size, rows.length);
          for (const row of rows)
            assert.ok(atlas.nodes.some((node) => node.id === row));
        }
        await page
          .getByRole("button", { name: "Clear filters", exact: true })
          .click();
      }
      await page.locator("#coverage-search").fill("NO_MATCH_7a2b86c1");
      assert.equal(await page.locator("[data-coverage-project]").count(), 0);
      await page.locator("#coverage-search").press("Enter");
      await page
        .getByRole("button", { name: "Clear filters", exact: true })
        .click();
      const downloading = page.waitForEvent("download");
      await page
        .getByRole("button", {
          name: "Export displayed rows (.csv)",
          exact: true,
        })
        .click();
      const download = await downloading,
        path = await download.path();
      assert.ok(path);
      const csv = await readFile(path, "utf8");
      assert.ok(csv.startsWith('\uFEFF"project_id","project_name"'));
      for (const node of atlas.nodes)
        assert.ok(csv.includes('"' + node.id.replaceAll('"', '""') + '"'));
    });
  },
);

test(
  "coverage exports escape spreadsheet markers while retaining source gaps",
  { timeout: 120000 },
  async () => {
    let title = "";
    await withAtlasSourceVariant(
      ({ atlas }) => {
        const node = atlas.nodes[0];
        title = "=" + node.name;
        node.name = title;
        node.as_of = "";
        Reflect.deleteProperty(node.dossier, "expected_outputs");
      },
      async (servedBase) => {
        await withAtlasPage(
          async (page) => {
            await openRoute(page, { view: "coverage" });
            const downloading = page.waitForEvent("download");
            await page
              .getByRole("button", {
                name: "Export displayed rows (.csv)",
                exact: true,
              })
              .click();
            const path = await (await downloading).path();
            assert.ok(path);
            const csv = await readFile(path, "utf8");
            assert.ok(csv.includes("\"'" + title.replaceAll('"', '""') + '"'));
            assert.equal(
              await page.locator("[data-coverage-project]").count(),
              atlas.nodes.length,
            );
          },
          { servedBase },
        );
      },
    );
  },
);
