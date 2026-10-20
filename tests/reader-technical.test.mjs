// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — reader-technical public behaviour contracts

import test from "node:test";
import assert from "node:assert/strict";
import { withAtlasPage, openRoute } from "./atlas-runtime.mjs";
import { atlas, technical } from "./atlas-data.mjs";

test(
  "every technical guide retains its known project identity",
  { timeout: 600000 },
  async () => {
    await withAtlasPage(async (page) => {
      for (const guide of technical.guides) {
        await openRoute(page, { view: "technical", entry: guide.project_id });
        const node = atlas.nodes.find((row) => row.id === guide.project_id);
        assert.ok(
          node,
          "Every technical guide retains a known project identity",
        );
        assert.equal(await page.locator("#content h1").innerText(), node.name);
      }
    });
  },
);

test(
  "technical filters preserve the complete source population when cleared",
  { timeout: 120000 },
  async () => {
    await withAtlasPage(async (page) => {
      await openRoute(page, { view: "technical" });
      assert.equal(
        await page.locator(".technical-guide-card").count(),
        technical.guides.length,
      );
      await page.locator("#technical-query").fill("NO_MATCH_7a2b86c1");
      assert.equal(await page.locator(".technical-guide-card").count(), 0);
      await page
        .getByRole("button", { name: "Clear filters", exact: true })
        .click();
      for (const group of atlas.groups) {
        await page.locator("#technical-owner").selectOption(group.id);
        assert.equal(
          await page.locator(".technical-guide-card").count(),
          technical.guides.filter((guide) =>
            atlas.nodes.some(
              (node) =>
                node.id === guide.project_id &&
                node.owning_groups.includes(group.id),
            ),
          ).length,
        );
      }
    });
  },
);

test("technical index distinguishes unknown programmes and unguided real entries", async () => {
  await withAtlasPage(async (page) => {
    await openRoute(page, { view: "technical", programme: "absent-source-id" });
    assert.match(
      await page.locator("#content").innerText(),
      /owning programme is not present/,
    );
    const unguided = atlas.nodes.find(
      (node) => !technical.guides.some((guide) => guide.project_id === node.id),
    );
    assert.ok(unguided);
    await openRoute(page, { view: "technical", entry: unguided.id });
    assert.match(
      await page.locator("#content").innerText(),
      /explanation for this entry is being prepared/,
    );
    assert.equal(
      await page
        .getByRole("link", { name: unguided.name, exact: true })
        .count(),
      1,
    );
  });
});
