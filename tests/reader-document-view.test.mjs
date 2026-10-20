// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — reader-document-view public behaviour contracts

import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { withAtlasPage, openRoute } from "./atlas-runtime.mjs";
import { library, technical } from "./atlas-data.mjs";

test(
  "document search, line links and native text download preserve exact captured content",
  { timeout: 120000 },
  async () => {
    const project = library.projects.find((row) =>
      row.documents.some((doc) => doc.lines.length > 5),
    );
    assert.ok(project);
    const doc = project.documents.find((row) => row.lines.length > 5);
    assert.ok(doc);
    await withAtlasPage(async (page) => {
      await openRoute(page, {
        view: "documents",
        entry: project.project_id,
        document: doc.label,
        line: "1",
      });
      assert.equal(
        await page.locator("#source-line-1").getAttribute("class"),
        "document-line selected-source-line",
      );
      const query = doc.lines.find((line) => line.trim().length > 4);
      assert.ok(query);
      await page.locator("#document-find").fill(query.trim().slice(0, 4));
      assert.ok((await page.locator(".document-text mark").count()) > 0);
      await page
        .getByRole("button", { name: "Previous match", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Next match", exact: true })
        .click();
      await page.locator("#document-find").press("Enter");
      assert.equal(await page.locator("mark.current-match").count(), 1);
      await page.locator("#document-find").fill("NO_MATCH_7a2b86c1");
      assert.equal(
        await page
          .getByRole("button", { name: "Next match", exact: true })
          .isDisabled(),
        true,
      );
      await page.locator("#document-find").fill("");
      assert.deepEqual(
        await page.locator(".document-line-text").allTextContents(),
        doc.lines,
      );
      const downloading = page.waitForEvent("download");
      await page
        .getByRole("button", {
          name: "Download this reading view",
          exact: true,
        })
        .click();
      const download = await downloading,
        path = await download.path();
      assert.ok(path);
      assert.equal(await readFile(path, "utf8"), doc.lines.join("\n"));
      for (const line of [
        "0",
        "-1",
        "1.5",
        "9007199254740992",
        String(doc.lines.length + 1),
      ]) {
        await openRoute(page, {
          view: "documents",
          entry: project.project_id,
          document: doc.label,
          line,
        });
        assert.equal(await page.locator(".selected-source-line").count(), 0);
        assert.deepEqual(
          await page.locator(".document-line-text").allTextContents(),
          doc.lines,
        );
      }
    });
  },
);

test(
  "both document readers display every captured line exactly",
  { timeout: 600000 },
  async () => {
    await withAtlasPage(async (page) => {
      for (const [
        view,
        data,
      ] of /** @type {[string, import('../types/atlas.js').DocumentData][]} */ ([
        ["documents", library],
        ["technical-source", technical.library],
      ])) {
        for (const project of data.projects)
          for (const doc of project.documents) {
            await openRoute(page, {
              view,
              entry: project.project_id,
              document: doc.label,
            });
            assert.deepEqual(
              await page.locator(".document-line-text").allTextContents(),
              doc.lines,
              project.project_id + "/" + doc.label,
            );
          }
      }
    });
  },
);
