// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — reader-documents public behaviour contracts

import test from "node:test";
import assert from "node:assert/strict";
import { withAtlasPage, openRoute } from "./atlas-runtime.mjs";
import { atlas, library } from "./atlas-data.mjs";

test(
  "documents filters preserve the complete source population when cleared",
  { timeout: 120000 },
  async () => {
    await withAtlasPage(async (page) => {
      await openRoute(page, { view: "documents" });
      await page.locator("#document-library-query").fill("NO_MATCH_7a2b86c1");
      assert.equal(
        await page.locator(".document-catalogue article").count(),
        0,
      );
      await page.locator("#document-library-query").press("Enter");
      await page
        .getByRole("button", { name: "Clear filters", exact: true })
        .click();
      assert.ok(
        (await page.locator(".document-catalogue article").count()) > 0,
      );
      for (const group of atlas.groups)
        await page.locator("#document-library-owner").selectOption(group.id);
      await page
        .getByRole("button", { name: "Clear filters", exact: true })
        .click();
    });
  },
);

test("project document catalogues keep entry scope and explicit empty captures", async () => {
  await withAtlasPage(async (page) => {
    const known = library.projects.find((row) => row.documents.length);
    assert.ok(known);
    await openRoute(page, { view: "documents", entry: known.project_id });
    assert.equal(await page.locator(".document-catalogue article").count(), 1);
    assert.equal(
      await page.locator(".document-project li").count(),
      known.documents.length,
    );
    await page.locator("#document-library-query").fill("NO_MATCH_7a2b86c1");
    assert.match(
      await page.locator("#content").innerText(),
      /No captured documentation matches/,
    );
    await page
      .getByRole("button", { name: "Clear filters", exact: true })
      .click();
    assert.equal(await page.locator(".document-catalogue article").count(), 1);
    assert.equal(
      await page.locator(".document-project li").count(),
      known.documents.length,
    );
    const empty = atlas.nodes.find(
      (node) =>
        !library.projects.some(
          (row) => row.project_id === node.id && row.documents.length,
        ),
    );
    assert.ok(empty);
    await openRoute(page, { view: "documents", entry: empty.id });
    assert.match(
      await page.locator("#content").innerText(),
      /no selected documentation file/,
    );
  });
});
