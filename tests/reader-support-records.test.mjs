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
      /** @type {Set<string>} Unique source records whose complete public cards were checked. */
      const seen = new Set();
      let observedNeeds = 0,
        observedCandidates = 0;
      /**
       * Open the actual containing disclosures in document order through native summaries.
       * @param {import('playwright').Locator} card - Source-backed public record card.
       * @returns {Promise<void>} Every ancestor permits a user to read the card.
       */
      async function reveal(card) {
        for (const disclosure of await card
          .locator("xpath=ancestor-or-self::details")
          .all()) {
          if ((await disclosure.getAttribute("open")) === null)
            await disclosure.locator(":scope > summary").click();
        }
      }
      for (const node of atlas.nodes) {
        await openRoute(page, { view: "support", entry: node.id });
        const needCards = page.locator("[data-need]");
        for (const card of await needCards.all()) {
          const id = await card.getAttribute("data-need"),
            row = resources.needs.find((item) => item.id === id);
          assert.ok(row);
          if (seen.has("need:" + row.id)) continue;
          seen.add("need:" + row.id);
          await reveal(card);
          assert.equal(await card.locator("h3").textContent(), row.need);
          const text = await card.textContent();
          assert.ok(text);
          assert.ok(text.includes(row.unlocks));
          observedNeeds++;
        }
        const candidates = page.locator("[data-acquisition]");
        for (const card of await candidates.all()) {
          const id = await card.getAttribute("data-acquisition"),
            row = resources.candidates.find((item) => item.id === id);
          assert.ok(row);
          if (seen.has("candidate:" + row.id)) continue;
          seen.add("candidate:" + row.id);
          await reveal(card);
          const text = await card.textContent();
          assert.ok(text);
          assert.equal(
            await card.locator(":scope > summary").textContent(),
            row.item,
          );
          if (row.as_of) assert.ok(text.includes(row.as_of));
          if (row.source_sha256) assert.ok(text.includes(row.source_sha256));
          observedCandidates++;
        }
        for (const card of await page.locator("[data-partner]").all()) {
          const id = await card.getAttribute("data-partner"),
            row = budget.partner_slots.find((item) => item.id === id);
          assert.ok(row);
          if (seen.has("partner:" + row.id)) continue;
          seen.add("partner:" + row.id);
          await reveal(card);
          const text = await card.textContent();
          assert.ok(text);
          assert.ok(text.includes(row.gap));
          assert.ok(text.includes(row.profile));
        }
        for (const card of await page.locator("[data-estimate]").all()) {
          const id = await card.getAttribute("data-estimate"),
            row = resources.planning_estimates.find((item) => item.id === id);
          assert.ok(row);
          if (seen.has("estimate:" + row.id)) continue;
          seen.add("estimate:" + row.id);
          await reveal(card);
          const text = await card.textContent();
          assert.ok(text);
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
