// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — resource-explorer public behaviour contracts

import { withAtlasSourceVariant } from "./atlas-source-variant.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import { readFile, writeFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { Script } from "node:vm";
import {
  withAtlasPage,
  baseUrl,
  navigate,
  checkpoint,
  withAtlasArtifact,
} from "./atlas-runtime.mjs";
import checkResourceExplorer, {
  verifyDownloadedCsv,
} from "./test_resource_explorer.mjs";

test(
  "public DOM event boundary refuses an empty disabled CSV activation; not native pointer or AT proof",
  { timeout: 120000 },
  async () => {
    await withAtlasPage(async (page) => {
      await navigate(page, baseUrl + "resources.html");
      await page
        .locator("#group")
        .selectOption("SCIENTIFIC-DISCOVERY-AND-EXPERIMENTATION");
      assert.equal(await page.locator("#results article").count(), 0);
      const download = page.locator("#download-selection"),
        before = page.url();
      assert.equal(await download.isDisabled(), true);
      await Promise.all([
        assert.rejects(
          page.waitForEvent("download", { timeout: 250 }),
          /Timeout.*download/,
        ),
        download.dispatchEvent("click", { bubbles: true, cancelable: true }),
      ]);
      assert.equal(await page.locator("#results article").count(), 0);
      assert.equal(await download.isDisabled(), true);
      assert.equal(page.url(), before);
    });
  },
);

test(
  "the exported inventory consumer rejects owned HTTP failures while preserving foreign origin scope",
  { timeout: 120000 },
  async () => {
    const downloads = await mkdtemp(join(tmpdir(), "anulum-http-rejection-"));
    try {
      await withAtlasArtifact(
        async () => {},
        async (foreignBase) => {
          await withAtlasArtifact(
            async (directory) => {
              const path = join(directory, "resources.html"),
                html = await readFile(path, "utf8");
              await writeFile(
                path,
                html.replace(
                  "</body>",
                  '<img alt="" src="owned-missing-evidence.svg"><iframe title="Foreign HTTP failure" src="' +
                    foreignBase +
                    'foreign-missing-evidence.svg"></iframe></body>',
                ),
              );
            },
            async (servedBase) => {
              await withAtlasPage(
                async (page) => {
                  let foreignStatus = 0;
                  page.on("response", (response) => {
                    if (
                      response.url() ===
                      foreignBase + "foreign-missing-evidence.svg"
                    )
                      foreignStatus = response.status();
                  });
                  await assert.rejects(
                    checkResourceExplorer(page, {
                      baseUrl: servedBase.slice(0, -1),
                      downloadDirectory: downloads,
                      navigate: (url) => navigate(page, url),
                      beforeNavigation: () => checkpoint(page),
                    }),
                    (error) => {
                      assert.ok(error instanceof Error);
                      assert.ok(
                        error.message.includes(
                          servedBase + "owned-missing-evidence.svg",
                        ),
                      );
                      assert.ok(!error.message.includes(foreignBase));
                      return true;
                    },
                  );
                  assert.equal(foreignStatus, 404);
                },
                { servedBase },
              );
            },
          );
        },
      );
    } finally {
      await rm(downloads, { recursive: true, force: true });
    }
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
  "sparse inventory source cards retain unknown ownership and missing planning fields",
  { timeout: 120000 },
  async () => {
    let id = "",
      title = "";
    await withAtlasSourceVariant(
      ({ resources }) => {
        const estimate = resources.planning_estimates.find(
          (row) => row.kind === "people",
        );
        assert.ok(estimate);
        id = estimate.id;
        title = estimate.title;
        Reflect.deleteProperty(estimate, "values");
        estimate.group = "absent-source-owner";
        estimate.author = "";
      },
      async (servedBase) => {
        await withAtlasPage(
          async (page) => {
            await navigate(page, servedBase + "resources.html#view=people");
            const card = page.locator('[data-record-id="' + id + '"]');
            assert.equal(await card.locator("h3").textContent(), title);
            assert.ok((await card.innerText()).includes("absent-source-owner"));
            assert.ok((await card.innerText()).includes("Owning group"));
          },
          { servedBase },
        );
      },
    );
  },
);
