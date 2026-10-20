// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — reader-network public behaviour contracts

import { withAtlasSourceVariant } from "./atlas-source-variant.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import { withAtlasPage, openRoute } from "./atlas-runtime.mjs";
import { atlas } from "./atlas-data.mjs";

test(
  "native interface cards preserve every incident source and proposal edge",
  { timeout: 600000 },
  async () => {
    await withAtlasPage(async (page) => {
      for (const node of atlas.nodes) {
        await openRoute(page, { project: node.id, tab: "interfaces" });
        const all = atlas.edges.filter(
          (edge) => edge.from === node.id || edge.to === node.id,
        );
        const declared = all.filter(
          (edge) =>
            !["architect proposal", "architect design"].includes(
              edge.layer || "",
            ),
        );
        assert.equal(
          await page.locator(".interface-card").count(),
          declared.length,
        );
        await page.locator("#include-interface-proposals").check();
        assert.equal(await page.locator(".interface-card").count(), all.length);
        for (const edge of all)
          assert.ok(
            (await page.locator(".interface-list").innerText()).includes(
              edge.kind,
            ),
          );
        await page.locator("#include-interface-proposals").uncheck();
        assert.equal(
          await page.locator(".interface-card").count(),
          declared.length,
        );
      }
    });
  },
);

test(
  "incomplete interface evidence retains its declared date and explicit source gaps",
  { timeout: 120000 },
  async () => {
    let project = "",
      date = "",
      other = "";
    await withAtlasSourceVariant(
      ({ atlas, library }) => {
        const publicOwners = new Set(
          library.projects
            .filter((row) => row.documents.length)
            .map((row) => row.project_id),
        );
        const edge = atlas.edges.find(
          (row) => publicOwners.has(row.from) && publicOwners.has(row.to),
        );
        assert.ok(edge);
        project = edge.from;
        other = edge.to;
        date = atlas.as_of;
        edge.evidence = "";
        edge.as_of = date;
        const target = atlas.nodes.find((row) => row.id === other);
        assert.ok(target);
        target.function = "";
        const selected = atlas.nodes.find((row) => row.id === project);
        assert.ok(selected);
        Reflect.deleteProperty(selected, "dossier");
        selected.name += ' <img src=x onerror="window.atlasInjected=true">';
        const group = atlas.groups.find((row) => row.id === selected.group);
        assert.ok(group);
        group.color = "";
      },
      async (servedBase) => {
        await withAtlasPage(
          async (page) => {
            await openRoute(page, { project, tab: "interfaces" });
            const text = await page.locator(".interface-list").innerText();
            assert.ok(text.includes("Source date: " + date));
            assert.ok(
              text.includes("No additional source statement supplied."),
            );
            assert.ok(text.includes(other));
            const diagram = page.locator(".network-wrap");
            assert.equal(await diagram.locator('img[src="x"]').count(), 0);
            const labels = await diagram.textContent();
            assert.ok(labels);
            assert.ok(labels.includes("…"));
            assert.ok(
              (await diagram.locator('rect[stroke="#315d4c"]').count()) > 0,
            );
          },
          { servedBase },
        );
      },
    );
  },
);
