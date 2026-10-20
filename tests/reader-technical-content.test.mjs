// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — reader-technical-content public behaviour contracts

import { withAtlasSourceVariant } from "./atlas-source-variant.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import { withAtlasPage, openRoute } from "./atlas-runtime.mjs";
import { atlas, technical } from "./atlas-data.mjs";

test(
  "technical panels retain supplied purpose, scope and result paragraphs",
  { timeout: 600000 },
  async () => {
    await withAtlasPage(async (page) => {
      for (const guide of technical.guides) {
        await openRoute(page, { project: guide.project_id, tab: "outputs" });
        const panel = page.locator(".technical-panel");
        assert.equal(
          await panel.getAttribute("data-technical-guide"),
          guide.project_id,
        );
        const text = (await panel.innerText()).replace(/\s+/g, " ");
        const paragraphs = [
          guide.purpose.text,
          guide.scope.text,
          ...(guide.inputs || []).map((row) => row.text),
          ...(guide.outputs || []).map((row) => row.text),
          ...(guide.implementation || []).map((row) => row.text),
        ];
        for (const paragraph of paragraphs)
          assert.ok(
            text.includes(paragraph.replace(/\s+/g, " ")),
            guide.project_id + " source paragraph",
          );
      }
      const without = atlas.nodes.find(
        (node) =>
          !technical.guides.some((guide) => guide.project_id === node.id),
      );
      assert.ok(without);
      await openRoute(page, { project: without.id, tab: "outputs" });
      assert.equal(await page.locator(".technical-panel").count(), 0);
    });
  },
);

test(
  "technical text omissions retain capture dates and escape supplied titles",
  { timeout: 120000 },
  async () => {
    let project = "",
      capture = "",
      label = "";
    await withAtlasSourceVariant(
      ({ technical }) => {
        const guide = technical.guides[0];
        project = guide.project_id;
        capture = technical.captured_at_utc;
        delete technical.guide_source_captures[project];
        Reflect.deleteProperty(guide, "inputs");
        Reflect.deleteProperty(guide, "outputs");
        label =
          guide.components[0].title +
          ' <img src=x onerror="window.atlasInjected=true">';
        guide.components[0].title = label;
      },
      async (servedBase) => {
        await withAtlasPage(
          async (page) => {
            await openRoute(page, { project, tab: "outputs" });
            const panel = page.locator(".technical-panel");
            assert.ok((await panel.innerText()).includes(capture));
            const sourceText = await panel.textContent();
            assert.ok(sourceText);
            assert.ok(sourceText.includes(label));
            assert.equal(await panel.locator('img[src="x"]').count(), 0);
            assert.equal(
              await panel
                .locator('[data-guide-section="inputs"] .technical-record')
                .count(),
              0,
            );
          },
          { servedBase },
        );
      },
    );
  },
);
