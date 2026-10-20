// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — legacy-atlas public behaviour contracts

import test from "node:test";
import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  withAtlasPage,
  baseUrl,
  navigate,
  withAtlasArtifact,
} from "./atlas-runtime.mjs";
import { atlas } from "./atlas-data.mjs";
import { withAtlasSourceVariant } from "./atlas-source-variant.mjs";

test(
  "the complete technical atlas retains every source detail and its native controls",
  { timeout: 600000 },
  async () => {
    await withAtlasPage(async (page) => {
      await navigate(page, baseUrl + "atlas_full.html");
      await page.locator(".node").first().waitFor();
      assert.equal(await page.locator(".node").count(), atlas.nodes.length);
      for (const node of atlas.nodes) {
        await page.evaluate((id) => {
          location.hash = "#project=" + encodeURIComponent(id);
        }, node.id);
        await page.waitForFunction(
          (name) => document.querySelector("#detail h2")?.textContent === name,
          node.name,
        );
        assert.equal(
          await page.locator("#detail > .badge").innerText(),
          node.work_status,
        );
        assert.ok(
          (await page.locator("#detail").innerText()).includes(node.function),
        );
      }
      await page.locator("#list-tab").click();
      assert.equal(
        await page.locator("#inventory .inventory-card").count(),
        atlas.nodes.length,
      );
      const options = await page
        .locator("#group-filter option")
        .evaluateAll(function legacyProgrammeOptions(elements) {
          return elements.map(
            (element) => /** @type {HTMLOptionElement} */ (element).value,
          );
        });
      for (const group of options) {
        await page.locator("#group-filter").selectOption(group);
        assert.equal(
          await page.locator("#inventory .inventory-card").count(),
          atlas.nodes.filter((node) => !group || node.group === group).length,
        );
      }
      await page.locator("#group-filter").selectOption("");
      await page.locator("#inventory .inventory-card").first().click();
      await page.locator("#map-tab").click();
      await page.locator("#search").fill("SC-NEUROCORE");
      assert.ok((await page.locator("#results button").count()) > 0);
      await page.locator("#results button").first().click();
      await page.locator("#search").fill("NO_MATCH_7a2b86c1");
      assert.match(
        await page.locator("#results").innerText(),
        /No matching entry/,
      );
      await page.keyboard.press("Escape");
      assert.equal(await page.locator("#results").isVisible(), false);
      await page.locator("#search").fill("");
      for (const mode of ["none", "all", "selected"]) {
        await page.locator("#edge-mode").selectOption(mode);
        await page.locator("#show-proposals").check();
        await page.locator("#show-proposals").uncheck();
        if (mode === "none")
          assert.equal(await page.locator("#edges > *").count(), 0);
      }
      await page.locator("#fit").click();
      const original = await page.locator("#atlas-svg").getAttribute("viewBox");
      await page.locator("#zoom-in").click();
      assert.notEqual(
        await page.locator("#atlas-svg").getAttribute("viewBox"),
        original,
      );
      await page.locator("#zoom-out").click();
      await page.locator("#fit").click();
      assert.equal(
        await page.locator("#atlas-svg").getAttribute("viewBox"),
        original,
      );
      const canvas = page.locator("#canvas"),
        box = await canvas.boundingBox();
      assert.ok(box);
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.wheel(0, -120);
      await page.mouse.wheel(0, 120);
      await page.mouse.down();
      await page.mouse.move(
        box.x + box.width / 2 + 50,
        box.y + box.height / 2 + 35,
      );
      await page.mouse.up();
      await page.locator(".node").first().focus();
      await page.keyboard.press("Enter");
      await page.keyboard.press("Space");
      assert.equal(await page.locator(".node.selected").count(), 1);
      await navigate(
        page,
        baseUrl + "atlas_full.html#group=" + encodeURIComponent(options[1]),
      );
      assert.equal(
        await page.locator("#group-filter").inputValue(),
        options[1],
      );
      const retainedSelection = await page
        .locator(".node.selected")
        .getAttribute("data-id");
      await navigate(
        page,
        baseUrl + "atlas_full.html#project=absent-source-id",
      );
      assert.equal(await page.locator(".node.selected").count(), 1);
      assert.equal(
        await page.locator(".node.selected").getAttribute("data-id"),
        retainedSelection,
      );
    });
  },
);

test(
  "legacy SVG identity faults and native touch cancellation cannot corrupt the selection or camera",
  { timeout: 120000 },
  async () => {
    let damagedIdentity = "";
    await withAtlasArtifact(
      async (directory) => {
        const path = join(directory, "atlas_full.html"),
          html = await readFile(path, "utf8"),
          identity = html.match(/class="node"\s+data-id="([^"]+)"/),
          changed = html.replace(
            /(class="node"\s+)data-id="[^"]+"/,
            '$1data-id=""',
          );
        assert.notEqual(changed, html);
        assert.ok(identity);
        damagedIdentity = identity[1];
        await writeFile(path, changed);
      },
      async (servedBase) => {
        await withAtlasPage(
          async (page) => {
            await navigate(
              page,
              servedBase +
                "atlas_full.html#project=" +
                encodeURIComponent(damagedIdentity),
            );
            const before = await page.locator("#detail").textContent(),
              malformed = page.locator('.node[data-id=""]');
            await malformed.focus();
            await page.keyboard.press("Enter");
            await page.keyboard.press("Space");
            await malformed.click();
            await malformed.dispatchEvent("click", {
              bubbles: true,
              cancelable: true,
            });
            assert.equal(await page.locator("#detail").textContent(), before);
            assert.equal(await page.locator(".node.selected").count(), 0);
            const known = atlas.nodes.find((row) => row.id !== damagedIdentity);
            assert.ok(known);
            await navigate(
              page,
              servedBase +
                "atlas_full.html#project=" +
                encodeURIComponent(known.id),
            );
            const node = page.locator('.node[data-id="' + known.id + '"]');
            await node.click();
            assert.equal(
              await page.locator(".node.selected").getAttribute("data-id"),
              known.id,
            );
            const svg = page.locator("#atlas-svg"),
              view = await svg.getAttribute("viewBox"),
              box = await node.boundingBox();
            assert.ok(box);
            const x = box.x + box.width / 2,
              y = box.y + box.height / 2;
            await page.mouse.move(x, y);
            await page.mouse.down();
            const protocol = await page.context().newCDPSession(page);
            await protocol.send("Emulation.setTouchEmulationEnabled", {
              enabled: true,
              maxTouchPoints: 1,
            });
            await protocol.send("Input.dispatchTouchEvent", {
              type: "touchStart",
              touchPoints: [{ x, y }],
            });
            await protocol.send("Input.dispatchTouchEvent", {
              type: "touchCancel",
              touchPoints: [],
            });
            await protocol.send("Emulation.setTouchEmulationEnabled", {
              enabled: false,
            });
            await protocol.detach();
            await page.mouse.up();
            await page.mouse.move(x + 30, y + 30);
            assert.equal(await svg.getAttribute("viewBox"), view);
            assert.equal(
              await page.locator("#detail h2").textContent(),
              known.name,
            );
          },
          { servedBase },
        );
      },
    );
  },
);

test(
  "public DOM activation (click event) respects SVG identities and panning; this is not AT proof",
  { timeout: 120000 },
  async () => {
    await withAtlasPage(async (page) => {
      await navigate(page, baseUrl + "atlas_full.html");
      const source = atlas.nodes[0],
        other = atlas.nodes[1],
        first = page.locator('.node[data-id="' + source.id + '"]'),
        second = page.locator('.node[data-id="' + other.id + '"]');
      await first.dispatchEvent("click", { bubbles: true, cancelable: true });
      assert.equal(await page.locator("#detail h2").textContent(), source.name);
      assert.equal(
        await page.locator(".node.selected").getAttribute("data-id"),
        source.id,
      );
      await first.hover();
      const box = await first.boundingBox();
      assert.ok(box);
      const x = box.x + box.width / 2,
        y = box.y + box.height / 2;
      await page.mouse.down();
      await page.mouse.move(x + 30, y + 25);
      await second.dispatchEvent("click", { bubbles: true, cancelable: true });
      assert.equal(await page.locator("#detail h2").textContent(), source.name);
      await page.mouse.up();
      await page.evaluate(function legacyActivationFrame() {
        return new Promise((resolve) => requestAnimationFrame(resolve));
      });
      await second.dispatchEvent("click", { bubbles: true, cancelable: true });
      assert.equal(await page.locator("#detail h2").textContent(), other.name);
      assert.equal(
        await page.locator(".node.selected").getAttribute("data-id"),
        other.id,
      );
    });
  },
);

test(
  "zero-position groups and incomplete legacy sources retain native navigation and text safety",
  { timeout: 120000 },
  async () => {
    let zeroGroup = "",
      absentGeometry = "",
      orphan = "",
      sparse = "",
      sparseName = "",
      trackProject = "",
      trackName = "",
      trackLabel = "",
      referenceTitle = "",
      referenceUrl = "",
      configurationProject = "",
      configurationState = "",
      configurationNames = /** @type {string[]} */ ([]),
      candidateProject = "",
      candidateLabel = "",
      relationProject = "";
    await withAtlasSourceVariant(
      ({ atlas, technical, library }) => {
        const publicOwners = new Set(
          library.projects
            .filter((row) => row.documents.length)
            .map((row) => row.project_id),
        );
        const configured = atlas.nodes.find(
          (row) =>
            publicOwners.has(row.id) &&
            row.dossier?.configurations?.length &&
            row.dossier.evidence_state,
        );
        assert.ok(configured?.dossier?.configurations);
        assert.ok(configured.dossier.evidence_state);
        configurationProject = configured.id;
        configurationState = configured.dossier.evidence_state;
        configurationNames = [...configured.dossier.configurations];
        configured.dossier.configuration_state = configurationState;
        zeroGroup = atlas.groups[0].id;
        atlas.groups[0].x = 0;
        absentGeometry = atlas.groups[1].id;
        Reflect.deleteProperty(atlas.groups[1], "x");
        const removed = atlas.nodes.pop();
        assert.ok(removed);
        orphan = removed.id;
        const node = atlas.nodes[0];
        sparse = node.id;
        sparseName = node.name;
        Reflect.deleteProperty(node, "dossier");
        const reference = technical.references.find((row) =>
          publicOwners.has(row.project),
        );
        assert.ok(reference);
        const tracked = atlas.nodes.find((row) => row.id === reference.project);
        assert.ok(tracked?.dossier);
        assert.ok(tracked.url);
        tracked.dossier.references = [
          {
            id: reference.id,
            title: reference.document,
            source_revision: reference.source_sha256,
            scope: tracked.boundary,
            url: tracked.url,
          },
        ];
        referenceTitle = reference.document;
        referenceUrl = tracked.url;
        tracked.dossier.references.push({
          ...tracked.dossier.references[0],
          id: reference.id + "-published",
        });
        trackProject = tracked.id;
        trackName = tracked.name;
        trackLabel = '<img src=x onerror="window.atlasInjected=true">';
        tracked.dossier.programme_tracks = [
          { name: trackLabel, scope: tracked.function },
        ];
        // eslint-disable-next-line no-script-url -- Inert hostile source data must be refused by the real reference renderer.
        tracked.dossier.references[0].url = "javascript:alert(1)";
        tracked.owning_groups.push("absent-source-owner");
        const candidate = atlas.nodes.find(
          (row) => row.resource_candidates?.length,
        );
        assert.ok(candidate);
        assert.ok(candidate.resource_candidates);
        candidateProject = candidate.id;
        const acquisition = candidate.resource_candidates[0];
        acquisition.author = "";
        candidateLabel = acquisition.item + " · " + acquisition.maker;
        const edge = atlas.edges.find(
          (row) =>
            row.to !== orphan &&
            publicOwners.has(row.from) &&
            publicOwners.has(row.to),
        );
        assert.ok(edge);
        edge.from = "absent-source-position";
        edge.kind = "planned interface";
        relationProject = edge.to;
      },
      async (servedBase) => {
        await withAtlasPage(
          async (page) => {
            await navigate(page, servedBase + "atlas_full.html");
            const originalDetail = await page.locator("#detail").textContent();
            await page.locator("#show-proposals").check();
            await page.locator("#show-proposals").uncheck();
            await page.locator("#edge-mode").selectOption("all");
            await page.locator('.node[data-id="' + orphan + '"]').focus();
            await page.keyboard.press("Enter");
            assert.equal(
              await page.locator("#detail").textContent(),
              originalDetail,
            );
            await page.locator("#search").fill(sparseName);
            await page.locator("#results button").first().click();
            assert.equal(
              await page.locator("#detail h2").textContent(),
              sparseName,
            );
            await page.locator("#search").fill("NO_MATCH_7a2b86c1");
            await navigate(
              page,
              servedBase +
                "atlas_full.html#project=" +
                encodeURIComponent(trackProject),
            );
            await page
              .locator("#detail h2")
              .filter({ hasText: trackName })
              .waitFor();
            assert.equal(await page.locator("#search").inputValue(), "");
            const trackedText = await page.locator("#detail").textContent();
            assert.ok(trackedText);
            assert.ok(trackedText.includes(trackLabel));
            assert.ok(trackedText.includes("absent-source-owner"));
            assert.equal(await page.locator('#detail img[src="x"]').count(), 0);
            assert.equal(
              await page
                .getByRole("link", { name: referenceTitle, exact: true })
                .getAttribute("href"),
              referenceUrl,
            );
            assert.equal(
              await page.locator('#detail a[href^="javascript:"]').count(),
              0,
            );
            await navigate(
              page,
              servedBase +
                "atlas_full.html#project=" +
                encodeURIComponent(configurationProject),
            );
            const configuredDetail = page.locator("#detail");
            await configuredDetail
              .getByText(configurationState, { exact: true })
              .waitFor();
            assert.equal(
              await configuredDetail
                .getByText(configurationState, { exact: true })
                .count(),
              1,
            );
            for (const configuration of configurationNames)
              assert.ok(
                (await configuredDetail.innerText()).includes(configuration),
              );
            await navigate(
              page,
              servedBase +
                "atlas_full.html#project=" +
                encodeURIComponent(candidateProject),
            );
            await page
              .locator("#detail summary")
              .filter({ hasText: candidateLabel })
              .first()
              .click();
            assert.ok(
              (await page.locator("#detail").innerText()).includes(
                "Owning group; independent primary-page check by CEO seat",
              ),
            );
            await navigate(
              page,
              servedBase +
                "atlas_full.html#project=" +
                encodeURIComponent(relationProject),
            );
            const relationText = await page.locator("#detail").textContent();
            assert.ok(relationText);
            assert.ok(relationText.includes("Interface in progress"));
            await navigate(
              page,
              servedBase +
                "atlas_full.html#group=" +
                encodeURIComponent(zeroGroup),
            );
            assert.equal(
              await page.locator("#group-filter").inputValue(),
              zeroGroup,
            );
            const viewBox = await page
              .locator("#atlas-svg")
              .getAttribute("viewBox");
            assert.ok(viewBox);
            assert.ok(!viewBox.includes("NaN"));
            assert.equal(
              await page
                .locator('#group-filter option[value="' + absentGeometry + '"]')
                .count(),
              0,
            );
            await navigate(
              page,
              servedBase +
                "atlas_full.html#group=" +
                encodeURIComponent(absentGeometry),
            );
            assert.equal(
              await page.locator("#group-filter").inputValue(),
              zeroGroup,
            );
            await navigate(
              page,
              servedBase +
                "atlas_full.html#project=" +
                encodeURIComponent(sparse),
            );
            assert.equal(
              await page.locator("#detail h2").textContent(),
              sparseName,
            );
          },
          { servedBase },
        );
      },
    );
  },
);
