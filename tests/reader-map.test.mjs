// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — reader-map public behaviour contracts

import test from "node:test";
import assert from "node:assert/strict";
import { withAtlasPage, openRoute } from "./atlas-runtime.mjs";
import { atlas } from "./atlas-data.mjs";

test(
  "native map controls preserve navigation, layer scope and camera behaviour",
  { timeout: 120000 },
  async () => {
    await withAtlasPage(async (page) => {
      await openRoute(page, { view: "map" });
      assert.equal(
        await page.locator(".map-entry").count(),
        atlas.groups.length,
      );
      const viewport = page.locator("#semantic-canvas"),
        svg = viewport.locator("svg");
      const original = await svg.getAttribute("viewBox");
      await page.getByRole("button", { name: "＋", exact: true }).click();
      assert.notEqual(await svg.getAttribute("viewBox"), original);
      await page.getByRole("button", { name: "−", exact: true }).click();
      await page
        .getByRole("button", { name: "Reset view", exact: true })
        .click();
      assert.equal(await svg.getAttribute("viewBox"), original);
      await page.locator("#map-show-relations").check();
      assert.ok((await page.locator(".map-edge-buttons button").count()) > 0);
      await page.locator(".map-edge-buttons button").first().click();
      assert.equal(
        await page.locator(".map-relation-explanation").isVisible(),
        true,
      );
      await page.locator(".map-relation-explanation summary").first().click();
      await page.locator("#map-show-proposals").check();
      assert.ok((await page.locator(".map-edge-buttons button").count()) > 0);
      await page.locator("#map-show-proposals").uncheck();
      await page.locator("#map-show-relations").uncheck();
      assert.equal(await page.locator(".map-edge-buttons button").count(), 0);
      const box = await viewport.boundingBox();
      assert.ok(box);
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(
        box.x + box.width / 2 + 60,
        box.y + box.height / 2 + 35,
      );
      await page.mouse.up();
      assert.notEqual(await svg.getAttribute("viewBox"), original);
      await page.mouse.wheel(0, -120);
      await page.mouse.wheel(0, 120);
      await page
        .getByRole("button", { name: "Reset view", exact: true })
        .click();
      await page.locator("#map-project-search").fill("NO_MATCH_7a2b86c1");
      assert.equal(await page.locator(".map-search-result").count(), 0);
      await page.locator("#map-project-search").fill("SC-NEUROCORE");
      await page.locator(".map-search-result").first().click();
      await page.locator(".map-focused-project h2").waitFor();
      const node = atlas.nodes.find((row) => row.id === "SC-NEUROCORE");
      assert.ok(node);
      assert.equal(
        await page.locator(".map-focused-project h2").innerText(),
        node.name,
      );
      for (const width of [390, 800, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        assert.ok((await page.locator(".map-entry").count()) > 0);
      }
      await page.locator("#map-programme").selectOption("");
      await page.waitForURL((url) => !url.hash.includes("focus="));
      const first = page.locator(".map-entry").first();
      const target = await first.getAttribute("data-target");
      assert.ok(target);
      await first.focus();
      await page.keyboard.press("Enter");
      await page.waitForURL((url) => url.hash === target);
      assert.ok((await page.locator(".map-entry").count()) > 0);
    });
  },
);
