// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Reader data and navigation primitives

/** @type {import('../../types/atlas.js').AtlasData} */
const atlas = JSON.parse(
  /** @type {string} */ (
    /** @type {HTMLScriptElement} */ (document.getElementById("atlas-data"))
      .textContent
  ),
);
/** @type {import('../../types/atlas.js').ResourceData} */
const resources = JSON.parse(
  /** @type {string} */ (
    /** @type {HTMLScriptElement} */ (document.getElementById("resource-data"))
      .textContent
  ),
);
/** @type {import('../../types/atlas.js').BudgetData} */
const budget = JSON.parse(
  /** @type {string} */ (
    /** @type {HTMLScriptElement} */ (document.getElementById("budget-data"))
      .textContent
  ),
);
const nodes = new Map(atlas.nodes.map((n) => [n.id, n]));
const groups = new Map(atlas.groups.map((g) => [g.id, g]));
/**
 * Reject a broken cross-reference rather than silently dropping a captured source.
 * User-entered identities are checked by their route before reaching source joins.
 * @template T
 * @param {T | undefined} record - Record found by a validated source identity.
 * @returns {T} The original record, retaining its concrete type and ownership.
 * @throws {Error} A captured source references an unavailable record.
 */
const requireRecord = (record) => {
  if (record === undefined)
    throw new Error(
      "A captured source references an unavailable atlas record.",
    );
  return record;
};
/** @type {Record<string, [string, string]>} Public names and programme descriptions. */
const programmeDescriptions = {
  "SCPN-REACTOR-SYSTEMS": [
    "Reactor systems",
    "Plasma modelling, simulation and reactor design research.",
  ],
  "SC-NEUROMORPHIC-COMPUTING-SYSTEMS": [
    "Neuromorphic computing",
    "Stochastic and spiking neural models, software and hardware research.",
  ],
  "SCPN-QUANTUM-COMPUTING-SYSTEMS": [
    "Quantum computing",
    "Quantum modelling, control, compilation and analysis.",
  ],
  "SCPN-SYSTEMS-INTEGRATION-AND-CONTROL": [
    "Systems integration & control",
    "Control methods and interfaces connecting modelled systems.",
  ],
  "AGENTIC-COORDINATION-ASSURANCE-AND-CONTINUITY-SYSTEMS": [
    "Agentic systems",
    "Coordination, assurance and continuity across agent workflows.",
  ],
  "SCIENTIFIC-DISCOVERY-AND-EXPERIMENTATION": [
    "Scientific discovery",
    "Experiment orchestration and reproducible reporting across domains.",
  ],
};
/**
 * Create a native element, using textContent for source text rather than HTML.
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} tag - Native HTML element name.
 * @param {string | number | null} [text] - Plain source text; absent text leaves the element empty.
 * @param {string} [cls] - CSS class names.
 * @returns {HTMLElementTagNameMap[K]} The detached element owned by the caller.
 */
const el = (tag, text, cls) => {
  const node = document.createElement(tag);
  if (text !== undefined && text !== null) node.textContent = String(text);
  if (cls) node.className = cls;
  return node;
};
/**
 * Encode a relative atlas route that can be shared without losing its selection.
 * @param {Record<string, string>} params - Atlas selection parameters.
 * @returns {string} A relative, shareable fragment with URL-encoded values.
 */
const href = (params) => "#" + new URLSearchParams(params).toString();
/**
 * Link plain source text to a local reading route or isolated external destination.
 * @param {string} text - Visible link text.
 * @param {string} target - Relative fragment, local asset or public URL.
 * @param {string} [cls] - CSS classes.
 * @returns {HTMLAnchorElement} External links isolate their browsing context.
 */
const link = (text, target, cls) => {
  const node = el("a", text, cls);
  node.href = target;
  if (/^https?:\/\//.test(target)) {
    node.target = "_blank";
    node.rel = "noopener noreferrer";
  }
  return node;
};
/**
 * Create a native button whose click action never submits a surrounding form.
 * @param {string} text - Visible action name.
 * @param {(event: MouseEvent) => void} action - Native click action.
 * @param {string} [cls] - CSS classes.
 * @returns {HTMLButtonElement} A non-submitting button.
 */
const button = (text, action, cls) => {
  const node = el("button", text, cls);
  node.type = "button";
  node.addEventListener("click", action);
  return node;
};
/**
 * Keep supplied source statements in their original display order.
 * @param {string[]} items - Source statements in their supplied order.
 * @param {string} [cls] - CSS classes.
 * @returns {HTMLUListElement} A plain-text unordered list.
 */
const list = (items, cls) => {
  const node = el("ul", undefined, cls);
  for (const text of items) node.append(el("li", text));
  return node;
};
/**
 * Present names and original source values as a definition list.
 * @param {(string | number | null | undefined)[][]} pairs - Names and source values.
 * @returns {HTMLDListElement} A definition list retaining source order.
 */
const facts = (pairs) => {
  const node = el("dl", undefined, "facts");
  for (const [name, value] of pairs)
    node.append(el("dt", name), el("dd", value));
  return node;
};
/**
 * Expose supporting detail through native keyboard-operable disclosure controls.
 * @param {string} title - Summary visible before opening.
 * @param {Node[]} children - Owned content nodes.
 * @param {boolean} [open] - Initial disclosure state.
 * @returns {HTMLDetailsElement} A native keyboard-operable disclosure.
 */
const disclosure = (title, children, open = false) => {
  const node = el("details", undefined, "disclosure");
  node.open = open;
  node.append(el("summary", title), ...children);
  return node;
};
/**
 * Display the reported entry state separately from scientific or runtime qualification.
 * @param {string} [text] - Actual source state; programme work defaults to in progress.
 * @returns {HTMLSpanElement} The source-state label.
 */
const badge = (text = "In progress") => el("span", text, "badge");
/**
 * State an owning-group source gap without inventing a value.
 * @param {string} field - Missing owning-group field.
 * @returns {HTMLParagraphElement} Explicit absence, without invented values.
 */
const missing = (field) =>
  el("p", field + " is being specified by the owning group.", "missing");
/**
 * Identify the separately selectable architecture-proposal relationship layer.
 * @param {import('../../types/atlas.js').AtlasEdge} edge - Source relationship.
 * @returns {boolean} Whether the relation belongs to the proposal layer.
 */
const isProposal = (edge) =>
  ["architect proposal", "architect design"].includes(edge.layer || "");
/**
 * Select relationships incident to an entry while preserving their source directions.
 * @param {string} id - Exact source identity.
 * @param {boolean} [proposals] - Include separately identified architecture proposals.
 * @returns {import('../../types/atlas.js').AtlasEdge[]} Relations preserving source direction.
 */
const knownEdges = (id, proposals = false) =>
  atlas.edges.filter(
    (e) => (e.from === id || e.to === id) && (proposals || !isProposal(e)),
  );
/**
 * Resolve a public programme label while retaining unknown source identities.
 * @param {string} id - Exact programme identity.
 * @returns {string} The public programme label or original identity.
 */
const groupName = (id) =>
  programmeDescriptions[id]?.[0] || groups.get(id)?.name || id;
/**
 * Open the passport bound to a stable source identity.
 * @param {string} id - Stable project identity.
 * @param {string} [text] - Optional visible label.
 * @returns {HTMLAnchorElement} Link to the exact project passport.
 */
const projectLink = (id, text) =>
  link(text || nodes.get(id)?.name || id, href({ project: id }));
/**
 * Show an entry and its own source-reported work or funding state.
 * @param {import('../../types/atlas.js').AtlasNode} n - Actual source entry.
 * @returns {HTMLElement} Card with the entry's own work or funding state.
 */
const projectCard = (n) => {
  const card = el("article", undefined, "project-card");
  card.style.setProperty(
    "--group-color",
    groups.get(n.group)?.color || "#315d4c",
  );
  const heading = el("h3");
  card.append(badge(n.work_status), el("p", n.kind, "eyebrow"), heading);
  heading.append(projectLink(n.id));
  card.append(
    el("p", n.function),
    el("p", n.phase, "caption"),
    link(
      "Partnership brief →",
      href({ view: "support", entry: n.id }),
      "brief-link",
    ),
  );
  return card;
};
/**
 * Index the supplied purpose, outputs, partner and resource terms as plain text.
 * @param {import('../../types/atlas.js').AtlasNode} n - Source entry.
 * @returns {string} Case-normalised supplied purpose, outputs and resource terms.
 */
const searchText = (n) => {
  const d = n.dossier || {};
  return JSON.stringify([
    n.id,
    n.function,
    n.kind,
    d.purpose,
    d.inputs,
    d.outputs,
    d.expected_outputs,
    d.partner_needs,
    n.partner_slots,
    n.resource_needs?.map((r) => [r.need, r.unlocks]),
    n.resource_candidates?.map((r) => [r.item, r.need]),
  ]).toLowerCase();
};
const searchIndex = new Map(atlas.nodes.map((n) => [n.id, searchText(n)]));
/**
 * Search the cached source text within an optional owning programme.
 * @param {string} term - Plain query, matched against supplied fields.
 * @param {string} [group] - Optional exact owning programme.
 * @returns {import('../../types/atlas.js').AtlasNode[]} Matching source entries in source order.
 */
const search = (term, group = "") =>
  atlas.nodes.filter(
    (n) =>
      (!group || n.group === group) &&
      /** @type {string} */ (searchIndex.get(n.id)).includes(
        term.trim().toLowerCase(),
      ),
  );
/**
 * Replace the reading surface and its native breadcrumb trail together.
 * @param {[string, string | null][]} [crumbs] - Ancestors in display order.
 * @returns {HTMLElement} Cleared content surface after replacing its breadcrumb trail.
 */
const clear = (crumbs = []) => {
  const content = /** @type {HTMLDivElement} */ (
    document.getElementById("content")
  );
  content.replaceChildren();
  const nav = /** @type {HTMLElement} */ (
    document.getElementById("breadcrumbs")
  );
  nav.replaceChildren(link("Programme", href({ view: "overview" })));
  for (const [name, target] of crumbs)
    nav.append(
      el("span", " / "),
      target ? link(name, target) : el("span", name),
    );
  return content;
};
/**
 * Format one source amount in euros without aggregating alternative scenarios.
 * @param {string | number} amount - Source amount in euros.
 * @returns {string} Locale-formatted amount, without combining scenarios.
 */
const money = (amount) =>
  "€" +
  new Intl.NumberFormat("en-GB", { maximumFractionDigits: 2 }).format(
    Number(amount),
  );
/** @type {{cleanup: (() => void) | null}} Map observer ownership across route changes. */
export const mapLifecycle = { cleanup: null };

export {
  atlas,
  resources,
  budget,
  nodes,
  groups,
  requireRecord,
  programmeDescriptions,
  el,
  href,
  link,
  button,
  list,
  facts,
  disclosure,
  badge,
  missing,
  isProposal,
  knownEdges,
  groupName,
  projectLink,
  projectCard,
  search,
  clear,
  money,
};
