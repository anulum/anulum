// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — reader-passport public behaviour contracts

import { withAtlasSourceVariant } from "./atlas-source-variant.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import { withAtlasPage, openRoute } from "./atlas-runtime.mjs";
import { atlas } from "./atlas-data.mjs";

test(
  "public DOM event boundary ignores tablist keys outside its focused tabs; not native keyboard or AT proof",
  { timeout: 120000 },
  async () => {
    await withAtlasPage(async (page) => {
      await openRoute(page, { project: atlas.nodes[0].id });
      const selected = await page
        .getByRole("tab", { selected: true })
        .getAttribute("id");
      await page.locator("#main").focus();
      await page
        .getByRole("tablist")
        .dispatchEvent("keydown", { key: "ArrowRight", bubbles: true });
      assert.equal(
        await page.getByRole("tab", { selected: true }).getAttribute("id"),
        selected,
      );
      assert.equal(
        await page
          .locator("#main")
          .evaluate(function outsidePassportTabsFocus(node) {
            return node === document.activeElement;
          }),
        true,
      );
      assert.equal(await page.getByRole("tabpanel").count(), 1);
    });
  },
);

test(
  "every passport exposes six native panels and its original source state",
  { timeout: 600000 },
  async () => {
    await withAtlasPage(async (page) => {
      for (const node of atlas.nodes) {
        await openRoute(page, { project: node.id });
        assert.equal(await page.locator("#content h1").innerText(), node.name);
        assert.equal(
          await page.locator(".passport-heading .badge").innerText(),
          node.work_status,
        );
        const tabs = page.getByRole("tab");
        assert.equal(await tabs.count(), 6);
        for (let i = 0; i < 6; i++) {
          await tabs.nth(i).click();
          assert.equal(await tabs.nth(i).getAttribute("aria-selected"), "true");
          assert.equal(await page.getByRole("tabpanel").count(), 1);
          if (i === 2) {
            await page.locator("#include-interface-proposals").check();
            assert.equal(
              await page.locator(".interface-card").count(),
              atlas.edges.filter(
                (edge) => edge.from === node.id || edge.to === node.id,
              ).length,
            );
            await page.locator("#include-interface-proposals").uncheck();
            assert.equal(
              await page.locator(".interface-card").count(),
              atlas.edges.filter(
                (edge) =>
                  (edge.from === node.id || edge.to === node.id) &&
                  !["architect proposal", "architect design"].includes(
                    edge.layer || "",
                  ),
              ).length,
            );
          }
        }
        await tabs.first().focus();
        for (const key of ["ArrowRight", "End", "ArrowLeft", "Home", "x"]) {
          await page.keyboard.press(key);
          assert.equal(
            await page.locator('[role="tab"][aria-selected="true"]').count(),
            1,
          );
        }
      }
    });
  },
);

test(
  "incomplete dossiers and hostile track labels remain readable plain text",
  { timeout: 120000 },
  async () => {
    let missing = "",
      tracked = "",
      label = "",
      referenceTitle = "",
      referenceUrl = "",
      referenceRevision = "";
    await withAtlasSourceVariant(
      ({ atlas, library, technical }) => {
        const publicOwners = new Set(
          library.projects
            .filter((row) => row.documents.length)
            .map((row) => row.project_id),
        );
        const absent = atlas.nodes.find((row) => publicOwners.has(row.id));
        assert.ok(absent);
        missing = absent.id;
        Reflect.deleteProperty(absent, "dossier");
        const node = atlas.nodes.find(
          (row) =>
            row.id !== missing &&
            publicOwners.has(row.id) &&
            row.dossier?.expected_outputs?.length &&
            technical.references.some(
              (reference) => reference.project === row.id,
            ),
        );
        assert.ok(node?.dossier);
        assert.ok(node.dossier.expected_outputs);
        tracked = node.id;
        label = node.name + ' <img src=x onerror="window.atlasInjected=true">';
        node.dossier.programme_tracks = [{ name: label, scope: node.function }];
        const source = technical.references.find(
          (row) => row.project === node.id,
        );
        assert.ok(source);
        assert.ok(node.url);
        referenceTitle = source.document;
        referenceUrl = node.url;
        referenceRevision = source.source_sha256;
        node.dossier.programme_basis = source.source_sha256;
        node.dossier.references = [
          {
            id: source.id,
            title: source.document,
            source_revision: source.source_sha256,
            scope: node.boundary,
            url: node.url,
          },
          {
            id: source.id + "-unsafe-url",
            title: source.document + " unsafe URL",
            source_revision: source.source_sha256,
            scope: node.boundary,
            // eslint-disable-next-line no-script-url -- The public source renderer must refuse hostile source URLs.
            url: "javascript:alert(1)",
          },
        ];
        Reflect.deleteProperty(node.dossier, "current_surfaces");
        node.dossier.expected_outputs[0].basis = "";
        Reflect.deleteProperty(node, "sources");
        node.group = "absent-source-group";
      },
      async (servedBase) => {
        await withAtlasPage(
          async (page) => {
            for (const project of [missing, tracked]) {
              for (const [tab, index] of /** @type {[string,number][]} */ ([
                ["overview", 0],
                ["outputs", 1],
                ["interfaces", 2],
                ["resources", 3],
                ["sources", 4],
                ["visuals", 5],
              ])) {
                await openRoute(page, { project, tab });
                assert.equal(await page.locator("#content h1").count(), 1);
                assert.equal(
                  await page
                    .locator("#passport-tab-" + index)
                    .getAttribute("aria-selected"),
                  "true",
                );
              }
            }
            await openRoute(page, { project: tracked, tab: "outputs" });
            assert.ok(
              (await page.locator("#content").innerText()).includes(label),
            );
            assert.equal(await page.locator('img[src="x"]').count(), 0);
            assert.ok(
              (await page.locator("#content").innerText()).includes(
                "Basis: Source goal",
              ),
            );
            assert.equal(
              await page
                .getByRole("link", { name: referenceTitle, exact: true })
                .getAttribute("href"),
              referenceUrl,
            );
            assert.ok(
              (await page.locator("#content").innerText()).includes(
                referenceRevision,
              ),
            );
            assert.equal(
              await page.locator('#content a[href^="javascript:"]').count(),
              0,
            );
          },
          { servedBase },
        );
      },
    );
  },
);
