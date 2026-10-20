// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Source records in project partnership briefs

import {
  projectLink as R_projectLink,
  el,
  facts,
  disclosure,
  link,
} from "@atlas/reader-core";

/**
 * Preserve a supplied string or explicitly identify an absent source field.
 * @param {string | null | undefined} value - Original source value.
 * @returns {string} Text displayed without estimating a replacement.
 */
const supplied = (value) => value || "Not supplied in this snapshot";

/**
 * Display the author, date, basis and available fingerprint of a source record.
 * @param {{author?: string, as_of?: string, basis?: string, source_sha256?: string}} row - Source provenance fields.
 * @returns {HTMLDivElement} Detached provenance block.
 */
function source(row) {
  const box = el("div", undefined, "brief-source");
  box.append(
    el("p", supplied(row.author) + " · " + supplied(row.as_of), "caption"),
  );
  if (row.basis) box.append(el("p", row.basis, "caption"));
  if (row.source_sha256)
    box.append(
      el("p", "Source fingerprint: " + row.source_sha256, "fingerprint"),
    );
  return box;
}

/**
 * Link only the project associations stated by the owning source.
 * @param {string[]} ids - Stable identities; an empty list means group-wide scope.
 * @returns {HTMLParagraphElement} Association statement and native project links.
 */
function projects(ids) {
  const box = el("p", undefined, "brief-associations");
  box.append(
    document.createTextNode("Project associations stated in source: "),
  );
  if (!ids.length)
    box.append(document.createTextNode("group-wide; no project allocation"));
  ids.forEach((id, i) => {
    if (i) box.append(document.createTextNode("; "));
    box.append(R_projectLink(id));
  });
  return box;
}

/**
 * Render a source need with its use, quantities and acquisition boundary.
 * @param {import('../../types/atlas.js').ResourceNeed} row - Original dated source record.
 * @returns {HTMLElement} Detached source record card.
 */
function need(row) {
  const box = el("article", undefined, "brief-record");
  box.dataset.need = row.id;
  box.append(
    el("h3", row.need),
    el("p", row.state, "caption"),
    el("p", "Expected use stated in source: " + row.unlocks),
    facts([
      ["Quantity", supplied(row.quantity)],
      ["Price basis", supplied(row.price)],
      ["Timing", supplied(row.when)],
      ["Ownership / access", supplied(row.own_or_access)],
      ["Partner profile", supplied(row.partner_slot)],
    ]),
    projects(row.project_ids),
  );
  if (row.preliminary_price_class)
    box.append(
      el("p", "Preliminary class: " + row.preliminary_price_class),
      el("p", row.class_basis, "caption"),
    );
  box.append(
    disclosure("Current observations and source scope", [
      el("p", row.today),
      source(row),
    ]),
  );
  return box;
}

/**
 * Render a candidate alternative with its actual source-verification state.
 * @param {import('../../types/atlas.js').ResourceCandidate} row - Original dated source record.
 * @returns {HTMLElement} Detached source record card.
 */
function candidate(row) {
  const classification = row.source_read
    ? "Primary page read in dated intake; fit remains unconfirmed"
    : row.verification_state === "source-reported" || row.source_supplied
      ? "Manager source report; independent review incomplete"
      : "Preliminary option; independent review incomplete";
  /** @type {Node[]} */
  const children = [
    el("p", classification, "caption"),
    el("p", row.fit_state, "notice"),
    facts([
      ["Publisher / maker as recorded", supplied(row.maker)],
      ["Recorded purpose", supplied(row.need)],
      ["Ownership / access", supplied(row.own_or_access)],
      ["Quantity", supplied(row.quantity)],
      ["Price basis", supplied(row.price)],
    ]),
    el("p", row.catalogue_scope),
    projects(row.project_ids),
    source(row),
  ];
  if (/^https?:\/\//.test(row.source || ""))
    children.push(link("Dated source: " + row.source, row.source));
  const box = disclosure(row.item, children);
  box.dataset.acquisition = row.id;
  return box;
}

/**
 * Render a partner gap and reciprocal contribution without implying an agreement.
 * @param {import('../../types/atlas.js').BudgetPartner} row - Original dated source record.
 * @returns {HTMLElement} Detached source record card.
 */
function partner(row) {
  const box = disclosure(row.gap, [
    el("p", row.state, "notice"),
    facts([
      ["Profile sought", row.profile],
      ["Contribution and reciprocal benefit", row.brings_gains],
      ["First discussion scope", row.first_step],
    ]),
    projects(row.project_ids || []),
    source(row),
  ]);
  box.dataset.partner = row.id;
  return box;
}

/**
 * Render the original people or space estimate without combining scenarios.
 * @param {import('../../types/atlas.js').ResourceEstimate} row - Original dated source record.
 * @returns {HTMLElement} Detached source record card.
 */
function estimate(row) {
  const box = disclosure(row.title, [
    el("p", row.kind + " · " + row.state, "notice"),
    facts(Object.entries(row.values)),
    projects(row.project_ids),
    source(row),
  ]);
  box.dataset.estimate = row.id;
  return box;
}

/** Render the source-backed need, candidate, partner and estimate record cards. */
const supportRecords = { need, candidate, partner, estimate };
export { supportRecords };
