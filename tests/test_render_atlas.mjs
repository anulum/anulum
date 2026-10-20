// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Atlas generator input and reproducibility checks

import test from "node:test";
import assert from "node:assert/strict";
import {
  cp,
  mkdir,
  mkdtemp,
  readFile,
  writeFile,
  rm,
  symlink,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { renderAtlas } from "../tools/render_atlas.mjs";

/**
 * Copy the complete real atlas into an isolated directory; mutations cannot reach canonical hardlinks.
 * @param {(directory:string)=>Promise<void>} run - Public generator input scenario.
 * @returns {Promise<void>} The fixture is removed after the exercised public operation.
 */
async function withAtlasCopy(run) {
  const directory = await mkdtemp(join(tmpdir(), "anulum-render-"));
  try {
    await cp(resolve("docs/atlas"), directory, { recursive: true });
    await run(directory);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

test("canonical atlas passes the public generator without rewriting source bytes", async () => {
  const result = await renderAtlas(resolve("docs/atlas"));
  assert.equal(result.assets, 88);
  assert.ok(result.bytes > 37000000);
});

test("changed complete source is regenerated only explicitly and then reproduces exactly", async () => {
  await withAtlasCopy(async (directory) => {
    const path = join(directory, "public_atlas_data.json");
    const data = JSON.parse(await readFile(path, "utf8"));
    data.nodes[0].phase += " [generator input provenance test]";
    const changed = JSON.stringify(data) + "\n";
    await writeFile(path, changed);
    await assert.rejects(renderAtlas(directory), /Derived atlas file differs/);
    await renderAtlas(directory, { write: true });
    assert.equal(
      await readFile(path, "utf8"),
      changed,
      "Generator never rewrites canonical JSON",
    );
    const first = await readFile(
      join(directory, "atlas-manifest.json"),
      "utf8",
    );
    await renderAtlas(directory, { write: true });
    assert.equal(
      await readFile(join(directory, "atlas-manifest.json"), "utf8"),
      first,
    );
    await renderAtlas(directory);
  });
});

test("missing manifest member and unlisted file are both rejected", async () => {
  await withAtlasCopy(async (directory) => {
    const path = join(directory, "reader-app.js");
    const original = await readFile(path);
    await rm(path);
    await assert.rejects(renderAtlas(directory), /missing or unlisted assets/);
    await writeFile(path, original);
    await writeFile(join(directory, "unlisted.txt"), "unlisted actual input");
    await assert.rejects(renderAtlas(directory), /missing or unlisted assets/);
  });
});

test("symbolic assets are rejected before their targets are read", async () => {
  await withAtlasCopy(async (directory) => {
    await symlink(
      join(directory, "public_atlas_data.json"),
      join(directory, "symlink.json"),
    );
    await assert.rejects(renderAtlas(directory), /regular files/);
  });
});

test("required source absence is rejected even after a manifest omits it", async () => {
  await withAtlasCopy(async (directory) => {
    const path = join(directory, "atlas-manifest.json");
    const manifest = JSON.parse(await readFile(path, "utf8"));
    delete manifest.files["public_atlas_data.json"];
    await writeFile(path, JSON.stringify(manifest));
    await rm(join(directory, "public_atlas_data.json"));
    await assert.rejects(
      renderAtlas(directory),
      /Required atlas asset is missing/,
    );
  });
});

test("duplicate, missing and malformed embedded payloads cannot be silently published", async () => {
  await withAtlasCopy(async (directory) => {
    const path = join(directory, "index.html"),
      original = await readFile(path, "utf8");
    await writeFile(
      path,
      original.replace('id="atlas-data"', 'id="removed-atlas-data"'),
    );
    await assert.rejects(
      renderAtlas(directory),
      /exactly one required payload/,
    );
    await writeFile(
      path,
      original.replace(
        "</body>",
        '<script id="atlas-data" type="application/json">{}</script></body>',
      ),
    );
    await assert.rejects(
      renderAtlas(directory),
      /exactly one required payload/,
    );
    await writeFile(
      path,
      original.replace(
        '<script id="atlas-data" type="application/json">',
        '<script id="atlas-data" type="application/json">invalid-json',
      ),
    );
    await assert.rejects(renderAtlas(directory), SyntaxError);
  });
});

test("public command line rejects unsupported modes and accepts the current exact artifact", () => {
  const invalid = spawnSync(
    process.execPath,
    ["tools/render_atlas.mjs", "--unsupported"],
    { encoding: "utf8" },
  );
  assert.equal(invalid.status, 2);
  assert.match(invalid.stderr, /Usage:/);
  const valid = spawnSync(
    process.execPath,
    ["tools/render_atlas.mjs", "--check"],
    { encoding: "utf8" },
  );
  assert.equal(valid.status, 0, valid.stderr);
  assert.equal(JSON.parse(valid.stdout).assets, 88);
});

test("listed nested source assets are traversed and bound to actual bytes", async () => {
  await withAtlasCopy(async (directory) => {
    await mkdir(join(directory, "source-docs"));
    await cp(
      join(directory, "README.md"),
      join(directory, "source-docs", "README.md"),
    );
    const path = join(directory, "atlas-manifest.json"),
      manifest = JSON.parse(await readFile(path, "utf8"));
    manifest.files["source-docs/README.md"] = "pending-regeneration";
    await writeFile(path, JSON.stringify(manifest));
    await renderAtlas(directory, { write: true });
    const result = await renderAtlas(directory);
    assert.equal(result.assets, 89);
    const actual = JSON.parse(await readFile(path, "utf8"));
    assert.match(actual.files["source-docs/README.md"], /^[a-f0-9]{64}$/);
  });
});

test("the public CLI validates a complete supplied artifact and rejects its broken source", async () => {
  await withAtlasCopy(async (directory) => {
    const valid = spawnSync(
      process.execPath,
      ["tools/render_atlas.mjs", "--write", directory],
      { encoding: "utf8" },
    );
    assert.equal(valid.status, 0, valid.stderr);
    const check = spawnSync(
      process.execPath,
      ["tools/render_atlas.mjs", "--check", directory],
      { encoding: "utf8" },
    );
    assert.equal(check.status, 0, check.stderr);
    await writeFile(join(directory, "public_atlas_data.json"), "invalid-json");
    const invalid = spawnSync(
      process.execPath,
      ["tools/render_atlas.mjs", "--check", directory],
      { encoding: "utf8" },
    );
    assert.equal(invalid.status, 1);
    assert.match(invalid.stderr, /SyntaxError/);
  });
  const imported = spawnSync(
    process.execPath,
    ["--input-type=module", "-e", "await import('./tools/render_atlas.mjs');"],
    { encoding: "utf8" },
  );
  assert.equal(imported.status, 0, imported.stderr);
  assert.equal(imported.stdout, "");
});
