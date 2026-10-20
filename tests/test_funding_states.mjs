// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Funding states through public reading and map routes

import assert from "node:assert/strict";

/**
 * @typedef {Pick<import('../types/atlas.js').AtlasNode, 'id'|'name'|'kind'|'phase'|'work_status'|'group'>} FundingRecord
 * @typedef {{records:{id:string,state:string,phase:string}[],map:string|null,legacy:string|null,mapEntries:{id:string,state:string}[]}} FundingReport
 */

/**
 * Check that funding records retain their distinct states throughout the actual reader.
 * @param {import('playwright').Page} page Real page in a caller-owned browser context.
 * @param {{baseUrl: string, navigate?: (url:string)=>Promise<unknown>}} options URL of the complete supplied atlas.
 * @returns {Promise<FundingReport>} Observed states and actual reader routes.
 */
export default async function checkFundingStates(
  page,
  { baseUrl, navigate: visit = (url) => page.goto(url) },
) {
  const base = baseUrl.replace(/\/$/, "") + "/";
  const response = await page.request.get(base + "public_atlas_data.json");
  assert.equal(response.ok(), true, "The actual atlas source is available");
  /** @type {{nodes: FundingRecord[]}} */
  const data = await response.json();
  const records = data.nodes.filter(
    (node) =>
      node.kind === "funding route" || node.name === "Company / funding/",
  );
  assert.equal(
    records.length,
    14,
    "Thirteen distinct routes and one workstream are supplied",
  );
  /** @type {string[]} */
  const errors = [];
  /** @type {FundingReport} */
  const report = { records: [], map: null, legacy: null, mapEntries: [] };
  page.on("pageerror", (error) => errors.push(error.message));
  const main = base + "index.html?funding-state-check=1";
  for (const node of records) {
    await visit(
      main + "#" + new URLSearchParams({ view: "search", q: node.id }),
    );
    const card = page.locator("#content .project-card").filter({
      has: page.getByRole("link", { name: node.name, exact: true }),
    });
    await card.waitFor();
    assert.equal(
      await card.locator(".badge").innerText(),
      node.work_status,
      node.name + " search state",
    );
    await card.getByRole("link", { name: node.name, exact: true }).click();
    await page
      .getByRole("heading", { name: node.name, level: 1, exact: true })
      .waitFor();
    assert.equal(
      await page.locator(".passport-heading .badge").innerText(),
      node.work_status,
      node.name + " passport state",
    );
    assert.ok(
      (await page.locator(".passport-heading").innerText()).includes(
        node.phase,
      ),
      node.name + " application phase",
    );
    await visit(
      main + "#" + new URLSearchParams({ view: "support", entry: node.id }),
    );
    const brief = page.locator(".support-brief");
    await brief
      .getByRole("heading", { name: node.name, level: 1, exact: true })
      .waitFor();
    assert.equal(
      await brief.locator(":scope > .badge").innerText(),
      node.work_status,
      node.name + " brief state",
    );
    report.records.push({
      id: node.id,
      state: node.work_status,
      phase: node.phase,
    });
  }
  const identified = records.find((node) => node.work_status === "Identified");
  assert.ok(identified, "The source contains an actual unstarted opportunity");
  await visit(
    main + "#" + new URLSearchParams({ view: "map", focus: identified.id }),
  );
  const focused = page.locator(".map-focused-project");
  await focused
    .getByRole("heading", { name: identified.name, exact: true })
    .waitFor();
  assert.equal(
    await focused.locator(".badge").innerText(),
    "Identified",
    "Focused map state",
  );
  const tiles = await page.locator(".map-entry").evaluateAll((entries) =>
    entries.map((entry) => ({
      id: entry.getAttribute("data-entry"),
      // Element.textContent is a string, including the empty string.
      text: /** @type {string} */ (entry.textContent),
    })),
  );
  assert.ok(
    tiles.some((tile) => tile.id === identified.id),
    "The focused opportunity has an actual map tile",
  );
  for (const tile of tiles) {
    const source = data.nodes.find((record) => record.id === tile.id);
    assert.ok(
      source,
      "Every displayed project tile retains an actual source identity",
    );
    assert.ok(
      tile.text.includes(source.kind + " · " + source.work_status),
      source.name + " map tile state",
    );
    report.mapEntries.push({ id: source.id, state: source.work_status });
  }
  report.map = identified.id;
  await visit(
    base +
      "atlas_full.html?funding-state-check=1#" +
      new URLSearchParams({ project: identified.id }),
  );
  const detail = page.locator("#detail");
  await detail
    .getByRole("heading", { name: identified.name, exact: true })
    .waitFor();
  assert.equal(
    await detail.locator(":scope > .badge").innerText(),
    "Identified",
    "Complete atlas detail state",
  );
  await page.locator("#list-tab").click();
  const legacyRow = page
    .locator("#inventory .inventory-card")
    .filter({ hasText: identified.name });
  assert.ok(
    (await legacyRow.locator("small").innerText()).startsWith("Identified · "),
    "Complete atlas inventory state",
  );
  report.legacy = identified.id;
  assert.deepEqual(errors, [], "No reader exceptions on the funding journeys");
  return report;
}
