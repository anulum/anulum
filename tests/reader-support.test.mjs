// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — reader-support public behaviour contracts

import { withAtlasSourceVariant } from "./atlas-source-variant.mjs";
import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";
import { withAtlasPage, openRoute } from "./atlas-runtime.mjs";
import { atlas } from "./atlas-data.mjs";

test(
  "every partnership brief retains its source identity and work state",
  { timeout: 600000 },
  async () => {
    await withAtlasPage(async (page) => {
      for (const node of atlas.nodes) {
        await openRoute(page, { view: "support", entry: node.id });
        assert.equal(await page.locator("#content h1").innerText(), node.name);
        assert.equal(
          await page.locator(".support-brief > .badge").innerText(),
          node.work_status,
        );
      }
    });
  },
);

test(
  "sparse partnership briefs keep source gaps and native text export",
  { timeout: 120000 },
  async () => {
    let project = "";
    await withAtlasSourceVariant(
      ({ atlas }) => {
        const node = atlas.nodes[0];
        project = node.id;
        Reflect.deleteProperty(node, "dossier");
        Reflect.deleteProperty(node, "partner_slots");
      },
      async (servedBase) => {
        await withAtlasPage(
          async (page) => {
            await openRoute(page, { view: "support", entry: project });
            assert.match(
              await page.locator("#content").innerText(),
              /No detailed acceptance or open-field record is supplied/,
            );
            const downloading = page.waitForEvent("download");
            await page
              .getByRole("button", {
                name: "Download detailed brief (.txt)",
                exact: true,
              })
              .click();
            const download = await downloading,
              path = await download.path();
            assert.ok(path);
            const text = await readFile(path, "utf8");
            assert.ok(text.includes(atlas.nodes[0].name));
            assert.match(text, /No detailed expected-output record/);
            await page
              .getByRole("button", { name: "Print brief", exact: true })
              .click();
          },
          { servedBase },
        );
      },
    );
  },
);
