// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — resource-coverage public behaviour contracts

import { withAtlasSourceVariant } from "./atlas-source-variant.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  withAtlasPage,
  baseUrl,
  navigate,
  checkpoint,
  withAtlasArtifact,
} from "./atlas-runtime.mjs";
import checkResourceCoverage from "./test_resource_coverage.mjs";

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
  "blank quantity fields increase the actual pending requirement count",
  { timeout: 120000 },
  async () => {
    let count = 0;
    await withAtlasSourceVariant(
      ({ resources }) => {
        resources.needs[0].quantity = "";
        const pending = new Set([
          "",
          "unknown; derivation pending",
          "not fixed",
          "not specified",
          "—",
        ]);
        count = resources.needs.filter((row) =>
          pending.has(row.quantity.trim().toLowerCase()),
        ).length;
      },
      async (servedBase) => {
        await withAtlasPage(
          async (page) => {
            await navigate(page, servedBase + "resources.html");
            assert.equal(
              await page
                .locator('[data-coverage-metric="pending-needs"] strong')
                .innerText(),
              String(count),
            );
          },
          { servedBase },
        );
      },
    );
  },
);
