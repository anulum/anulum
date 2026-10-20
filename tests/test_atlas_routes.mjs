// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Source-derived public atlas journeys

import test from "node:test";
import assert from "node:assert/strict";
import { readFile, writeFile, mkdtemp, rm, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createHash } from "node:crypto";
import AxeBuilder from "@axe-core/playwright";
import { spawnSync } from "node:child_process";
import { Script } from "node:vm";
import {
  withAtlasPage,
  withAtlasArtifact,
  openRoute,
  baseUrl,
  navigate,
  checkpoint,
} from "./atlas-runtime.mjs";
import checkFundingStates from "./test_funding_states.mjs";
import checkResourceCoverage from "./test_resource_coverage.mjs";
import checkResourceExplorer, {
  verifyDownloadedCsv,
} from "./test_resource_explorer.mjs";

/** @type {import('../types/atlas.js').AtlasData} */
const atlas = JSON.parse(
  await readFile(
    new URL("../docs/atlas/public_atlas_data.json", import.meta.url),
    "utf8",
  ),
);
/** @type {import('../types/atlas.js').DocumentData} */
const library = JSON.parse(
  await readFile(
    new URL("../docs/atlas/document_library_candidate.json", import.meta.url),
    "utf8",
  ),
);
/** @type {import('../types/atlas.js').TechnicalData} */
const technical = JSON.parse(
  await readFile(
    new URL(
      "../docs/atlas/technical_explanations_candidate.json",
      import.meta.url,
    ),
    "utf8",
  ),
);
/** @type {import('../types/atlas.js').BudgetData} */
const budget = JSON.parse(
  await readFile(
    new URL("../docs/atlas/public_budget_data.json", import.meta.url),
    "utf8",
  ),
);

test(
  "funding states remain distinct across search, passports, briefs and both maps",
  { timeout: 120000 },
  async () => {
    await withAtlasPage(async (page) => {
      const report = await checkFundingStates(page, {
        baseUrl,
        navigate: (url) => navigate(page, url),
      });
      assert.equal(report.records.length, 14);
      for (const node of atlas.nodes.filter(
        (row) => row.kind === "funding route",
      ))
        assert.ok(
          report.mapEntries.some(
            (row) => row.id === node.id && row.state === node.work_status,
          ),
          node.name + " actual project tile",
        );
    });
  },
);

test(
  "resource source coverage retains missing groups and content-bound assets",
  { timeout: 120000 },
  async () => {
    await withAtlasPage(async (page) => {
      const report = await checkResourceCoverage(page, {
        baseUrl,
        navigate: (url) => navigate(page, url),
        beforeNavigation: () => checkpoint(page),
      });
      assert.deepEqual(report.errors, []);
      assert.deepEqual(report.httpFailures, []);
    });
  },
);

test(
  "all resource views export exactly the selected source rows",
  { timeout: 120000 },
  async () => {
    const directory = await mkdtemp(join(tmpdir(), "anulum-inventory-"));
    try {
      await withAtlasPage(async (page) => {
        const report = await checkResourceExplorer(page, {
          baseUrl,
          downloadDirectory: directory,
          navigate: (url) => navigate(page, url),
          beforeNavigation: () => checkpoint(page),
        });
        await verifyDownloadedCsv(report);
        assert.ok(report.downloads.length >= 4);
      });
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
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
  "retained project briefs, map levels and catalogues open through their public routes",
  { timeout: 600000 },
  async () => {
    await withAtlasPage(async (page) => {
      for (const node of atlas.nodes) {
        await openRoute(page, { view: "support", entry: node.id });
        assert.equal(await page.locator("#content h1").innerText(), node.name);
        assert.equal(
          await page.locator(".support-brief > .badge").innerText(),
          node.work_status,
        );
        await openRoute(page, { view: "map", focus: node.id });
        assert.equal(
          await page.locator(".map-focused-project h2").innerText(),
          node.name,
        );
        assert.equal(
          (await page.locator(".map-entry[data-entry]").count()) > 0,
          true,
        );
      }
      for (const group of atlas.groups) {
        await openRoute(page, { group: group.id });
        assert.equal(
          await page.locator(".project-card").count(),
          atlas.nodes.filter((node) => node.group === group.id).length,
        );
        await openRoute(page, { view: "map", group: group.id });
        assert.ok((await page.locator(".map-entry").count()) > 0);
      }
    });
  },
);

test(
  "both document libraries display every captured source line without markup interpretation",
  { timeout: 600000 },
  async () => {
    await withAtlasPage(async (page) => {
      for (const [
        view,
        data,
      ] of /** @type {[string, import('../types/atlas.js').DocumentData][]} */ ([
        ["documents", library],
        ["technical-source", technical.library],
      ])) {
        for (const project of data.projects)
          for (const doc of project.documents) {
            await openRoute(page, {
              view,
              entry: project.project_id,
              document: doc.label,
            });
            assert.deepEqual(
              await page.locator(".document-line-text").allTextContents(),
              doc.lines,
              project.project_id + "/" + doc.label,
            );
          }
      }
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
  "unknown source identities remain explicit recovery views",
  { timeout: 120000 },
  async () => {
    await withAtlasPage(async (page) => {
      for (const route of /** @type {Record<string,string>[]} */ ([
        { project: "absent-source-id" },
        { group: "absent-source-id" },
        { view: "coverage", programme: "absent-source-id" },
        { view: "coverage", missing: "absent-source-id" },
        { view: "documents", entry: "absent-source-id" },
        { view: "documents", programme: "absent-source-id" },
        {
          view: "documents",
          entry: atlas.nodes[0].id,
          document: "absent-source-document",
        },
        { view: "technical", entry: "absent-source-id" },
        {
          view: "technical-source",
          entry: "absent-source-id",
          document: "absent-source-document",
        },
        { view: "map", group: "absent-source-id" },
        { view: "map", type: "absent-source-family" },
        { view: "support", entry: "absent-source-id" },
        { view: "unavailable" },
      ])) {
        await openRoute(page, route);
        assert.match(
          await page.locator("#content").innerText(),
          /not found|not present|not identify|unavailable|not supplied/i,
        );
      }
    });
  },
);

test(
  "preliminary budget scenarios retain their source identity and separate totals",
  { timeout: 120000 },
  async () => {
    await withAtlasPage(async (page) => {
      for (const scenario of budget.scenarios) {
        await navigate(
          page,
          baseUrl +
            "budget.html#" +
            new URLSearchParams({ scenario: scenario.id }),
        );
        await page.locator("#scenario-view .metric").first().waitFor();
        assert.equal(await page.locator("#scenario").inputValue(), scenario.id);
        const text = await page.locator("#scenario-view").innerText();
        assert.ok(
          (await page.locator("#scenario option:checked").innerText()).includes(
            scenario.title,
          ),
        );
        assert.ok(text.includes(scenario.state));
        assert.ok(!text.includes("NaN"));
      }
      await page.locator("#family").selectOption("Institute");
      assert.equal(
        await page.locator("#scenario option").count(),
        budget.scenarios.length,
      );
    });
  },
);

test(
  "native map controls preserve navigation, layer scope and camera behaviour",
  { timeout: 120000 },
  async () => {
    await withAtlasPage(async (page) => {
      await openRoute(page, { view: "map" });
      assert.equal(
        await page.locator(".map-entry").count(),
        atlas.groups.length,
      );
      const viewport = page.locator("#semantic-canvas"),
        svg = viewport.locator("svg");
      const original = await svg.getAttribute("viewBox");
      await page.getByRole("button", { name: "＋", exact: true }).click();
      assert.notEqual(await svg.getAttribute("viewBox"), original);
      await page.getByRole("button", { name: "−", exact: true }).click();
      await page
        .getByRole("button", { name: "Reset view", exact: true })
        .click();
      assert.equal(await svg.getAttribute("viewBox"), original);
      await page.locator("#map-show-relations").check();
      assert.ok((await page.locator(".map-edge-buttons button").count()) > 0);
      await page.locator(".map-edge-buttons button").first().click();
      assert.equal(
        await page.locator(".map-relation-explanation").isVisible(),
        true,
      );
      await page.locator(".map-relation-explanation summary").first().click();
      await page.locator("#map-show-proposals").check();
      assert.ok((await page.locator(".map-edge-buttons button").count()) > 0);
      await page.locator("#map-show-proposals").uncheck();
      await page.locator("#map-show-relations").uncheck();
      assert.equal(await page.locator(".map-edge-buttons button").count(), 0);
      const box = await viewport.boundingBox();
      assert.ok(box);
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(
        box.x + box.width / 2 + 60,
        box.y + box.height / 2 + 35,
      );
      await page.mouse.up();
      assert.notEqual(await svg.getAttribute("viewBox"), original);
      await page.mouse.wheel(0, -120);
      await page.mouse.wheel(0, 120);
      await page
        .getByRole("button", { name: "Reset view", exact: true })
        .click();
      await page.locator("#map-project-search").fill("NO_MATCH_7a2b86c1");
      assert.equal(await page.locator(".map-search-result").count(), 0);
      await page.locator("#map-project-search").fill("SC-NEUROCORE");
      await page.locator(".map-search-result").first().click();
      await page.locator(".map-focused-project h2").waitFor();
      const node = atlas.nodes.find((row) => row.id === "SC-NEUROCORE");
      assert.ok(node);
      assert.equal(
        await page.locator(".map-focused-project h2").innerText(),
        node.name,
      );
      for (const width of [390, 800, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        assert.ok((await page.locator(".map-entry").count()) > 0);
      }
      await page.locator("#map-programme").selectOption("");
      await page.waitForURL((url) => !url.hash.includes("focus="));
      const first = page.locator(".map-entry").first();
      const target = await first.getAttribute("data-target");
      assert.ok(target);
      await first.focus();
      await page.keyboard.press("Enter");
      await page.waitForURL((url) => url.hash === target);
      assert.ok((await page.locator(".map-entry").count()) > 0);
    });
  },
);

test(
  "document search, line links and native text download preserve exact captured content",
  { timeout: 120000 },
  async () => {
    const project = library.projects.find((row) =>
      row.documents.some((doc) => doc.lines.length > 5),
    );
    assert.ok(project);
    const doc = project.documents.find((row) => row.lines.length > 5);
    assert.ok(doc);
    await withAtlasPage(async (page) => {
      await openRoute(page, {
        view: "documents",
        entry: project.project_id,
        document: doc.label,
        line: "1",
      });
      assert.equal(
        await page.locator("#source-line-1").getAttribute("class"),
        "document-line selected-source-line",
      );
      const query = doc.lines.find((line) => line.trim().length > 4);
      assert.ok(query);
      await page.locator("#document-find").fill(query.trim().slice(0, 4));
      assert.ok((await page.locator(".document-text mark").count()) > 0);
      await page
        .getByRole("button", { name: "Previous match", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Next match", exact: true })
        .click();
      await page.locator("#document-find").press("Enter");
      assert.equal(await page.locator("mark.current-match").count(), 1);
      await page.locator("#document-find").fill("NO_MATCH_7a2b86c1");
      assert.equal(
        await page
          .getByRole("button", { name: "Next match", exact: true })
          .isDisabled(),
        true,
      );
      await page.locator("#document-find").fill("");
      assert.deepEqual(
        await page.locator(".document-line-text").allTextContents(),
        doc.lines,
      );
      const downloading = page.waitForEvent("download");
      await page
        .getByRole("button", {
          name: "Download this reading view",
          exact: true,
        })
        .click();
      const download = await downloading,
        path = await download.path();
      assert.ok(path);
      assert.equal(await readFile(path, "utf8"), doc.lines.join("\n"));
      for (const line of [
        "0",
        "-1",
        "1.5",
        "9007199254740992",
        String(doc.lines.length + 1),
      ]) {
        await openRoute(page, {
          view: "documents",
          entry: project.project_id,
          document: doc.label,
          line,
        });
        assert.equal(await page.locator(".selected-source-line").count(), 0);
        assert.deepEqual(
          await page.locator(".document-line-text").allTextContents(),
          doc.lines,
        );
      }
    });
  },
);

test(
  "comparison controls retain distinct source identities and the three-system limit",
  { timeout: 120000 },
  async () => {
    await withAtlasPage(async (page) => {
      await openRoute(page, { view: "compare" });
      const inputs = page.locator('input[name="systems"]');
      assert.equal(await inputs.count(), technical.guides.length);
      for (let i = 0; i < 3; i++) await inputs.nth(i).check();
      assert.equal(await page.locator(".comparison-project").count(), 3);
      assert.equal(await inputs.nth(3).isDisabled(), true);
      await inputs.nth(0).uncheck();
      assert.equal(await page.locator(".comparison-project").count(), 2);
      assert.equal(await inputs.nth(3).isDisabled(), false);
      await page
        .getByRole("button", { name: "Clear selection", exact: true })
        .click();
      assert.equal(await page.locator(".comparison-project").count(), 0);
      assert.equal(
        await inputs
          .first()
          .evaluate((node) => node === document.activeElement),
        true,
      );
      for (let i = 0; i < technical.guides.length; i += 3) {
        const ids = technical.guides
          .slice(i, i + 3)
          .map((guide) => guide.project_id);
        await openRoute(page, { view: "compare", entries: ids.join(",") });
        if (ids.length >= 2)
          assert.equal(
            await page.locator(".comparison-project").count(),
            ids.length,
          );
      }
      for (const entries of [
        "absent-source-id",
        technical.guides[0].project_id + "," + technical.guides[0].project_id,
        technical.guides
          .slice(0, 4)
          .map((guide) => guide.project_id)
          .join(","),
      ]) {
        await openRoute(page, { view: "compare", entries });
        assert.match(
          await page.locator("#content").innerText(),
          /requires distinct project identities/,
        );
        assert.equal(
          await page
            .getByRole("link", { name: "Choose systems", exact: true })
            .count(),
          1,
        );
      }
    });
  },
);

test(
  "catalogue and source filters preserve complete populations when cleared",
  { timeout: 120000 },
  async () => {
    await withAtlasPage(async (page) => {
      await openRoute(page, { view: "search" });
      assert.equal(
        await page.locator(".project-card").count(),
        atlas.nodes.length,
      );
      await page.locator("#reader-search").fill("NO_MATCH_7a2b86c1");
      assert.equal(await page.locator(".project-card").count(), 0);
      await page.locator("#reader-search").fill("");
      for (const group of atlas.groups) {
        await page.locator("#reader-search-group").selectOption(group.id);
        assert.equal(
          await page.locator(".project-card").count(),
          atlas.nodes.filter((node) => node.group === group.id).length,
        );
      }
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
      await openRoute(page, { view: "visuals" });
      const total = await page
        .locator(".visual-grid > figure:visible,.visual-grid > article:visible")
        .count();
      assert.ok(total > 0);
      await page.locator("#visual-search").fill("NO_MATCH_7a2b86c1");
      assert.equal(await page.locator(".visual-grid > :visible").count(), 0);
      await page
        .getByRole("button", { name: "Clear filters", exact: true })
        .click();
      assert.equal(
        await page.locator(".visual-grid > :visible").count(),
        total,
      );
      for (const id of ["visual-group", "visual-kind"]) {
        const values = await page
          .locator("#" + id + " option")
          .evaluateAll(function galleryFilterValues(options) {
            return options.map(
              (option) => /** @type {HTMLOptionElement} */ (option).value,
            );
          });
        for (const value of values)
          await page.locator("#" + id).selectOption(value);
        await page
          .getByRole("button", { name: "Clear filters", exact: true })
          .click();
      }
      await openRoute(page, { view: "source-updates" });
      const count = await page.locator(".project-card").count();
      assert.ok(count > 0);
      await page
        .getByRole("searchbox", { name: "Search source updates" })
        .fill("NO_MATCH_7a2b86c1");
      assert.equal(await page.locator(".project-card").count(), 0);
      await page
        .getByRole("searchbox", { name: "Search source updates" })
        .fill("");
      assert.equal(await page.locator(".project-card").count(), count);
    });
  },
);

test(
  "source field coverage filters and exports retain the displayed original identities",
  { timeout: 120000 },
  async () => {
    await withAtlasPage(async (page) => {
      await openRoute(page, { view: "coverage" });
      assert.equal(
        await page.locator("[data-coverage-project]").count(),
        atlas.nodes.length,
      );
      for (const id of ["coverage-programme", "coverage-missing"]) {
        const values = await page
          .locator("#" + id + " option")
          .evaluateAll(function coverageFilterValues(options) {
            return options.map(
              (option) => /** @type {HTMLOptionElement} */ (option).value,
            );
          });
        for (const value of values) {
          await page.locator("#" + id).selectOption(value);
          const rows = await page
            .locator("[data-coverage-project]")
            .evaluateAll((elements) =>
              elements.map((element) =>
                element.getAttribute("data-coverage-project"),
              ),
            );
          assert.equal(new Set(rows).size, rows.length);
          for (const row of rows)
            assert.ok(atlas.nodes.some((node) => node.id === row));
        }
        await page
          .getByRole("button", { name: "Clear filters", exact: true })
          .click();
      }
      await page.locator("#coverage-search").fill("NO_MATCH_7a2b86c1");
      assert.equal(await page.locator("[data-coverage-project]").count(), 0);
      await page.locator("#coverage-search").press("Enter");
      await page
        .getByRole("button", { name: "Clear filters", exact: true })
        .click();
      const downloading = page.waitForEvent("download");
      await page
        .getByRole("button", {
          name: "Export displayed rows (.csv)",
          exact: true,
        })
        .click();
      const download = await downloading,
        path = await download.path();
      assert.ok(path);
      const csv = await readFile(path, "utf8");
      assert.ok(csv.startsWith('\uFEFF"project_id","project_name"'));
      for (const node of atlas.nodes)
        assert.ok(csv.includes('"' + node.id.replaceAll('"', '""') + '"'));
    });
  },
);

test(
  "a damaged real artifact cannot pass the resource cache identity check",
  { timeout: 120000 },
  async () => {
    await withAtlasArtifact(
      async (directory) => {
        const path = join(directory, "index.html"),
          html = await readFile(path, "utf8");
        const changed = html.replace(
          /resource-coverage\.js\?v=[a-f0-9]{64}/g,
          "resource-coverage.js?v=" + "0".repeat(64),
        );
        assert.notEqual(changed, html);
        await writeFile(path, changed);
      },
      async (servedBase) => {
        await withAtlasPage(
          async (page) => {
            await assert.rejects(
              checkResourceCoverage(page, {
                baseUrl: servedBase,
                navigate: (url) => navigate(page, url),
                beforeNavigation: () => checkpoint(page),
              }),
              /Resource asset version differs from served bytes/,
            );
          },
          { servedBase },
        );
      },
    );
  },
);

test(
  "a missing captured source file is rejected through its real HTTP consumer",
  { timeout: 120000 },
  async () => {
    await withAtlasArtifact(
      async (directory) => {
        await rm(join(directory, "public_atlas_data.json"));
      },
      async (servedBase) => {
        await withAtlasPage(
          async (page) => {
            await assert.rejects(
              checkFundingStates(page, {
                baseUrl: servedBase,
                navigate: (url) => navigate(page, url),
              }),
              /actual atlas source is available/,
            );
          },
          { servedBase },
        );
      },
    );
  },
);

test(
  "broken cross-source ownership fails explicitly in the real reader",
  { timeout: 120000 },
  async () => {
    await withAtlasArtifact(
      async (directory) => {
        const path = join(directory, "index.html"),
          html = await readFile(path, "utf8");
        const changed = html.replace(
          /(<script id="atlas-data" type="application\/json">)([\s\S]*?)(<\/script>)/,
          (_whole, open, body, close) => {
            /** @type {import('../types/atlas.js').AtlasData} */
            const data = JSON.parse(body);
            data.groups = data.groups.filter(
              (row) => row.id !== "SCPN-REACTOR-SYSTEMS",
            );
            return (
              open + JSON.stringify(data).replaceAll("<", "\\u003c") + close
            );
          },
        );
        assert.notEqual(changed, html);
        await writeFile(path, changed);
      },
      async (servedBase) => {
        const expected =
          /A captured source references an unavailable atlas record/;
        await withAtlasPage(
          async (page) => {
            const rejected = page.waitForEvent("pageerror");
            await navigate(page, servedBase + "index.html");
            assert.match((await rejected).message, expected);
          },
          { servedBase, expectedErrors: expected },
        );
      },
    );
  },
);

test(
  "rendered text fingerprints cover every retained public route",
  { timeout: 600000 },
  async () => {
    /** @type {Map<string,Record<string,string>>} */
    const routes = new Map();
    /**
     * Retain each exact public address once, using the original before/after enumeration.
     * @param {Record<string,string>} params - Actual reader fragment.
     * @returns {void} Route order stays deterministic for comparison artifacts.
     */
    const add = (params) => {
      routes.set("#" + new URLSearchParams(params), params);
    };
    for (const view of [
      "overview",
      "map",
      "coverage",
      "documents",
      "compare",
      "technical",
      "technical-source",
      "support",
      "guides",
      "partners",
      "search",
      "resources",
      "history",
      "source-updates",
      "visuals",
      "unavailable",
    ])
      add({ view });
    for (const group of atlas.groups) {
      add({ group: group.id });
      add({ view: "map", group: group.id });
    }
    for (const node of atlas.nodes) {
      add({ project: node.id });
      add({ view: "support", entry: node.id });
      add({ view: "map", focus: node.id });
    }
    for (const project of library.projects)
      for (const doc of project.documents)
        add({
          view: "documents",
          entry: project.project_id,
          document: doc.label,
        });
    for (const guide of technical.guides)
      add({ view: "technical", entry: guide.project_id });
    for (const project of technical.library.projects)
      for (const doc of project.documents)
        add({
          view: "technical-source",
          entry: project.project_id,
          document: doc.label,
        });
    /** @type {{route:string,bytes:number,sha256:string}[]} Actual complete reading-surface fingerprints. */
    const observations = [];
    await withAtlasPage(async (page) => {
      for (const [route, params] of routes) {
        await openRoute(page, params);
        const text = await page.locator("#content").innerText();
        assert.ok(
          text.length > 0,
          "Each retained address has real reading content",
        );
        observations.push({
          route,
          bytes: Buffer.byteLength(text),
          sha256: createHash("sha256").update(text).digest("hex"),
        });
      }
    });
    assert.equal(observations.length, 1312);
    await mkdir("coverage/readback", { recursive: true });
    await writeFile(
      "coverage/readback/routes.json",
      JSON.stringify({ routes: observations }, null, 2) + "\n",
    );
  },
);

test(
  "actual atlas entries have no automated accessibility violations on desktop and phone",
  { timeout: 180000 },
  async () => {
    await withAtlasPage(async (page) => {
      for (const width of [1440, 390]) {
        await page.setViewportSize({ width, height: 1000 });
        for (const name of [
          "index.html",
          "resources.html",
          "budget.html",
          "atlas_full.html",
        ]) {
          await navigate(page, baseUrl + name);
          await page.locator("h1").waitFor();
          assert.equal(
            await page
              .locator('meta[name="tdm-reservation"]')
              .getAttribute("content"),
            "1",
          );
          const result = await new AxeBuilder({ page }).analyze();
          await mkdir("coverage/accessibility", { recursive: true });
          await writeFile(
            "coverage/accessibility/" + name + "-" + width + ".json",
            JSON.stringify(result, null, 2),
          );
          assert.deepEqual(
            result.violations.map((row) => ({
              id: row.id,
              count: row.nodes.length,
              targets: row.nodes.slice(0, 3).map((node) => node.target),
            })),
            [],
            name + " at " + width + " CSS pixels",
          );
        }
      }
    });
  },
);

test(
  "the resource helper CLI and exported browser consumer retain real download provenance",
  { timeout: 120000 },
  async () => {
    const directory = await mkdtemp(join(tmpdir(), "anulum-cli-export-"));
    try {
      const exported = spawnSync(
        process.execPath,
        ["tests/test_resource_explorer.mjs", "--browser-code"],
        { encoding: "utf8" },
      );
      assert.equal(exported.status, 0, exported.stderr);
      /** @type {typeof checkResourceExplorer} Public CLI's generated browser-journey interface. */
      const generated = new Script("(" + exported.stdout + ")", {
        filename: "anulum-exported-resource-journey.mjs",
      }).runInThisContext();
      assert.equal(typeof generated, "function");
      await withAtlasPage(async (page) => {
        const report = await generated(page, {
          baseUrl,
          downloadDirectory: directory,
          navigate: (url) => navigate(page, url),
          beforeNavigation: () => checkpoint(page),
        });
        const path = join(directory, "actual-download-report.json");
        await writeFile(path, JSON.stringify(report));
        const verified = spawnSync(
          process.execPath,
          ["tests/test_resource_explorer.mjs", "--verify", path],
          { encoding: "utf8" },
        );
        assert.equal(verified.status, 0, verified.stderr);
        assert.equal(JSON.parse(verified.stdout).downloads, 5);
      });
      const invalid = spawnSync(
        process.execPath,
        ["tests/test_resource_explorer.mjs", "--unsupported"],
        { encoding: "utf8" },
      );
      assert.notEqual(invalid.status, 0);
      assert.match(invalid.stderr, /Use --browser-code or --verify/);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  },
);

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
      await navigate(
        page,
        baseUrl + "atlas_full.html#project=absent-source-id",
      );
      assert.equal(await page.locator(".node.selected").count(), 0);
    });
  },
);
