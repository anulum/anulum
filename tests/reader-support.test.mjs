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
import { withAtlasPage, openRoute, navigate } from "./atlas-runtime.mjs";
import { atlas } from "./atlas-data.mjs";

test(
  "partial output and partner records preserve supplied limits and explicit missing fields",
  { timeout: 120000 },
  async () => {
    let project = "",
      partnerProject = "",
      partnerId = "",
      gap = "",
      limit = "";
    await withAtlasSourceVariant(
      ({ atlas }) => {
        const node = atlas.nodes.find(
          (row) =>
            row.dossier?.limitations?.length &&
            row.dossier.expected_outputs?.length,
        );
        assert.ok(node);
        const dossier = node.dossier;
        assert.ok(dossier);
        const limits = dossier.limitations,
          outputs = dossier.expected_outputs;
        assert.ok(limits);
        assert.ok(outputs);
        project = node.id;
        limit = limits[0];
        outputs[0].basis = "";
        Reflect.deleteProperty(dossier, "acceptance");
        Reflect.deleteProperty(dossier, "open_fields");
        const partner = atlas.nodes.find((row) => row.partner_slots?.length);
        assert.ok(partner);
        partnerProject = partner.id;
        const slots = partner.partner_slots;
        assert.ok(slots);
        const slot = slots[0];
        partnerId = slot.id;
        gap = slot.gap;
        Reflect.deleteProperty(slot, "project_ids");
        partner.name = "";
      },
      async (servedBase) => {
        await withAtlasPage(
          async (page) => {
            await openRoute(page, { view: "support", entry: project });
            assert.ok(
              (await page.locator("#brief-outputs").innerText()).includes(
                "Basis: Source goal",
              ),
            );
            assert.ok(
              (await page.locator("#brief-gates").innerText()).includes(limit),
            );
            assert.ok(
              !(await page.locator("#brief-gates").innerText()).includes(
                "No detailed acceptance or open-field record",
              ),
            );
            await navigate(
              page,
              servedBase +
                "index.html#" +
                new URLSearchParams({ view: "support", entry: partnerProject }),
            );
            const card = page.locator('[data-partner="' + partnerId + '"]');
            await card.waitFor();
            assert.equal(await card.locator("summary").textContent(), gap);
            await card.locator("summary").click();
            assert.equal(await card.locator('a[href*="project="]').count(), 0);
            assert.equal(await page.locator("#content h1").textContent(), "");
            assert.equal(await page.title(), "Research programme · ANULUM");
          },
          { servedBase },
        );
      },
    );
  },
);

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
