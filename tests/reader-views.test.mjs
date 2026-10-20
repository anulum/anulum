// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — reader-views public behaviour contracts

import test from "node:test";
import assert from "node:assert/strict";
import { withAtlasPage, openRoute } from "./atlas-runtime.mjs";
import { atlas } from "./atlas-data.mjs";
import { withAtlasSourceVariant } from "./atlas-source-variant.mjs";

test(
  "guided reading skips an unavailable source identity and retains remaining steps without invented outputs",
  { timeout: 120000 },
  async () => {
    await withAtlasSourceVariant(
      ({ atlas }) => {
        const omitted = atlas.nodes.find(
          (node) => node.id === "SCPN-TOKAMAK-CORE",
        );
        assert.ok(omitted);
        atlas.nodes = atlas.nodes.filter((node) => node.id !== omitted.id);
        const node = atlas.nodes.find(
          (row) => row.id === "SCPN-REACTOR-KERNELS",
        );
        assert.ok(node);
        Reflect.deleteProperty(node, "dossier");
      },
      async (servedBase) => {
        await withAtlasPage(
          async (page) => {
            await openRoute(page, { view: "guides" });
            const sequence = page.locator("#guide-reactor");
            assert.equal(
              await sequence.locator(".guide-steps > li").count(),
              3,
            );
            assert.equal(
              await sequence.locator('a[href*="SCPN-TOKAMAK-CORE"]').count(),
              0,
            );
            assert.ok(
              (await sequence.innerText()).includes(
                "Detailed output and acceptance specifications are being completed.",
              ),
            );
            await sequence
              .getByRole("link", { name: "SCPN-REACTOR-KERNELS", exact: true })
              .click();
            await page.getByRole("tab").first().waitFor();
            assert.equal(
              await page.locator("#content h1").textContent(),
              "SCPN-REACTOR-KERNELS",
            );
          },
          { servedBase },
        );
      },
    );
  },
);

test(
  "programme pages retain all source members",
  { timeout: 600000 },
  async () => {
    await withAtlasPage(async (page) => {
      for (const group of atlas.groups) {
        await openRoute(page, { group: group.id });
        assert.equal(
          await page.locator(".project-card").count(),
          atlas.nodes.filter((node) => node.group === group.id).length,
        );
      }
    });
  },
);

test(
  "search filters preserve the complete source population when cleared",
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
    });
  },
);
