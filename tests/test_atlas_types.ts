// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Canonical JSON-to-reader type contracts

import type atlas from "../docs/atlas/public_atlas_data.json";
import type resources from "../docs/atlas/public_resources_data.json";
import type budget from "../docs/atlas/public_budget_data.json";
import type documents from "../docs/atlas/document_library_candidate.json";
import type technical from "../docs/atlas/technical_explanations_candidate.json";
import type updates from "../docs/atlas/source_update_candidate.json";
import type visuals from "../docs/atlas/visual_catalogue.json";
import type direct from "../docs/atlas/direct_repository_sources.json";
import type {
  AtlasData,
  ResourceData,
  BudgetData,
  DocumentData,
  TechnicalData,
  UpdateData,
  VisualData,
  DirectData,
} from "../types/atlas.js";

/** Require the actual captured JSON shape to satisfy its reader input contract; this emits no runtime code. */
type Accepts<Expected, Actual extends Expected> = Actual;
/** Actual source entries and directed relationships. */
export type AtlasBinding = Accepts<AtlasData, typeof atlas>;
/** Actual material needs, acquisition alternatives and estimates. */
export type ResourceBinding = Accepts<ResourceData, typeof resources>;
/** Actual preliminary budget scenarios and source scope. */
export type BudgetBinding = Accepts<BudgetData, typeof budget>;
/** Actual captured repository reading projections. */
export type DocumentBinding = Accepts<DocumentData, typeof documents>;
/** Actual technical explanations and source passage library. */
export type TechnicalBinding = Accepts<TechnicalData, typeof technical>;
/** Actual dated source-update annex. */
export type UpdateBinding = Accepts<UpdateData, typeof updates>;
/** Actual owned illustrations and their representation limits. */
export type VisualBinding = Accepts<VisualData, typeof visuals>;
/** Actual direct source records and static declaration scope. */
export type DirectBinding = Accepts<DirectData, typeof direct>;
