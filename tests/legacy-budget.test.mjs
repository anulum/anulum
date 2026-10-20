// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — legacy-budget public behaviour contracts

import { withAtlasSourceVariant } from "./atlas-source-variant.mjs";
import test from "node:test";
import assert from "node:assert/strict";
import {
  withAtlasPage,
  baseUrl,
  navigate,
  checkpoint,
} from "./atlas-runtime.mjs";
import { budget } from "./atlas-data.mjs";

test(
  "a shared resource candidate link selects its actual budget scenario without assigning funding",
  { timeout: 120000 },
  async () => {
    const resource = budget.shared.find(
      (row) => row.candidate_budget_lines.length,
    );
    assert.ok(resource);
    const line =
        resource.candidate_budget_lines[
          resource.candidate_budget_lines.length - 1
        ],
      scenario = budget.scenarios.find((row) => row.id === line.scenario_id);
    assert.ok(scenario);
    await withAtlasPage(async (page) => {
      await navigate(page, baseUrl + "budget.html");
      const card = page.locator("#shared > article").filter({
        has: page.getByRole("heading", { name: resource.name, exact: true }),
      });
      await card
        .getByText("Related needs and candidate budget lines", { exact: true })
        .click();
      await card
        .locator(
          'a[href="#scenario=' + encodeURIComponent(line.scenario_id) + '"]',
        )
        .first()
        .click();
      assert.equal(await page.locator("#scenario").inputValue(), scenario.id);
      assert.equal(await page.locator("#family").inputValue(), "Institute");
      assert.ok(
        (await page.locator("#scenario-view").innerText()).includes(
          scenario.state,
        ),
      );
      assert.ok((await card.innerText()).includes(resource.state));
      assert.equal(
        new URL(page.url()).hash,
        "#scenario=" + encodeURIComponent(scenario.id),
        "The candidate keeps its actual scenario identity in the shared link",
      );
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
        await checkpoint(page);
        await page.reload();
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
  "unpriced hardware inputs remain explicit source gaps and separate from scenario totals",
  { timeout: 120000 },
  async () => {
    let scenario = "",
      total = "",
      otherScenario = "";
    await withAtlasSourceVariant(
      ({ budget }) => {
        const row = budget.scenarios[0];
        scenario = row.id;
        total = row.total_eur;
        row.source_date = row.as_of;
        row.hardware_cash_eur = "Not supplied";
        const second = budget.scenarios[1];
        otherScenario = second.id;
        second.hardware_cash_eur = "Not supplied";
        second.hardware_allocated_eur = "";
        row.commissioning_note = row.limits;
        row.blocks[0].start = "Not supplied";
        row.blocks[0].end = "Not supplied";
        row.hardware_slices = [
          {
            item: budget.shared[0].name,
            purchase_month: "Not supplied",
            wp: "Not supplied",
            use_start: "Not supplied",
            use_end: "Not supplied",
            eligible_depreciation_EUR: "Not supplied",
          },
          {
            item: budget.shared[0].name,
            payment_month: "Not supplied",
            commissioned_month: "Not supplied",
            wp: "Not supplied",
            use_start: "Not supplied",
            use_end: "Not supplied",
            eligible_depreciation_EUR: "Not supplied",
          },
        ];
        budget.hardware_basis = [
          {
            item: "node",
            purchase_estimate_eur: "Not supplied",
            state: row.state,
            author: row.author,
            as_of: row.as_of,
          },
          {
            item: budget.shared[0].name,
            purchase_estimate_eur: "Not supplied",
            state: row.state,
            author: row.author,
            as_of: row.as_of,
          },
        ];
        budget.shared[0].related_needs = [];
        Reflect.deleteProperty(budget.shared[0], "owner_feedback");
        for (const key of [
          "dedicated_facilities",
          "external_user_services",
          "additional_shared_room_proposals",
          "partner_slots",
        ])
          Reflect.deleteProperty(budget, key);
        budget.external_user_service_scope = "";
      },
      async (servedBase) => {
        await withAtlasPage(
          async (page) => {
            await navigate(
              page,
              servedBase + "budget.html#" + new URLSearchParams({ scenario }),
            );
            const view = page.locator("#scenario-view");
            assert.match(
              await view.innerText(),
              /Purchase cash assumption: Not supplied/,
            );
            assert.match(
              await view.innerText(),
              /allocated to the project in this source case: Not supplied/,
            );
            assert.equal(await page.locator("#hardware .metric").count(), 2);
            await view
              .getByText("Staged hardware use", { exact: true })
              .click();
            assert.ok((await view.innerText()).includes("Not supplied"));
            assert.ok(!(await view.innerText()).includes("NaN"));
            const embedded = await page.locator("#budget-data").textContent();
            assert.ok(embedded);
            assert.ok(embedded.includes(total));
            await page.locator("#scenario").selectOption(otherScenario);
            assert.match(
              await view.innerText(),
              /allocated to the project in this source case: Not supplied/,
            );
            assert.ok(!(await view.innerText()).includes("NaN"));
          },
          { servedBase },
        );
      },
    );
  },
);

test(
  "an absent scenario population is an explicit empty selection",
  { timeout: 120000 },
  async () => {
    await withAtlasSourceVariant(
      ({ budget }) => {
        budget.scenarios = [];
      },
      async (servedBase) => {
        await withAtlasPage(
          async (page) => {
            await navigate(
              page,
              servedBase + "budget.html#scenario=absent-source-id",
            );
            assert.match(
              await page.locator("#scenario-view").innerText(),
              /No scenario is available/,
            );
            assert.equal(await page.locator("#scenario option").count(), 0);
          },
          { servedBase },
        );
      },
    );
  },
);
