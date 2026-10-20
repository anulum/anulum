// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Real browser evidence and current source binding

import assert from "node:assert/strict";
import {
  readFile,
  writeFile,
  mkdir,
  readdir,
  cp,
  mkdtemp,
  rm,
} from "node:fs/promises";
import { resolve, basename, join } from "node:path";
import { pathToFileURL } from "node:url";
import { randomUUID } from "node:crypto";
import { chromium } from "playwright";
import ts from "typescript";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createInterface } from "node:readline";
import { tmpdir } from "node:os";

export const baseUrl =
  process.env.ATLAS_BASE_URL || "http://127.0.0.1:34080/atlas/";
export const atlasDirectory = resolve("docs/atlas");
/** @type {WeakMap<import('playwright').Page,string>} Actual runner-owned page origins. */
const servedBases = new WeakMap();

/**
 * Exercise an actual browser page and retain source-bound V8 ranges, including failed journeys.
 * @param {(page: import('playwright').Page) => Promise<void>} run - Public user journey.
 * @param {{servedBase?:string,expectedErrors?:RegExp}} [options] - Exact artifact origin and any explicitly expected source-rejection errors.
 * @returns {Promise<void>} Complete observations with no unexpected browser runtime errors.
 */
export async function withAtlasPage(
  run,
  { servedBase = baseUrl, expectedErrors } = {},
) {
  const browser = await chromium.launch({
    channel: process.env.ATLAS_BROWSER_CHANNEL,
    headless: true,
    args: ["--renderer-process-limit=2", "--js-flags=--max-old-space-size=256"],
  });
  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
    });
    const page = await context.newPage();
    servedBases.set(page, servedBase);
    /** @type {string[]} */
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.coverage.startJSCoverage({
      resetOnNavigation: false,
      reportAnonymousScripts: true,
    });
    try {
      await run(page);
      if (expectedErrors) {
        assert.ok(
          errors.length > 0,
          "The actual damaged artifact must produce a source rejection",
        );
        for (const error of errors) assert.match(error, expectedErrors);
      } else assert.deepEqual(errors, [], "No browser runtime errors");
    } finally {
      await retainCoverage(page);
    }
  } finally {
    await browser.close();
  }
}

/**
 * Finish the hashchange and animation-frame work of a real public reader route.
 * @param {import('playwright').Page} page - Actual browser page.
 * @param {Record<string,string>} parameters - Public fragment parameters.
 * @returns {Promise<void>} The route has a rendered main heading.
 */
export async function openRoute(page, parameters) {
  const servedBase = servedBases.get(page);
  assert.ok(servedBase, "Route page belongs to this runner");
  const fragment = "#" + new URLSearchParams(parameters);
  if (page.url().split("#")[0] === servedBase + "index.html")
    await page.evaluate((hash) => {
      location.hash = hash;
    }, fragment);
  else await navigate(page, servedBase + "index.html" + fragment);
  await page.locator("#content h1").waitFor();
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
}

/**
 * Index exact owned function expressions so browser callbacks retain their original source offsets.
 * @returns {Promise<{file:string,text:string,start:number}[]>} Native AST spans, never rewritten source.
 */
async function ownedFunctions() {
  /** @type {{file:string,text:string,start:number}[]} */
  const functions = [];
  for (const name of await readdir("tests")) {
    if (!name.endsWith(".mjs")) continue;
    const file = resolve("tests", name),
      source = await readFile(file, "utf8");
    const ast = ts.createSourceFile(
      file,
      source,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.JS,
    );
    /**
     * Retain lexical function spans from the native parser.
     * @param {import('typescript').Node} node - Current source AST node.
     * @returns {void} Nested callbacks remain separately identifiable.
     */
    function visit(node) {
      if (ts.isArrowFunction(node) || ts.isFunctionExpression(node))
        functions.push({
          file,
          text: node.getText(ast),
          start: node.getStart(ast),
        });
      ts.forEachChild(node, visit);
    }
    visit(ast);
  }
  return functions;
}
const callbackSources = await ownedFunctions();

/**
 * Retain the current V8 context before a full navigation destroys its execution counters.
 * @param {import('playwright').Page} page - Actual page with precise V8 coverage enabled.
 * @returns {Promise<void>} Raw and source-bound whole-file ranges are saved.
 */
async function retainCoverage(page) {
  const servedBase = servedBases.get(page);
  assert.ok(servedBase, "Coverage page belongs to this runner");
  const coverage = await page.coverage.stopJSCoverage();
  const result = [];
  for (const entry of coverage) {
    const url = new URL(entry.url || "about:blank");
    if (!entry.url) {
      const matches = callbackSources.filter(
        (row) =>
          entry.source === row.text || entry.source === "(" + row.text + ")",
      );
      if (!matches.length) continue;
      assert.equal(
        matches.length,
        1,
        "A browser callback must bind to exactly one owned native AST span",
      );
      const match = matches[0],
        shift = match.start - (entry.source === match.text ? 0 : 1);
      assert.ok(
        entry.functions.length > 1,
        "Browser callback has an actual function counter beyond the eval wrapper",
      );
      result.push({
        scriptId: entry.scriptId,
        url: pathToFileURL(match.file).href,
        functions: entry.functions.slice(1).map((fn) => ({
          ...fn,
          ranges: fn.ranges.map((range) => ({
            ...range,
            startOffset: range.startOffset + shift,
            endOffset: range.endOffset + shift,
          })),
        })),
      });
      continue;
    }
    if (!url.pathname.endsWith(".js") || !entry.url.startsWith(servedBase))
      continue;
    const file = resolve(atlasDirectory, basename(url.pathname));
    assert.equal(
      entry.source,
      await readFile(file, "utf8"),
      "Coverage binds the complete current source file",
    );
    result.push({
      scriptId: entry.scriptId,
      url: pathToFileURL(file).href,
      functions: entry.functions,
    });
  }
  await mkdir("coverage/browser", { recursive: true });
  await writeFile(
    "coverage/browser/" + randomUUID() + ".json",
    JSON.stringify({ result }),
  );
  await mkdir("coverage/browser-raw", { recursive: true });
  await writeFile(
    "coverage/browser-raw/" + randomUUID() + ".json",
    JSON.stringify(coverage),
  );
}

/**
 * Preserve precise coverage from the old execution context before navigating the actual page.
 * @param {import('playwright').Page} page - Caller-owned real browser page.
 * @param {string} url - Actual public entry URL.
 * @returns {Promise<void>} The new entry reaches its native load event.
 */
export async function navigate(page, url) {
  await checkpoint(page);
  await page.goto(url);
}

/**
 * Preserve current execution counters before a reload or link creates a new document context.
 * @param {import('playwright').Page} page - Actual browser page with coverage enabled.
 * @returns {Promise<void>} A fresh precise counter session is ready for navigation.
 */
export async function checkpoint(page) {
  await retainCoverage(page);
  await page.coverage.startJSCoverage({
    resetOnNavigation: false,
    reportAnonymousScripts: true,
  });
}

/**
 * Serve an isolated copy of the complete real publication artifact through Python's native HTTP server.
 * @param {(directory:string)=>Promise<void>} edit - Bounded deliberate damage to actual source inputs.
 * @param {(url:string)=>Promise<void>} run - Real HTTP consumer observations.
 * @returns {Promise<void>} The child server and copied tree are closed even after a rejected input.
 */
export async function withAtlasArtifact(edit, run) {
  const directory = await mkdtemp(join(tmpdir(), "anulum-artifact-"));
  try {
    await cp(atlasDirectory, directory, { recursive: true });
    await edit(directory);
    const child = spawn(
      "python3",
      [
        "-u",
        "-c",
        [
          "from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler",
          "from functools import partial",
          "import sys",
          "server = ThreadingHTTPServer(('127.0.0.1', 0), partial(SimpleHTTPRequestHandler, directory=sys.argv[1]))",
          "print(server.server_address[1], flush=True)",
          "server.serve_forever()",
        ].join("\n"),
        directory,
      ],
      { stdio: ["ignore", "pipe", "ignore"] },
    );
    const lines = createInterface({ input: child.stdout });
    try {
      const ready = await Promise.race([
        once(lines, "line"),
        once(child, "exit").then(() => {
          throw new Error("Artifact HTTP server exited before readiness");
        }),
      ]);
      /** @type {unknown} Native readline event payload. */
      const port = ready[0];
      assert.ok(typeof port === "string");
      assert.match(port, /^[0-9]+$/);
      await run("http://127.0.0.1:" + port + "/");
    } finally {
      lines.close();
      if (child.exitCode === null && child.signalCode === null) {
        child.kill();
        await once(child, "exit");
      }
    }
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}
