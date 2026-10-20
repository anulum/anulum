// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Complete captured-source mutations through the public artifact

import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { renderAtlas } from "../tools/render_atlas.mjs";
import { withAtlasArtifact } from "./atlas-runtime.mjs";

/**
 * @typedef {{atlas:import('../types/atlas.js').AtlasData,
 * budget:import('../types/atlas.js').BudgetData,
 * resources:import('../types/atlas.js').ResourceData,
 * technical:import('../types/atlas.js').TechnicalData,
 * direct:import('../types/atlas.js').DirectData,
 * library:import('../types/atlas.js').DocumentData}} SourceInputs
 */

/**
 * Exercise bounded source omissions or adversarial edits in a complete real artifact.
 * @param {(inputs:SourceInputs)=>void|Promise<void>} edit - Explicit source variation, never a replacement fixture.
 * @param {(url:string)=>Promise<void>} run - Real HTTP consumer of the independently regenerated variant.
 * @returns {Promise<void>} Canonical files stay unchanged; the complete copy is removed.
 */
export async function withAtlasSourceVariant(edit, run) {
  await withAtlasArtifact(async (directory) => {
    const names = {
      atlas: "public_atlas_data.json",
      budget: "public_budget_data.json",
      resources: "public_resources_data.json",
      technical: "technical_explanations_candidate.json",
      direct: "direct_repository_sources.json",
      library: "document_library_candidate.json",
    };
    /** @type {SourceInputs} */
    const inputs = {
      atlas: JSON.parse(await readFile(join(directory, names.atlas), "utf8")),
      budget: JSON.parse(await readFile(join(directory, names.budget), "utf8")),
      resources: JSON.parse(
        await readFile(join(directory, names.resources), "utf8"),
      ),
      technical: JSON.parse(
        await readFile(join(directory, names.technical), "utf8"),
      ),
      direct: JSON.parse(await readFile(join(directory, names.direct), "utf8")),
      library: JSON.parse(
        await readFile(join(directory, names.library), "utf8"),
      ),
    };
    await edit(inputs);
    for (const key of /** @type {(keyof SourceInputs)[]} */ (
      Object.keys(names)
    ))
      await writeFile(
        join(directory, names[key]),
        JSON.stringify(inputs[key]) + "\n",
      );
    await renderAtlas(directory, { write: true });
  }, run);
}
