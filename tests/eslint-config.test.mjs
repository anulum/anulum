// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Native static-analysis gate controls

import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";

test(
  "the native static-analysis gate rejects injection faults in the complete actual reader source",
  { timeout: 120000 },
  async () => {
    const source = await readFile("docs/atlas/reader-core.js", "utf8"),
      assignment = "node.textContent = String(text)";
    assert.ok(source.includes(assignment));
    const variants = [
      [source, ""],
      [
        source.replace(assignment, "node.innerHTML = String(text)"),
        "no-unsanitized/property",
      ],
      [
        source.replace(
          assignment,
          'node.insertAdjacentHTML("beforeend", String(text))',
        ),
        "no-unsanitized/method",
      ],
      [source.replace(assignment, "eval(String(text))"), "no-eval"],
    ];
    for (const [input, expected] of variants) {
      const check = spawnSync(
        process.execPath,
        [
          "node_modules/eslint/bin/eslint.js",
          "--stdin",
          "--stdin-filename",
          "docs/atlas/reader-core.js",
          "--format",
          "json",
        ],
        { input, encoding: "utf8", timeout: 30000 },
      );
      assert.equal(check.signal, null, check.stderr);
      /** @type {import('eslint').ESLint.LintResult[]} Actual native CLI report schema. */
      const reports = JSON.parse(check.stdout);
      const rules = reports.flatMap((report) =>
        report.messages.map((message) => message.ruleId),
      );
      if (expected) {
        assert.notEqual(input, source);
        assert.equal(check.status, 1, check.stderr);
        assert.ok(
          rules.includes(expected),
          "The actual source fault must be rejected by " + expected,
        );
      } else {
        assert.equal(check.status, 0, check.stderr);
        assert.deepEqual(rules, []);
      }
    }
  },
);
