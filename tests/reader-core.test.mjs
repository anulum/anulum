// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — reader-core public behaviour contracts

import test from "node:test";
import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  withAtlasPage,
  navigate,
  withAtlasArtifact,
} from "./atlas-runtime.mjs";

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
