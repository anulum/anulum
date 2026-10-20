// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — reader-resources public behaviour contracts

import { withAtlasSourceVariant } from "./atlas-source-variant.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import { withAtlasPage, openRoute } from "./atlas-runtime.mjs";
import { budget } from "./atlas-data.mjs";

test(
  "shared resource cards retain quantities and reciprocal target links",
  { timeout: 600000 },
  async () => {
    await withAtlasPage(async (page) => {
      await openRoute(page, { view: "resources" });
      assert.equal(
        await page.locator(".shared-card").count(),
        budget.shared.length,
      );
      for (const shared of budget.shared) {
        const card = page.locator(".shared-card").filter({
          has: page.getByRole("heading", { name: shared.name, exact: true }),
        });
        assert.equal(await card.getAttribute("id"), "resource-" + shared.id);
        assert.ok((await card.innerText()).includes(shared.quantity));
        await openRoute(page, { view: "resources", resource: shared.id });
        assert.equal(
          await page.locator(".shared-card.highlight").getAttribute("id"),
          "resource-" + shared.id,
        );
      }
      await openRoute(page, { view: "resources" });
      for (const scenario of budget.scenarios) {
        await page.locator("#shared-scenario").selectOption(scenario.id);
        for (const shared of budget.shared) {
          const card = page.locator(".shared-card").filter({
            has: page.getByRole("heading", {
              name: shared.name,
              exact: true,
            }),
          });
          const expected = shared.candidate_budget_lines.filter(
            (row) => row.scenario_id === scenario.id,
          );
          const text = await card.innerText();
          for (const line of expected) assert.ok(text.includes(line.line));
          if (!expected.length)
            assert.ok(text.includes("No budget association is supplied"));
        }
      }
      await page.locator("#shared-scenario").selectOption("");
      await openRoute(page, {
        view: "resources",
        resource: "absent-source-id",
      });
      assert.equal(await page.locator(".shared-card.highlight").count(), 0);
    });
  },
);

test(
  "incomplete shared-resource records expose gaps without inventing joins",
  { timeout: 120000 },
  async () => {
    await withAtlasSourceVariant(
      ({ budget }) => {
        Reflect.deleteProperty(budget.shared[0], "related_needs");
        Reflect.deleteProperty(budget.shared[0], "owner_feedback");
        Reflect.deleteProperty(budget.shared[0], "candidate_budget_lines");
        const second = budget.shared[1];
        for (const panel of second.owner_feedback) {
          panel.project_scope = "";
          panel.first_expected_output = "";
          panel.acceptance_criterion = "";
          panel.quantity_basis = "";
          panel.dedication_access = "";
          panel.timing = "";
        }
        second.related_needs[0].id = "absent-source-need";
        Reflect.deleteProperty(second.related_needs[0], "project_ids");
        second.candidate_budget_lines[0].scenario_id = "absent-source-scenario";
        budget.dedicated_facilities[0].basis = "";
      },
      async (servedBase) => {
        await withAtlasPage(
          async (page) => {
            await openRoute(page, { view: "resources" });
            const text = await page.locator("#content").innerText();
            assert.match(text, /No direct requirement association supplied/);
            assert.match(text, /absent-source-scenario/);
            assert.match(
              text,
              /Dedicated resource scope; quantities and timing remain to be established/,
            );
            assert.equal(
              await page.locator(".shared-card").count(),
              budget.shared.length,
            );
          },
          { servedBase },
        );
      },
    );
  },
);
