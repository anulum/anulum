// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Source-supported project responsibilities and artefacts

import {
  requireRecord,
  projectLink as R_projectLink,
  el,
  link,
  href,
} from "@atlas/reader-core";
import { documentHref as R_documentHref } from "@atlas/reader-documents";
import {
  technicalData as R_technicalData,
  technicalGuides as R_technicalGuides,
  technicalReferences as R_technicalReferences,
  technicalSourceHref as R_technicalSourceHref,
} from "@atlas/reader-technical";

/**
 * Link each reference identity to its exact captured source passage.
 * @param {string[]} ids - Reference identities supplied by the explanation record.
 * @returns {HTMLDivElement} Source links in their original order.
 */
function citations(ids) {
  const root = el("div", undefined, "technical-citations");
  root.setAttribute("aria-label", "Supporting source passages");
  for (const id of ids) {
    const row = requireRecord(R_technicalReferences.get(id)),
      target = link(
        row.project +
          " · " +
          row.document +
          " · lines " +
          row.start +
          "–" +
          row.end,
        R_technicalSourceHref(row.project, row.document, row.start),
      );
    target.dataset.sourceReference = id;
    root.append(target);
  }
  return root;
}
/**
 * Display one source paragraph and its supporting references.
 * @param {import('../../types/atlas.js').ExplanationRecord} row - Dated explanation text.
 * @returns {HTMLDivElement} Detached plain-text paragraph.
 */
function paragraph(row) {
  const root = el("div", undefined, "technical-record");
  root.append(el("p", row.text), citations(row.references));
  return root;
}
/**
 * Display a component or relationship description with its supplied project or title.
 * @param {import('../../types/atlas.js').ExplanationRecord} row - Source explanation record.
 * @returns {HTMLElement} Detached record with source citations.
 */
function record(row) {
  const card = el("article", undefined, "technical-record");
  if (row.project_id || row.title) {
    const heading = el("h4");
    if (row.project_id) heading.append(R_projectLink(row.project_id));
    else heading.textContent = row.title || "";
    card.append(heading);
  }
  card.append(el("p", row.text), citations(row.references));
  return card;
}
/**
 * Render one explanation section without inventing missing rows.
 * @param {string} title - Visible section heading.
 * @param {string} key - Stable section identity.
 * @param {import('../../types/atlas.js').ExplanationRecord[] | undefined} items - Supplied source rows.
 * @returns {HTMLElement} Detached explanation section.
 */
function records(title, key, items) {
  const root = el("section", undefined, "technical-section");
  root.dataset.guideSection = key;
  root.append(el("h3", title));
  const grid = el("div", undefined, "technical-record-grid");
  for (const row of items || []) grid.append(record(row));
  root.append(grid);
  return root;
}
/**
 * Show the source-backed technical explanation, including its interpretation limits.
 * @param {import('../../types/atlas.js').AtlasNode} node - Actual source entry.
 * @returns {HTMLElement | null} No panel is supplied when the entry has no guide.
 */
function technicalPanel(node) {
  const guide = R_technicalGuides.get(node.id);
  if (!guide) return null;
  const root = el("section", undefined, "technical-panel");
  root.dataset.technicalGuide = node.id;
  root.append(
    el("h2", "How this system works"),
    el("p", R_technicalData.state, "notice"),
    el(
      "p",
      "Explanation source update (UTC): " +
        (R_technicalData.guide_source_captures[node.id] ||
          R_technicalData.captured_at_utc) +
        ". Each cited document retains its own capture date and exact supporting passage.",
      "caption",
    ),
    paragraph(guide.purpose),
    el("h3", "Scope of this explanation"),
    paragraph(guide.scope),
  );
  if (guide.implementation?.length)
    root.append(
      records(
        "Implemented in the current source",
        "implementation",
        guide.implementation,
      ),
      el(
        "p",
        "This section describes inspected source. Execution, scientific and deployment acceptance require their own evidence.",
        "caption",
      ),
      link(
        "View project architecture illustrations →",
        href({ project: node.id, tab: "visuals" }),
      ),
    );
  root.append(
    records("What goes in", "inputs", guide.inputs),
    records("Source-described result artefacts", "outputs", guide.outputs),
    el(
      "p",
      "These artefacts describe the source’s responsibilities and target contracts. They do not add accepted output records or a readiness score to the atlas.",
      "caption",
    ),
    records("Component responsibilities", "components", guide.components),
    el(
      "p",
      "Read these as responsibilities, rather than a prescribed linear runtime sequence. Coupling, feedback and separate consumer scopes follow the linked source.",
      "caption",
    ),
  );
  if (guide.model_layers?.length)
    root.append(
      records(
        "Models and what their results mean",
        "model_layers",
        guide.model_layers,
      ),
    );
  if (guide.connections.length)
    root.append(
      records(
        "Documented connections and ownership",
        "connections",
        guide.connections,
      ),
      el(
        "p",
        "Connection descriptions are source statements. The atlas graph and its source/proposal layers remain separate; current consumer acceptance needs its own evidence.",
        "caption",
      ),
    );
  if (guide.external_roles?.length)
    root.append(
      records(
        "Separately owned dependency roles",
        "external_roles",
        guide.external_roles,
      ),
    );
  root.append(
    records(
      "Limits that matter when interpreting a result",
      "limits",
      guide.limits,
    ),
  );
  if (guide.source_notes?.length)
    root.append(
      records(
        "Where source records differ",
        "source_notes",
        guide.source_notes,
      ),
    );
  const actions = el("div", undefined, "context-links");
  actions.append(
    link("Project passport", href({ project: node.id })),
    link(
      "Compare with another system",
      href({ view: "compare", entries: node.id }),
    ),
    link("Locate in the programme map", href({ view: "map", focus: node.id })),
    link(
      "Read the partnership brief",
      href({ view: "support", entry: node.id }),
    ),
    link("Browse captured repository documents", R_documentHref(node.id)),
  );
  root.append(actions);
  return root;
}
/**
 * Link a project to its available technical explanation without extending its scope.
 * @param {import('../../types/atlas.js').AtlasNode} node - Actual source entry.
 * @returns {HTMLElement | null} No panel is supplied when the entry has no guide.
 */
function technicalPreview(node) {
  const guide = R_technicalGuides.get(node.id);
  if (!guide) return null;
  const root = el("section", undefined, "technical-preview");
  root.dataset.technicalPreview = node.id;
  root.append(
    el("h2", "How this system works"),
    el("p", guide.purpose.text),
    link(
      "Read inputs, artefacts, responsibilities and source passages →",
      href({ view: "technical", entry: node.id }),
    ),
    link("Compare this system →", href({ view: "compare", entries: node.id })),
    el(
      "p",
      "Source-reading explanation · owning content review pending",
      "caption",
    ),
  );
  return root;
}

export { technicalPanel, technicalPreview, record as technicalRecord };
