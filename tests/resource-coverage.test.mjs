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
import { readFile, writeFile, unlink } from "node:fs/promises";
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
  "resource coverage keeps a real foreign HTTP failure outside its owned failure ledger",
  { timeout: 120000 },
  async () => {
    await withAtlasArtifact(
      async () => {},
      async (foreignBase) => {
        await withAtlasArtifact(
          async (directory) => {
            const path = join(directory, "index.html"),
              html = await readFile(path, "utf8");
            await writeFile(
              path,
              html.replace(
                "</body>",
                '<iframe title="External failure provenance" src="' +
                  foreignBase +
                  'foreign-unavailable.html"></iframe></body>',
              ),
            );
          },
          async (servedBase) => {
            await withAtlasPage(
              async (page) => {
                const foreign = page.waitForResponse(
                  (response) =>
                    response.url() === foreignBase + "foreign-unavailable.html",
                );
                const report = await checkResourceCoverage(page, {
                  baseUrl: servedBase,
                  navigate: (url) => navigate(page, url),
                  beforeNavigation: () => checkpoint(page),
                });
                assert.equal((await foreign).status(), 404);
                assert.deepEqual(report.httpFailures, []);
                assert.deepEqual(report.errors, []);
              },
              { servedBase },
            );
          },
        );
      },
    );
  },
);

test(
  "resource coverage rejects a declared stylesheet that the actual browser never requested",
  { timeout: 120000 },
  async () => {
    await withAtlasArtifact(
      async (directory) => {
        const path = join(directory, "index.html"),
          html = await readFile(path, "utf8");
        const changed = html.replace(
          /<link\b(?=[^>]*href="resource-coverage\.css\?v=[a-f0-9]{64}")/,
          "<link disabled",
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
              }),
              /Missing content-bound resource entrypoint/,
            );
          },
          { servedBase },
        );
      },
    );
  },
);

test(
  "resource coverage rejects an actual stylesheet disappearing after its initial successful request",
  { timeout: 120000 },
  async () => {
    let stylesheet = "";
    await withAtlasArtifact(
      async (directory) => {
        stylesheet = join(directory, "resource-coverage.css");
      },
      async (servedBase) => {
        await withAtlasPage(
          async (page) => {
            const missing = page.waitForResponse(
              (response) =>
                response
                  .url()
                  .startsWith(servedBase + "resource-coverage.css?") &&
                response.status() === 404,
            );
            await assert.rejects(
              checkResourceCoverage(page, {
                baseUrl: servedBase,
                navigate: async (url) => {
                  await navigate(page, url);
                  await unlink(stylesheet);
                },
              }),
              /Unavailable resource asset/,
            );
            assert.equal((await missing).status(), 404);
          },
          { servedBase },
        );
      },
    );
  },
);

test(
  "resource coverage refuses a blank actual source snapshot date",
  { timeout: 120000 },
  async () => {
    await withAtlasSourceVariant(
      ({ resources }) => {
        resources.as_of = "";
      },
      async (servedBase) => {
        await withAtlasPage(
          async (page) => {
            await assert.rejects(
              checkResourceCoverage(page, {
                baseUrl: servedBase,
                navigate: (url) => navigate(page, url),
              }),
              /Snapshot scope and source date/,
            );
          },
          { servedBase },
        );
      },
    );
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
