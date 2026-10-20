// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — reader-core public behaviour contracts

import { withAtlasSourceVariant } from "./atlas-source-variant.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  withAtlasPage,
  openRoute,
  navigate,
  withAtlasArtifact,
} from "./atlas-runtime.mjs";

test(
  "broken cross-source ownership fails explicitly in the real reader",
  { timeout: 120000 },
  async () => {
    await withAtlasArtifact(
      async (directory) => {
        const path = join(directory, "index.html"),
          html = await readFile(path, "utf8");
        const changed = html.replace(
          /(<script id="atlas-data" type="application\/json">)([\s\S]*?)(<\/script>)/,
          (_whole, open, body, close) => {
            /** @type {import('../types/atlas.js').AtlasData} */
            const data = JSON.parse(body);
            data.groups = data.groups.filter(
              (row) => row.id !== "SCPN-REACTOR-SYSTEMS",
            );
            return (
              open + JSON.stringify(data).replaceAll("<", "\\u003c") + close
            );
          },
        );
        assert.notEqual(changed, html);
        await writeFile(path, changed);
      },
      async (servedBase) => {
        const expected =
          /A captured source references an unavailable atlas record/;
        await withAtlasPage(
          async (page) => {
            const rejected = page.waitForEvent("pageerror");
            await navigate(page, servedBase + "index.html");
            assert.match((await rejected).message, expected);
          },
          { servedBase, expectedErrors: expected },
        );
      },
    );
  },
);

test(
  "omitted source fields and unresolved associations retain explicit reading fallbacks",
  { timeout: 120000 },
  async () => {
    let selected = "",
      linked = "",
      name = "";
    await withAtlasSourceVariant(
      ({ atlas }) => {
        const node = atlas.nodes[0];
        selected = node.id;
        name = node.name;
        Reflect.deleteProperty(node, "dossier");
        node.owning_groups.push("absent-source-owner");
        const group = atlas.groups.find((row) => row.id === node.group);
        assert.ok(group);
        group.color = "";
        const withSlot = atlas.nodes.find((row) => row.partner_slots?.length);
        assert.ok(withSlot);
        linked = withSlot.id;
        assert.ok(withSlot.partner_slots);
        withSlot.partner_slots[0].project_ids.push("absent-source-project");
      },
      async (servedBase) => {
        await withAtlasPage(
          async (page) => {
            await openRoute(page, { view: "search", q: selected });
            const card = page
              .locator(".project-card")
              .filter({ has: page.getByRole("link", { name, exact: true }) });
            assert.equal(await card.count(), 1);
            assert.equal(
              await card.evaluate(function sourceCardFallbackColour(element) {
                return element.style.getPropertyValue("--group-color");
              }),
              "#315d4c",
            );
            await openRoute(page, { project: selected });
            assert.match(
              await page.locator(".passport-heading").innerText(),
              /absent-source-owner/,
            );
            await openRoute(page, { view: "support", entry: linked });
            await page.locator("[data-partner] > summary").first().click();
            assert.equal(
              await page
                .getByRole("link", {
                  name: "absent-source-project",
                  exact: true,
                })
                .count(),
              1,
            );
          },
          { servedBase },
        );
      },
    );
  },
);
