// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Complete captured inputs for native reader contracts

import { readFile } from "node:fs/promises";

/** @type {import('../types/atlas.js').AtlasData} */
export const atlas = JSON.parse(
  await readFile(
    new URL("../docs/atlas/public_atlas_data.json", import.meta.url),
    "utf8",
  ),
);
/** @type {import('../types/atlas.js').DocumentData} */
export const library = JSON.parse(
  await readFile(
    new URL("../docs/atlas/document_library_candidate.json", import.meta.url),
    "utf8",
  ),
);
/** @type {import('../types/atlas.js').TechnicalData} */
export const technical = JSON.parse(
  await readFile(
    new URL(
      "../docs/atlas/technical_explanations_candidate.json",
      import.meta.url,
    ),
    "utf8",
  ),
);
/** @type {import('../types/atlas.js').BudgetData} */
export const budget = JSON.parse(
  await readFile(
    new URL("../docs/atlas/public_budget_data.json", import.meta.url),
    "utf8",
  ),
);
/** @type {import('../types/atlas.js').ResourceData} */
export const resources = JSON.parse(
  await readFile(
    new URL("../docs/atlas/public_resources_data.json", import.meta.url),
    "utf8",
  ),
);
/** @type {import('../types/atlas.js').DirectData} */
export const directData = JSON.parse(
  await readFile(
    new URL("../docs/atlas/direct_repository_sources.json", import.meta.url),
    "utf8",
  ),
);
