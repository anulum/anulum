// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Resource explorer real-browser and download checks

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

/**
 * @typedef {{tag:string,filename:string,path:string,rows:number,ids:string[],url:string}} DownloadObservation
 * @typedef {{expectedCounts:{needs:number,candidates:number,people:number,spaces:number},
 * downloads:DownloadObservation[],selectedUrl:string,backForward:boolean,legacyGroupLink:boolean,
 * emptySelectionDisabled:boolean,activeTabHistoryStable:boolean,
 * responsive:{width:number,overflow:boolean}[],errors:string[],
 * httpFailures:{url:string,status:number}[],scope:string}} ExplorerReport
 */

/**
 * Exercise the served atlas with a real Playwright Page and a caller-owned download directory.
 * No vendor pages are opened; acquisition records retain their original source scope.
 * @param {import('playwright').Page} page Playwright Page supplied by the browser runner.
 * @param {{baseUrl: string, downloadDirectory: string, navigate?: (url:string)=>Promise<unknown>, beforeNavigation?:()=>Promise<void>}} options Local URL and caller-owned download directory.
 * @returns {Promise<ExplorerReport>} Observed source counts, downloaded rows and navigation outcomes.
 */
export default async function checkResourceExplorer(
  page,
  {
    baseUrl,
    downloadDirectory,
    navigate: visit = (url) => page.goto(url),
    beforeNavigation = async () => {},
  },
) {
  /**
   * Compare JSON-source observations without relying on private reader functions.
   * @param {unknown} actual - Observed public result.
   * @param {unknown} expected - Independent source-derived expectation.
   * @param {string} [message] - Violated public contract.
   * @returns {void} Reject mismatching observations.
   */
  function equal(actual, expected, message = "Browser assertion failed") {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(message + ": " + JSON.stringify({ actual, expected }));
    }
  }
  const base = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";
  /** @type {string[]} */
  const errors = [];
  /** @type {{url:string,status:number}[]} */
  const httpFailures = [];
  /** @type {DownloadObservation[]} */
  const downloads = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  page.on("response", (response) => {
    if (response.url().startsWith(base) && response.status() >= 400) {
      httpFailures.push({ url: response.url(), status: response.status() });
    }
  });
  await visit(base + "resources.html");
  await page.locator("#counter").filter({ hasText: "matching" }).waitFor();
  /** @type {import('../types/atlas.js').ResourceData} */
  const data = await page
    .locator("#resource-data")
    .evaluate((node) => JSON.parse(node.textContent || ""));
  const browserHistoryLength = () => history.length;
  const browserLocationHref = () => location.href;
  const initialHistoryLength = await page.evaluate(browserHistoryLength);
  await page.locator("#needs-tab").click();
  equal(
    await page.evaluate(browserHistoryLength),
    initialHistoryLength,
    "Active tab must not duplicate history",
  );

  const expectedCounts = {
    needs: data.needs.length,
    candidates: data.candidates.length,
    people: data.planning_estimates.filter((row) => row.kind === "people")
      .length,
    spaces: data.planning_estimates.filter((row) => row.kind === "space")
      .length,
  };
  const visibleIds = () =>
    page
      .locator("#results article")
      .evaluateAll((nodes) =>
        nodes.map(
          (node) => /** @type {HTMLElement} */ (node).dataset.recordId || "",
        ),
      );
  /**
   * Save a native browser download and the exact public selection that produced it.
   * @param {string} tag - Public inventory view or filtered selection label.
   * @returns {Promise<void>} The observation retains actual downloaded bytes separately.
   */
  async function download(tag) {
    const ids = await visibleIds();
    const currentUrl = await page.evaluate(browserLocationHref);
    const pending = page.waitForEvent("download");
    await page.locator("#download-selection").click();
    const file = await pending;
    const path = downloadDirectory + "/" + tag + "-" + file.suggestedFilename();
    await file.saveAs(path);
    downloads.push({
      tag,
      filename: file.suggestedFilename(),
      path,
      rows: ids.length,
      ids,
      url: currentUrl,
    });
  }

  for (const [view, count] of Object.entries(expectedCounts)) {
    await page.locator("#" + view + "-tab").click();
    equal(
      await page.locator("#" + view + "-tab").getAttribute("aria-pressed"),
      "true",
    );
    equal((await visibleIds()).length, count);
    await download(view);
  }
  await page.locator("#candidates-tab").click();
  await page
    .locator("#group")
    .selectOption("SCPN-SYSTEMS-INTEGRATION-AND-CONTROL");
  await page.locator("#scope").selectOption("project");
  await page.locator("#verification").selectOption("independent");
  await page.locator("#search").fill("SSAT");
  await page.waitForURL((url) => url.hash.includes("q=SSAT"));
  const selectedUrl = await page.evaluate(browserLocationHref);
  equal(new URL(selectedUrl).hash.includes("verification=independent"), true);
  equal(await visibleIds(), ["control:SSAT"]);
  equal(await page.locator("#kind").isDisabled(), true);
  equal(
    await page
      .locator("#selection-link")
      .evaluate((node) => /** @type {HTMLAnchorElement} */ (node).href),
    selectedUrl,
  );
  await download("filtered");

  await beforeNavigation();
  await page.reload();
  await page.locator("#counter").filter({ hasText: "1 matching" }).waitFor();
  equal(await page.locator("#search").inputValue(), "SSAT");
  equal(await page.locator("#scope").inputValue(), "project");
  equal(await page.locator("#verification").inputValue(), "independent");
  equal(
    await page.locator("#group").inputValue(),
    "SCPN-SYSTEMS-INTEGRATION-AND-CONTROL",
  );
  equal(await visibleIds(), ["control:SSAT"]);

  await page.locator("#needs-tab").click();
  equal(await page.locator("#verification").inputValue(), "");
  equal(await page.locator("#verification").isDisabled(), true);
  await page.goBack();
  await page
    .locator("#counter")
    .filter({ hasText: "1 matching acquisition" })
    .waitFor();
  equal(await visibleIds(), ["control:SSAT"]);
  await page.goForward();
  await page.waitForFunction(
    () =>
      /** @type {HTMLButtonElement} */ (
        document.getElementById("needs-tab")
      ).getAttribute("aria-pressed") === "true",
  );
  equal(await page.locator("#needs-tab").getAttribute("aria-pressed"), "true");
  await page.goBack();
  await page
    .locator("#counter")
    .filter({ hasText: "1 matching acquisition" })
    .waitFor();
  await page.locator("#search").fill("NO_RECORD_MATCH_7a2b86c1");
  equal((await visibleIds()).length, 0);
  equal(await page.locator("#download-selection").isDisabled(), true);
  await page.locator("#reset-selection").click();
  equal((await visibleIds()).length, data.candidates.length);
  equal(
    await page.locator("#candidates-tab").getAttribute("aria-pressed"),
    "true",
  );

  const group = data.groups[0].id;
  await visit(base + "resources.html#group=" + encodeURIComponent(group));
  await page.locator("#counter").filter({ hasText: "matching" }).waitFor();
  equal(await page.locator("#group").inputValue(), group);
  equal(
    await visibleIds(),
    data.needs.filter((row) => row.group === group).map((row) => row.id),
  );

  await visit(base + "resources.html");
  await page.locator("#counter").filter({ hasText: "matching" }).waitFor();
  await beforeNavigation();
  await page
    .locator("#groups article")
    .first()
    .getByRole("button", { name: "Explore this group" })
    .click();
  equal(await page.locator("#group").inputValue(), group);
  equal(
    await visibleIds(),
    data.needs.filter((row) => row.group === group).map((row) => row.id),
  );

  const responsive = [];
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.locator(".filters").scrollIntoViewIfNeeded();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth + 2,
    );
    equal(overflow, false, "page overflow at " + width);
    responsive.push({ width, overflow });
    if (width === 390)
      await page.screenshot({
        path: downloadDirectory + "/resource-mobile.png",
      });
  }
  equal(errors, []);
  equal(httpFailures, []);
  return {
    expectedCounts,
    downloads,
    selectedUrl,
    backForward: true,
    legacyGroupLink: true,
    emptySelectionDisabled: true,
    activeTabHistoryStable: true,
    responsive,
    errors,
    httpFailures,
    scope:
      "Served local source snapshot; no purchase, supplier fit, price or capability qualification.",
  };
}

/**
 * Read the actual browser downloads with Python's standard CSV consumer and compare original source records.
 * @param {Pick<ExplorerReport, 'downloads'>} report Structured observations returned by the real-browser check.
 * @returns {Promise<{downloads:number,rows:number,sourceRecordsPreserved:boolean}>} Counts of independently consumed downloads and rows.
 */
export async function verifyDownloadedCsv(report) {
  /** @type {import('../types/atlas.js').ResourceData} */
  const data = JSON.parse(
    await readFile(
      new URL("../docs/atlas/public_resources_data.json", import.meta.url),
      "utf8",
    ),
  );
  const source = new Map(
    [...data.needs, ...data.candidates, ...data.planning_estimates].map(
      (row) => [row.id, row],
    ),
  );
  let total = 0;
  for (const download of report.downloads) {
    const csv = await readFile(download.path, "utf8");
    const parsed = spawnSync(
      "python3",
      [
        "-c",
        "import csv,io,json,sys; print(json.dumps(list(csv.DictReader(io.StringIO(sys.stdin.read().lstrip(chr(65279)), newline=''))),ensure_ascii=False))",
      ],
      {
        input: csv,
        encoding: "utf8",
        maxBuffer: Math.max(1_048_576, Buffer.byteLength(csv, "utf8") * 4),
      },
    );
    assert.ifError(parsed.error);
    assert.equal(parsed.status, 0, parsed.stderr);
    /** @type {Record<string,string>[]} */
    const rows = JSON.parse(parsed.stdout);
    assert.deepEqual(
      rows.map((row) => row.record_id),
      download.ids,
    );
    for (const row of rows) {
      const original = source.get(row.record_id);
      assert.ok(
        original,
        "Downloaded record refers to an actual source identity",
      );
      assert.deepEqual(JSON.parse(row.source_record_json), original);
      assert.equal(row.snapshot_as_of, data.as_of);
      assert.equal(row.selection_url, download.url);
      assert.equal(row.source_date, original.as_of);
      assert.equal(row.source_sha256, original.source_sha256 || "");
      assert.equal(
        row.source_url,
        ("source" in original && original.source) || "",
      );
      assert.deepEqual(
        JSON.parse(row.planning_values),
        "values" in original ? original.values : {},
      );
    }
    total += rows.length;
  }
  assert.equal(report.downloads.length, 5);
  return {
    downloads: report.downloads.length,
    rows: total,
    sourceRecordsPreserved: true,
  };
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  if (process.argv[2] === "--browser-code") {
    process.stdout.write(checkResourceExplorer.toString());
  } else if (process.argv[2] === "--verify" && process.argv[3]) {
    const report = JSON.parse(await readFile(process.argv[3], "utf8"));
    console.log(JSON.stringify(await verifyDownloadedCsv(report)));
  } else {
    throw new Error(
      "Use --browser-code or --verify REPORT.json with a real browser report.",
    );
  }
}
