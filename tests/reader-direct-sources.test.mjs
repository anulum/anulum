// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — reader-direct-sources public behaviour contracts

import { withAtlasSourceVariant } from "./atlas-source-variant.mjs";
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

test(
  "a supplied source parse warning remains literal text beside its fingerprint",
  { timeout: 120000 },
  async () => {
    let project = "",
      warning = "";
    await withAtlasSourceVariant(
      ({ direct }) => {
        const row = direct.projects.find((item) => item.documents.length);
        assert.ok(row);
        project = row.project_id;
        warning =
          row.lookup_state + ' <img src=x onerror="window.atlasInjected=true">';
        row.documents[0].static_parse_state = warning;
      },
      async (servedBase) => {
        await withAtlasPage(
          async (page) => {
            await openRoute(page, { project, tab: "sources" });
            const panel = page.locator(".direct-source-panel");
            for (const summary of await panel
              .locator("details > summary")
              .all())
              if (await summary.isVisible()) await summary.click();
            assert.ok((await panel.innerText()).includes(warning));
            assert.equal(await panel.locator('img[src="x"]').count(), 0);
          },
          { servedBase },
        );
      },
    );
  },
);

test(
  "public project boundary metadata remains readable beside its captured documents",
  { timeout: 120000 },
  async () => {
    let project = "",
      boundary = "";
    await withAtlasSourceVariant(
      ({ atlas, direct }) => {
        const row = direct.projects.find((item) => item.documents.length);
        assert.ok(row);
        const node = atlas.nodes.find((item) => item.id === row.project_id);
        assert.ok(node);
        project = node.id;
        boundary = node.boundary;
        row.boundary_declarations = { boundary, category: node.kind };
      },
      async (servedBase) => {
        await withAtlasPage(
          async (page) => {
            await openRoute(page, { project, tab: "sources" });
            const panel = page.locator(".direct-source-panel");
            await panel
              .getByText("Machine-readable boundary declarations", {
                exact: true,
              })
              .click();
            const declaration = panel.locator("details").filter({
              has: page.getByText("Machine-readable boundary declarations", {
                exact: true,
              }),
            });
            assert.ok((await declaration.innerText()).includes(boundary));
            const captured = directData.projects.find(
              (row) => row.project_id === project,
            );
            assert.ok(captured);
            assert.equal(
              await panel.locator(".fingerprint").count(),
              captured.documents.length,
            );
          },
          { servedBase },
        );
      },
    );
  },
);
