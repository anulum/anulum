// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — reader-support-records public behaviour contracts

import test from "node:test";
import assert from "node:assert/strict";
import { withAtlasPage, openRoute } from "./atlas-runtime.mjs";
import { atlas, resources, budget } from "./atlas-data.mjs";

test(
  "brief record cards retain actual need and acquisition identities and provenance",
  { timeout: 600000 },
  async () => {
    await withAtlasPage(async (page) => {
      let observedNeeds = 0,
        observedCandidates = 0;
      for (const node of atlas.nodes) {
        await openRoute(page, { view: "support", entry: node.id });
        const summaries = page.locator(".support-brief details > summary");
        for (let i = 0; i < (await summaries.count()); i++) {
          const summary = summaries.nth(i);
          if (
            (await summary.isVisible()) &&
            (await summary.locator("..").getAttribute("open")) === null
          )
            await summary.click();
        }
        const needCards = page.locator("[data-need]");
        for (const card of await needCards.all()) {
          const id = await card.getAttribute("data-need"),
            row = resources.needs.find((item) => item.id === id);
          assert.ok(row);
          assert.equal(await card.locator("h3").innerText(), row.need);
          assert.ok((await card.innerText()).includes(row.unlocks));
          observedNeeds++;
        }
        const candidates = page.locator("[data-acquisition]");
        for (const card of await candidates.all()) {
          const id = await card.getAttribute("data-acquisition"),
            row = resources.candidates.find((item) => item.id === id);
          assert.ok(row);
          const text = await card.innerText();
          assert.ok(text.includes(row.item));
          if (row.as_of) assert.ok(text.includes(row.as_of));
          if (row.source_sha256) assert.ok(text.includes(row.source_sha256));
          observedCandidates++;
        }
        for (const card of await page.locator("[data-partner]").all()) {
          const id = await card.getAttribute("data-partner"),
            row = budget.partner_slots.find((item) => item.id === id);
          assert.ok(row);
          const text = await card.innerText();
          assert.ok(text.includes(row.gap));
          assert.ok(text.includes(row.profile));
        }
        for (const card of await page.locator("[data-estimate]").all()) {
          const id = await card.getAttribute("data-estimate"),
            row = resources.planning_estimates.find((item) => item.id === id);
          assert.ok(row);
          const text = await card.innerText();
          assert.ok(text.includes(row.title));
          for (const value of Object.values(row.values))
            assert.ok(text.includes(String(value)));
        }
      }
      assert.ok(observedNeeds > 0);
      assert.ok(observedCandidates > 0);
    });
  },
);
