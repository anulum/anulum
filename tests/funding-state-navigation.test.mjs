// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — funding-state-navigation public behaviour contracts

import test from "node:test";
import assert from "node:assert/strict";
import { rm } from "node:fs/promises";
import { join } from "node:path";
import {
  withAtlasPage,
  baseUrl,
  navigate,
  withAtlasArtifact,
} from "./atlas-runtime.mjs";
import { atlas } from "./atlas-data.mjs";
import checkFundingStates from "./test_funding_states.mjs";

/** Funding state navigation contract: captured states remain distinct through search, passport, brief and both map readers. */
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
