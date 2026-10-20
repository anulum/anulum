// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — reader-direct-sources public behaviour contracts

import test from "node:test";
import assert from "node:assert/strict";
import { withAtlasPage, openRoute } from "./atlas-runtime.mjs";
import { directData } from "./atlas-data.mjs";

test(
  "source panels retain captured lookup states and document fingerprints",
  { timeout: 600000 },
  async () => {
    await withAtlasPage(async (page) => {
      for (const row of directData.projects) {
        await openRoute(page, { project: row.project_id, tab: "sources" });
        const panel = page.locator(".direct-source-panel");
        assert.equal(
          await panel.getAttribute("data-direct-source"),
          row.project_id,
        );
        assert.ok((await panel.innerText()).includes(row.lookup_state));
        const summaries = panel.locator("details > summary");
        for (let i = 0; i < (await summaries.count()); i++)
          if (await summaries.nth(i).isVisible())
            await summaries.nth(i).click();
        assert.equal(
          await panel.locator(".fingerprint").count(),
          row.documents.length,
        );
        const text = await panel.innerText();
        for (const doc of row.documents) {
          assert.ok(text.includes(doc.sha256));
          assert.ok(text.includes(doc.label));
        }
      }
    });
  },
);
