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
  stat,
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

test("the public generator refuses withheld repository contents before deriving output", async () => {
  await withAtlasCopy(async (directory) => {
    /** @type {{file:string,original:string,corrupted:string}[]} */
    const faults = [];
    const libraryFile = "document_library_candidate.json";
    const librarySource = await readFile(join(directory, libraryFile), "utf8");
    /** @type {{withheld_nodes:Record<string, import('../types/atlas.js').AtlasNode>,withheld_assets:string[],approved_static_assets:Record<string,string[]>}} */
    const policy = JSON.parse(
      await readFile("tools/atlas_publication_policy.json", "utf8"),
    );
    assert.equal(Object.keys(policy.withheld_nodes).length, 42);
    for (const owner of Object.keys(policy.withheld_nodes)) {
      /** @type {import('../types/atlas.js').DocumentData} */
      const data = JSON.parse(librarySource);
      const hidden = data.projects.find((row) => row.project_id === owner);
      const donor = data.projects.find((row) => row.documents.length);
      assert.ok(hidden);
      assert.ok(donor);
      hidden.documents = [donor.documents[0]];
      Reflect.deleteProperty(data, "publication_exclusions");
      faults.push({
        file: libraryFile,
        original: librarySource,
        corrupted: JSON.stringify(data),
      });
    }
    const directFile = "direct_repository_sources.json";
    const directSource = await readFile(join(directory, directFile), "utf8");
    for (const field of /** @type {const} */ ([
      "documents",
      "declared_package_metadata",
      "boundary_declarations",
      "readme_excerpts",
      "architecture_documents",
    ])) {
      /** @type {import('../types/atlas.js').DirectData} */
      const data = JSON.parse(directSource);
      const hidden = data.projects.find(
        (row) => row.project_id === "ANULUM-CORRESPONDENCE",
      );
      const donor = data.projects.find((row) => Object.keys(row[field]).length);
      assert.ok(hidden);
      if (field === "boundary_declarations") {
        /** @type {import('../types/atlas.js').AtlasData} */
        const published = JSON.parse(
          await readFile(join(directory, "public_atlas_data.json"), "utf8"),
        );
        const source = published.nodes.find((row) => row.id === "SC-NEUROCORE");
        assert.ok(source);
        hidden.boundary_declarations = { boundary: source.boundary };
      } else {
        assert.ok(donor);
        Reflect.set(hidden, field, donor[field]);
      }
      faults.push({
        file: directFile,
        original: directSource,
        corrupted: JSON.stringify(data),
      });
    }
    const atlasFile = "public_atlas_data.json";
    const atlasSource = await readFile(join(directory, atlasFile), "utf8");
    for (const field of /** @type {const} */ ([
      "function",
      "phase",
      "boundary",
      "source_note",
      "sources",
      "dossier",
    ])) {
      /** @type {import('../types/atlas.js').AtlasData} */
      const data = JSON.parse(atlasSource);
      const hidden = data.nodes.find(
        (row) => row.id === "ANULUM-CORRESPONDENCE",
      );
      const donor = data.nodes.find((row) => row.id === "SC-NEUROCORE");
      assert.ok(hidden);
      assert.ok(donor);
      assert.notDeepEqual(hidden[field], donor[field]);
      Reflect.set(hidden, field, donor[field]);
      faults.push({
        file: atlasFile,
        original: atlasSource,
        corrupted: JSON.stringify(data),
      });
    }
    for (const owner of Object.keys(policy.withheld_nodes)) {
      /** @type {import('../types/atlas.js').AtlasData} */
      const data = JSON.parse(atlasSource);
      const hidden = data.nodes.find((row) => row.id === owner);
      const donor = data.nodes.find((row) => row.id === "SC-NEUROCORE");
      assert.ok(hidden);
      assert.ok(donor);
      hidden.dossier = donor.dossier;
      faults.push({
        file: atlasFile,
        original: atlasSource,
        corrupted: JSON.stringify(data),
      });
    }
    for (const field of ["function", "packages", "edge"]) {
      /** @type {import('../types/atlas.js').AtlasData} */
      const data = JSON.parse(atlasSource);
      const hidden = data.nodes.find((row) => row.id === "QPU-RESULT-PACK");
      const donor = data.nodes.find((row) => row.id === "SC-NEUROCORE");
      assert.ok(hidden);
      assert.ok(donor);
      if (field === "edge") {
        const edge = data.edges.find(
          (row) =>
            Object.hasOwn(policy.withheld_nodes, row.from) ||
            Object.hasOwn(policy.withheld_nodes, row.to),
        );
        assert.ok(edge);
        edge.payload = donor.function;
      } else
        Reflect.set(
          hidden,
          field,
          donor[field === "function" ? "function" : "packages"],
        );
      faults.push({
        file: atlasFile,
        original: atlasSource,
        corrupted: JSON.stringify(data),
      });
    }
    const technicalFile = "technical_explanations_candidate.json";
    const technicalSource = await readFile(
      join(directory, technicalFile),
      "utf8",
    );
    for (const field of [
      "documents",
      "references",
      "guides",
      "guide_source_captures",
    ]) {
      /** @type {import('../types/atlas.js').TechnicalData} */
      const data = JSON.parse(technicalSource);
      const owner = "QPU-RESULT-PACK";
      if (field === "documents") {
        const hidden = data.library.projects.find(
          (row) => row.project_id === owner,
        );
        const donor = data.library.projects.find((row) => row.documents.length);
        assert.ok(hidden);
        assert.ok(donor);
        hidden.documents = [donor.documents[0]];
      } else if (field === "references") data.references[0].project = owner;
      else if (field === "guides") data.guides[0].project_id = owner;
      else data.guide_source_captures[owner] = data.captured_at_utc;
      faults.push({
        file: technicalFile,
        original: technicalSource,
        corrupted: JSON.stringify(data),
      });
    }
    for (const file of [
      "visual_catalogue.json",
      "source_update_candidate.json",
    ]) {
      const original = await readFile(join(directory, file), "utf8");
      if (file === "visual_catalogue.json") {
        /** @type {import('../types/atlas.js').VisualData} */
        const data = JSON.parse(original);
        data.illustrations[0].project = "QPU-RESULT-PACK";
        faults.push({ file, original, corrupted: JSON.stringify(data) });
      } else {
        /** @type {import('../types/atlas.js').UpdateData} */
        const data = JSON.parse(original);
        data.projects[0].project_id = "QPU-RESULT-PACK";
        faults.push({ file, original, corrupted: JSON.stringify(data) });
      }
    }
    for (const file of [libraryFile, directFile]) {
      const original = await readFile(join(directory, file), "utf8");
      /** @type {import('../types/atlas.js').DocumentData} */
      const data = JSON.parse(original);
      const donor = data.projects.find((row) => row.documents.length);
      assert.ok(donor);
      donor.project_id = "SC-NC-CORE";
      faults.push({ file, original, corrupted: JSON.stringify(data) });
    }
    const staticFile = "atlas_full.html";
    const staticSource = await readFile(join(directory, staticFile), "utf8");
    const altered = staticSource.replace(
      /(<g\b(?=[^>]*data-id="QPU-RESULT-PACK")[^>]*>[\s\S]*?<title[^>]*>)[\s\S]*?(<\/title>)/,
      "$1" + policy.withheld_nodes["SCPN-PHWR-CORE"].function + "$2",
    );
    const missingTitle = staticSource.replace(
      /(<g\b(?=[^>]*data-id="QPU-RESULT-PACK")[^>]*>[\s\S]*?)<title[^>]*>[\s\S]*?<\/title>/,
      "$1",
    );
    assert.notEqual(missingTitle, staticSource);
    faults.push({
      file: staticFile,
      original: staticSource,
      corrupted: missingTitle,
    });
    assert.notEqual(altered, staticSource);
    faults.push({
      file: staticFile,
      original: staticSource,
      corrupted: altered,
    });
    for (const replacement of ['aria-label="unapproved contents"', ""]) {
      const corrupted = staticSource.replace(
        /(<g\b(?=[^>]*data-id="QPU-RESULT-PACK")[^>]*?)aria-label="[^"]*"/,
        "$1" + replacement,
      );
      assert.notEqual(corrupted, staticSource);
      faults.push({ file: staticFile, original: staticSource, corrupted });
    }
    const entry = await readFile(join(directory, "index.html"), "utf8");
    const manifest = await readFile(
      join(directory, "atlas-manifest.json"),
      "utf8",
    );
    // Only published donor text enters these faults; private source never belongs in committed fixtures.
    for (const fault of faults) {
      const path = join(directory, fault.file);
      await writeFile(path, fault.corrupted);
      await assert.rejects(
        renderAtlas(directory, { write: true }),
        /Repository-internal contents are not publishable/,
      );
      assert.equal(
        await readFile(join(directory, "index.html"), "utf8"),
        entry,
      );
      assert.equal(
        await readFile(join(directory, "atlas-manifest.json"), "utf8"),
        manifest,
      );
      await writeFile(path, fault.original);
    }
    const publicDrawing = await readFile(
      join(directory, "F4_funding_blocks_outcomes_v0.4.svg"),
    );
    for (const asset of [...policy.withheld_assets, "visuals/SC-NC-CORE.svg"]) {
      const path = join(directory, asset);
      const changed = JSON.parse(manifest);
      changed.files[asset] = "selected-public-donor";
      const selected = JSON.stringify(changed);
      await writeFile(path, publicDrawing);
      await writeFile(join(directory, "atlas-manifest.json"), selected);
      await assert.rejects(
        renderAtlas(directory, { write: true }),
        /Repository-internal contents are not publishable/,
      );
      assert.equal(
        await readFile(join(directory, "index.html"), "utf8"),
        entry,
      );
      assert.equal(
        await readFile(join(directory, "atlas-manifest.json"), "utf8"),
        selected,
      );
      await rm(path);
      await writeFile(join(directory, "atlas-manifest.json"), manifest);
    }
    for (const asset of Object.keys(policy.approved_static_assets)) {
      const path = join(directory, asset);
      const original = await readFile(path);
      const extension = asset.split(".").at(-1);
      const donorName = asset.startsWith("F4_")
        ? "F5_conditional_timeline_v0.4."
        : "F4_funding_blocks_outcomes_v0.4.";
      const donor = await readFile(join(directory, donorName + extension));
      assert.notDeepEqual(donor, original);
      await writeFile(path, donor);
      await assert.rejects(
        renderAtlas(directory, { write: true }),
        /Repository-internal contents are not publishable/,
      );
      assert.equal(
        await readFile(join(directory, "index.html"), "utf8"),
        entry,
      );
      assert.equal(
        await readFile(join(directory, "atlas-manifest.json"), "utf8"),
        manifest,
      );
      await writeFile(path, original);
    }
  });
});

test("canonical atlas passes the public generator without rewriting source bytes", async () => {
  const result = await renderAtlas(resolve("docs/atlas"));
  /** @type {{files:Record<string,string>}} */
  const manifest = JSON.parse(
    await readFile("docs/atlas/atlas-manifest.json", "utf8"),
  );
  const sizes = await Promise.all(
    Object.keys(manifest.files).map(
      async (name) => (await stat(join("docs/atlas", name))).size,
    ),
  );
  assert.deepEqual(result, {
    assets: sizes.length,
    bytes: sizes.reduce((total, size) => total + size, 0),
  });
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

test("public command line rejects unsupported modes and accepts the current exact artifact", async () => {
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
  const manifest = JSON.parse(
    await readFile("docs/atlas/atlas-manifest.json", "utf8"),
  );
  assert.equal(
    JSON.parse(valid.stdout).assets,
    Object.keys(manifest.files).length,
  );
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
    assert.equal(result.assets, Object.keys(manifest.files).length);
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
