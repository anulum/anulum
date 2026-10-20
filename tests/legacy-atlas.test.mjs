// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — legacy-atlas public behaviour contracts

import test from "node:test";
import assert from "node:assert/strict";
import { withAtlasPage, baseUrl, navigate } from "./atlas-runtime.mjs";
import { atlas } from "./atlas-data.mjs";

test(
  "the complete technical atlas retains every source detail and its native controls",
  { timeout: 600000 },
  async () => {
    await withAtlasPage(async (page) => {
      await navigate(page, baseUrl + "atlas_full.html");
      await page.locator(".node").first().waitFor();
      assert.equal(await page.locator(".node").count(), atlas.nodes.length);
      for (const node of atlas.nodes) {
        await page.evaluate((id) => {
          location.hash = "#project=" + encodeURIComponent(id);
        }, node.id);
        await page.waitForFunction(
          (name) => document.querySelector("#detail h2")?.textContent === name,
          node.name,
        );
        assert.equal(
          await page.locator("#detail > .badge").innerText(),
          node.work_status,
        );
        assert.ok(
          (await page.locator("#detail").innerText()).includes(node.function),
        );
      }
      await page.locator("#list-tab").click();
      assert.equal(
        await page.locator("#inventory .inventory-card").count(),
        atlas.nodes.length,
      );
      const options = await page
        .locator("#group-filter option")
        .evaluateAll(function legacyProgrammeOptions(elements) {
          return elements.map(
            (element) => /** @type {HTMLOptionElement} */ (element).value,
          );
        });
      for (const group of options) {
        await page.locator("#group-filter").selectOption(group);
        assert.equal(
          await page.locator("#inventory .inventory-card").count(),
          atlas.nodes.filter((node) => !group || node.group === group).length,
        );
      }
      await page.locator("#group-filter").selectOption("");
      await page.locator("#inventory .inventory-card").first().click();
      await page.locator("#map-tab").click();
      await page.locator("#search").fill("SC-NEUROCORE");
      assert.ok((await page.locator("#results button").count()) > 0);
      await page.locator("#results button").first().click();
      await page.locator("#search").fill("NO_MATCH_7a2b86c1");
      assert.match(
        await page.locator("#results").innerText(),
        /No matching entry/,
      );
      await page.keyboard.press("Escape");
      assert.equal(await page.locator("#results").isVisible(), false);
      await page.locator("#search").fill("");
      for (const mode of ["none", "all", "selected"]) {
        await page.locator("#edge-mode").selectOption(mode);
        await page.locator("#show-proposals").check();
        await page.locator("#show-proposals").uncheck();
        if (mode === "none")
          assert.equal(await page.locator("#edges > *").count(), 0);
      }
      await page.locator("#fit").click();
      const original = await page.locator("#atlas-svg").getAttribute("viewBox");
      await page.locator("#zoom-in").click();
      assert.notEqual(
        await page.locator("#atlas-svg").getAttribute("viewBox"),
        original,
      );
      await page.locator("#zoom-out").click();
      await page.locator("#fit").click();
      assert.equal(
        await page.locator("#atlas-svg").getAttribute("viewBox"),
        original,
      );
      const canvas = page.locator("#canvas"),
        box = await canvas.boundingBox();
      assert.ok(box);
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.wheel(0, -120);
      await page.mouse.wheel(0, 120);
      await page.mouse.down();
      await page.mouse.move(
        box.x + box.width / 2 + 50,
        box.y + box.height / 2 + 35,
      );
      await page.mouse.up();
      await page.locator(".node").first().focus();
      await page.keyboard.press("Enter");
      await page.keyboard.press("Space");
      assert.equal(await page.locator(".node.selected").count(), 1);
      await navigate(
        page,
        baseUrl + "atlas_full.html#group=" + encodeURIComponent(options[1]),
      );
      assert.equal(
        await page.locator("#group-filter").inputValue(),
        options[1],
      );
      const retainedSelection = await page
        .locator(".node.selected")
        .getAttribute("data-id");
      await navigate(
        page,
        baseUrl + "atlas_full.html#project=absent-source-id",
      );
      assert.equal(await page.locator(".node.selected").count(), 1);
      assert.equal(
        await page.locator(".node.selected").getAttribute("data-id"),
        retainedSelection,
      );
    });
  },
);
