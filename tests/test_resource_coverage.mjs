// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Resource coverage through real map and inventory routes

/**
 * @typedef {{groups: {group:string,view:string,count:number}[],
 * mobile:{name:string,viewport:number,client:number,scroll:number}[],
 * pendingNeeds:number,errors:string[],httpFailures:string[]}} CoverageReport
 */

/**
 * Compare the coverage display with actual inventory navigation and rendered source records.
 * @param {import('playwright').Page} page Real Playwright Page in a fresh caller-owned context.
 * @param {{baseUrl: string, navigate?: (url:string)=>Promise<unknown>, beforeNavigation?:()=>Promise<void>}} options Local atlas URL.
 * @returns {Promise<CoverageReport>} Actual route, group, pending-field and mobile observations.
 */
export default async function checkResourceCoverage(
  page,
  {
    baseUrl,
    navigate: visit = (url) => page.goto(url),
    beforeNavigation = async () => {},
  },
) {
  const base = baseUrl.replace(/\/$/, "") + "/";
  /**
   * Verify the actual requested ESM/CSS bytes and their declared content versions.
   * @returns {Promise<number>} Number of independently checked requested assets.
   */
  async function checkAssetVersions() {
    return page.evaluate(async () => {
      const entry = location.pathname.endsWith("/resources.html")
        ? "resource-explorer.js"
        : "reader-resources.js";
      const required = ["resource-coverage.js", "resource-coverage.css", entry];
      const requested = new Set(
        performance
          .getEntriesByType("resource")
          .map((resource) => resource.name),
      );
      const map = /** @type {HTMLScriptElement} */ (
        document.querySelector('script[type="importmap"]')
      );
      /** @type {{imports: Record<string,string>}} */
      // A script element's textContent is a string, including the empty string.
      const declarations = JSON.parse(/** @type {string} */ (map.textContent));
      for (const name of required) {
        const target = name.endsWith(".css")
          ? /** @type {HTMLLinkElement} */ (
              document.querySelector('link[href^="' + name + '"]')
            ).href
          : new URL(
              declarations.imports["@atlas/" + name.slice(0, -3)],
              location.href,
            ).href;
        if (!requested.has(target))
          throw new Error("Missing content-bound resource entrypoint");
        const response = await fetch(target, { cache: "no-store" });
        if (!response.ok) throw new Error("Unavailable resource asset");
        const digest = await crypto.subtle.digest(
          "SHA-256",
          await response.arrayBuffer(),
        );
        const hex = [...new Uint8Array(digest)]
          .map((byte) => byte.toString(16).padStart(2, "0"))
          .join("");
        if (new URL(target).searchParams.get("v") !== hex)
          throw new Error("Resource asset version differs from served bytes");
      }
      return required.length;
    });
  }

  /**
   * @param {unknown} ok - Public route invariant.
   * @param {string} message - Exact behaviour that a counterexample violates.
   * @returns {void} Reject a failing public observation.
   */
  const check = (ok, message) => {
    if (!ok) throw new Error(message);
  };
  /** @type {string[]} */
  const errors = [];
  /** @type {string[]} */
  const httpFailures = [];
  /** @type {CoverageReport} */
  const report = {
    groups: [],
    mobile: [],
    pendingNeeds: 0,
    errors,
    httpFailures,
  };
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.url().startsWith(base) && response.status() >= 400)
      httpFailures.push(response.url());
  });
  await visit(base + "index.html#view=resources");
  const coverage = page.getByRole("region", {
    name: "Resource inventory coverage and open quantities",
  });
  await coverage.waitFor();
  await checkAssetVersions();
  /** @type {import('../types/atlas.js').ResourceData} */
  const data = await page.locator("#resource-data").evaluate((node) =>
    JSON.parse(/** @type {string} */ (node.textContent)),
  );
  const mainText = await coverage.innerText();
  check(
    mainText.includes("before filters") &&
      mainText.includes("Source snapshot: 2026-10-13"),
    "Snapshot scope and source date",
  );
  const missing = data.groups.filter(
    (group) => !data.needs.some((row) => row.group === group.id),
  );
  if (missing.length) {
    check(
      mainText.includes("does not mean that the group has no resource needs") &&
        missing.every((group) => mainText.includes(group.name)),
      "Missing source is not zero need",
    );
  } else {
    check(
      (await coverage.locator(".coverage-gap").count()) === 0,
      "Complete source population has no stale missing-group notice",
    );
  }
  check(
    mainText.includes("not equipment counts, hires, floor-area totals"),
    "No additive procurement or institute totals",
  );
  await coverage.locator("summary").click();
  const discovery = coverage.locator(
    '[data-coverage-group="SCIENTIFIC-DISCOVERY-AND-EXPERIMENTATION"]',
  );
  await discovery.waitFor();
  await beforeNavigation();
  await discovery.getByRole("link", { name: "Needs", exact: true }).click();
  await page.waitForURL((url) => url.pathname.endsWith("/resources.html"));
  await page.locator("#counter").filter({ hasText: "matching" }).waitFor();
  await checkAssetVersions();
  const discoveryNeeds = data.needs.filter(
    (row) => row.group === "SCIENTIFIC-DISCOVERY-AND-EXPERIMENTATION",
  );
  check(
    (await page.locator("#results article").count()) === discoveryNeeds.length,
    "Actual source-bound Discovery population",
  );
  check(
    (await page.locator("#download-selection").isDisabled()) ===
      (discoveryNeeds.length === 0),
    "Download availability follows actual source rows",
  );
  const explorer = page.getByRole("region", {
    name: "Resource inventory coverage and open quantities",
  });
  check(
    (await explorer.innerText()) === mainText,
    "Same full-population coverage on map and filtered explorer",
  );
  await explorer.locator("summary").click();
  for (const group of data.groups) {
    const row = explorer.locator('[data-coverage-group="' + group.id + '"]');
    const label = await row.innerText();
    await page.locator("#group").selectOption(group.id);
    for (const [view, noun] of [
      ["needs", "needs"],
      ["candidates", "acquisition alternatives"],
    ]) {
      await page.locator("#" + view + "-tab").click();
      const count = await page.locator("#results article").count();
      check(
        label.includes(count + " " + noun),
        "Coverage matches actual selected " + group.id + "/" + view,
      );
      report.groups.push({ group: group.id, view, count });
    }
  }
  await page.locator("#reset-selection").click();
  await page.locator("#needs-tab").click();
  const unresolved = await page
    .locator("#results article")
    .filter({ hasText: "Unknown; derivation pending" })
    .count();
  check(
    (await explorer
      .locator('[data-coverage-metric="pending-needs"] strong')
      .innerText()) === String(unresolved),
    "Pending count matches actual displayed source fields",
  );
  await page.locator("#candidates-tab").click();
  await page
    .locator("#group")
    .selectOption("SCPN-SYSTEMS-INTEGRATION-AND-CONTROL");
  await page.locator("#verification").selectOption("independent");
  await page.locator("#search").fill("SSAT");
  check(
    (await page.locator("#results article").count()) === 1,
    "Existing filtered acquisition search retained",
  );
  check(
    (await explorer.innerText()).includes(
      data.candidates.length + " acquisition alternatives",
    ),
    "Portfolio coverage survives selection filters",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  for (const [name, route] of [
    ["map", "index.html#view=resources"],
    ["inventory", "resources.html"],
  ]) {
    await visit(base + route);
    const panel = page.getByRole("region", {
      name: "Resource inventory coverage and open quantities",
    });
    await panel.waitFor();
    await panel.locator("summary").click();
    const size = await page.evaluate(() => ({
      viewport: innerWidth,
      client: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    check(
      size.viewport === 390 && size.scroll <= size.client,
      "Mobile overflow " + name,
    );
    check(
      (await panel.locator("a").count()) === data.groups.length * 4,
      "Every group and view remains linked",
    );
    report.mobile.push({ name, ...size });
  }
  check(
    !errors.length && !httpFailures.length,
    "Page errors or failed assets: " + JSON.stringify({ errors, httpFailures }),
  );
  report.pendingNeeds = unresolved;
  report.errors = errors;
  report.httpFailures = httpFailures;
  return report;
}
