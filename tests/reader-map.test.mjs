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

test(
  "native wheel gestures enter a source group and return to the programme overview",
  { timeout: 120000 },
  async () => {
    await withAtlasPage(async (page) => {
      await openRoute(page, { view: "map" });
      const viewport = page.locator("#semantic-canvas"),
        svg = viewport.locator("svg"),
        first = page
          .locator(".map-entry")
          .nth(Math.floor(atlas.groups.length / 2)),
        target = await first.getAttribute("data-target");
      assert.ok(target);
      const initialUrl = page.url(),
        initialView = await svg.getAttribute("viewBox");
      await first.click({ button: "middle" });
      assert.equal(page.url(), initialUrl);
      assert.equal(await svg.getAttribute("viewBox"), initialView);
      await page.locator("#map-project-search").fill("SC-NEUROCORE");
      assert.ok((await page.locator(".map-search-result").count()) > 0);
      await page.locator("#map-project-search").fill("");
      assert.equal(await page.locator(".map-search-result").count(), 0);
      assert.match(
        await page.locator('.map-lookup [aria-live="polite"]').innerText(),
        /Enter a term to locate a source entry/,
      );
      for (let step = 0; step < 3; step++)
        await page.getByRole("button", { name: "＋", exact: true }).click();
      await first.hover();
      await page.mouse.wheel(0, -120);
      await page.waitForURL((url) => url.hash === target);
      await page.locator(".map-entry").first().waitFor();
      assert.ok((await page.locator(".map-entry").count()) > 0);
      for (let step = 0; step < 3; step++)
        await page.getByRole("button", { name: "−", exact: true }).click();
      await viewport.hover({ position: { x: 5, y: 5 } });
      await page.mouse.wheel(0, 120);
      await page.waitForURL((url) => url.href === initialUrl);
      assert.equal(
        await page.locator(".map-entry").count(),
        atlas.groups.length,
      );
      await page.locator("#map-programme").selectOption(atlas.groups[0].id);
      await page.waitForURL((url) => url.hash.includes("group="));
      await page.locator("#map-programme").selectOption("");
      await page.waitForURL((url) => url.href === initialUrl);
      await first.click();
      await page.waitForURL((url) => url.hash === target);
      assert.ok((await page.locator(".map-entry").count()) > 0);
    });
  },
);
