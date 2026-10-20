// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — reader-app public behaviour contracts

import test from "node:test";
import assert from "node:assert/strict";
import { writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { withAtlasPage, openRoute } from "./atlas-runtime.mjs";
import { atlas, library, technical } from "./atlas-data.mjs";

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
