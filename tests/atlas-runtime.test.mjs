// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Browser coverage origin provenance

import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  baseUrl,
  navigate,
  withAtlasArtifact,
  withAtlasPage,
} from "./atlas-runtime.mjs";

test(
  "a foreign HTTP script executes but cannot become trusted local source coverage",
  { timeout: 120000 },
  async () => {
    await mkdir("coverage/browser", { recursive: true });
    await mkdir("coverage/browser-raw", { recursive: true });
    const beforeRaw = new Set(await readdir("coverage/browser-raw")),
      beforeBound = new Set(await readdir("coverage/browser"));
    let foreignUrl = "";
    await withAtlasArtifact(
      async () => {},
      async (foreignBase) => {
        foreignUrl = foreignBase + "legacy-budget.js";
        assert.notEqual(new URL(foreignUrl).origin, new URL(baseUrl).origin);
        await withAtlasPage(async (page) => {
          await navigate(page, baseUrl + "budget.html");
          const scenarios = await page.locator("#scenario option").count();
          assert.ok(scenarios > 0);
          const shared = await page.locator("#shared > article").count();
          assert.ok(shared > 0);
          const response = page.waitForResponse(foreignUrl);
          await page.addScriptTag({ url: foreignUrl });
          assert.equal((await response).status(), 200);
          assert.equal(
            await page.locator("#scenario option").count(),
            scenarios,
            "The real selector still retains the captured scenario population",
          );
          assert.equal(
            await page.locator("#shared > article").count(),
            shared * 2,
            "Both actual source executions appended their captured shared-resource cards",
          );
          assert.ok(await page.locator("#scenario-view").innerText());
        });
      },
    );
    /** @type {Set<string>} Actual foreign V8 script identities. */
    const foreignIds = new Set();
    for (const name of await readdir("coverage/browser-raw")) {
      if (beforeRaw.has(name)) continue;
      /** @type {{url:string,scriptId:string,source:string}[]} */
      const entries = JSON.parse(
        await readFile("coverage/browser-raw/" + name, "utf8"),
      );
      for (const entry of entries) {
        if (entry.url !== foreignUrl) continue;
        foreignIds.add(entry.scriptId);
        assert.equal(
          entry.source,
          await readFile("docs/atlas/legacy-budget.js", "utf8"),
          "Foreign origin served the complete actual source bytes",
        );
      }
    }
    assert.equal(
      foreignIds.size,
      1,
      "Raw V8 evidence retains the foreign script",
    );
    let ownedBudget = 0;
    for (const name of await readdir("coverage/browser")) {
      if (beforeBound.has(name)) continue;
      /** @type {{result:{url:string,scriptId:string}[]}} */
      const capture = JSON.parse(
        await readFile("coverage/browser/" + name, "utf8"),
      );
      for (const entry of capture.result) {
        assert.equal(
          foreignIds.has(entry.scriptId),
          false,
          "A foreign execution cannot be relabelled as an owned file",
        );
        if (
          entry.url ===
          pathToFileURL(resolve("docs/atlas/legacy-budget.js")).href
        )
          ownedBudget++;
      }
    }
    assert.equal(ownedBudget, 1, "The actual canonical execution is retained");
  },
);
