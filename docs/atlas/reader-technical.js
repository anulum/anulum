// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Technical explanation and current source routing

import {
  requireRecord,
  badge as R_badge,
  clear as R_clear,
  groupName as R_groupName,
  groups as R_groups,
  nodes as R_nodes,
  projectLink as R_projectLink,
  el,
  href,
  link,
} from "@atlas/reader-core";
import { documentView as R_documentView } from "@atlas/reader-document-view";
import { technicalPanel as R_technicalPanel } from "@atlas/reader-technical-content";

/** @type {import('../../types/atlas.js').TechnicalData} */
const data = JSON.parse(
  /** @type {string} */ (
    /** @type {HTMLScriptElement} */ (document.getElementById("technical-data"))
      .textContent
  ),
);
const guides = new Map(data.guides.map((guide) => [guide.project_id, guide]));
const references = new Map(data.references.map((row) => [row.id, row]));
const projects = new Map(
  data.library.projects.map((row) => [row.project_id, row]),
);
/**
 * Link a source explanation or exact supporting document and line.
 * @param {string} entry - Stable source identity.
 * @param {string} [document] - Captured document label.
 * @param {number} [line] - One-based source line.
 * @returns {string} A shareable relative reading route.
 */
const technicalSourceHref = (entry, document, line) =>
  document
    ? href({
        view: "technical-source",
        entry,
        document,
        ...(line ? { line: String(line) } : {}),
      })
    : href({ view: "technical", ...(entry ? { entry } : {}) });
/**
 * Search source-backed system explanations or open one exact guide.
 * @param {URLSearchParams} params - Public technical route selection.
 * @returns {void} The reading surface is replaced.
 */
function technicalView(params) {
  const entry = params.get("entry") || "";
  const root = R_clear([
    ["Technical explanations", entry ? href({ view: "technical" }) : null],
  ]);
  if (!entry) {
    root.append(
      el("h1", "Understand how the systems work"),
      el(
        "p",
        "Follow inputs, result artefacts, component responsibilities and documented project connections back to the source passages.",
        "lede",
      ),
      el("p", data.state, "notice"),
      link("Compare systems side by side →", href({ view: "compare" })),
    );
    const programme = params.get("programme") || "";
    if (programme && !R_groups.has(programme)) {
      root.append(
        el(
          "p",
          "This owning programme is not present in this atlas.",
          "missing",
        ),
      );
      return;
    }
    const form = el("form", undefined, "document-search"),
      query = el("input"),
      owner = el("select");
    query.id = "technical-query";
    query.type = "search";
    query.value = params.get("q") || "";
    query.placeholder = "Project, inputs, artefacts, components or connections";
    const queryLabel = el("label", "Search technical explanations");
    queryLabel.htmlFor = query.id;
    owner.id = "technical-owner";
    const ownerLabel = el("label", "Owning programme");
    ownerLabel.htmlFor = owner.id;
    const all = el("option", "All programmes");
    all.value = "";
    owner.append(all);
    for (const [id] of R_groups) {
      const option = el("option", R_groupName(id));
      option.value = id;
      owner.append(option);
    }
    owner.value = programme;
    const clear = el("button", "Clear filters");
    clear.type = "button";
    form.append(queryLabel, query, ownerLabel, owner, clear);
    const grid = el("div", undefined, "technical-guide-grid"),
      count = el("p", undefined, "caption");
    count.setAttribute("role", "status");
    /** Apply literal text and owning-programme filters to the captured guides. */
    function update() {
      grid.replaceChildren();
      const q = query.value.trim().toLowerCase();
      let matches = 0;
      for (const [id, guide] of guides) {
        const node = requireRecord(R_nodes.get(id));
        if (owner.value && !node.owning_groups.includes(owner.value)) continue;
        /** @type {import('../../types/atlas.js').ExplanationRecord[]} Source search fields, in display order. */
        const records = [guide.purpose, guide.scope];
        /** @type {Array<Exclude<keyof import('../../types/atlas.js').TechnicalGuide, 'project_id' | 'purpose' | 'scope'>>} */
        const sections = [
          "implementation",
          "inputs",
          "outputs",
          "components",
          "connections",
          "limits",
          "external_roles",
          "model_layers",
          "source_notes",
        ];
        for (const key of sections) records.push(...(guide[key] || []));
        const text = [
          id,
          node.name,
          ...node.owning_groups.map(R_groupName),
          ...records.flatMap((row) => [
            row.title || "",
            row.project_id || "",
            row.text,
          ]),
        ]
          .join("\n")
          .toLowerCase();
        if (q && !text.includes(q)) continue;
        matches++;
        const card = el("article", undefined, "technical-guide-card");
        card.dataset.explanationProject = id;
        const title = el("h2");
        title.append(link(node.name, href({ view: "technical", entry: id })));
        card.append(
          R_badge(node.work_status),
          title,
          el("p", node.owning_groups.map(R_groupName).join(" · "), "caption"),
          el("p", guide.purpose.text),
          link(
            "Read the explanation →",
            href({ view: "technical", entry: id }),
          ),
        );
        grid.append(card);
      }
      count.textContent =
        matches +
        " of " +
        guides.size +
        " technical explanations match these filters.";
      if (!matches)
        grid.append(
          el("p", "No technical explanation matches these filters.", "missing"),
        );
      history.replaceState(
        null,
        "",
        href({
          view: "technical",
          ...(owner.value ? { programme: owner.value } : {}),
          ...(query.value ? { q: query.value } : {}),
        }),
      );
    }
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      update();
    });
    query.addEventListener("input", update);
    owner.addEventListener("change", update);
    clear.addEventListener("click", () => {
      query.value = "";
      owner.value = "";
      update();
      query.focus();
    });
    root.append(form, count, grid);
    update();
    return;
  }
  const node = R_nodes.get(entry);
  if (!node || !guides.has(entry)) {
    root.append(
      el("h1", "Explanation unavailable"),
      el(
        "p",
        node
          ? "A source-supported explanation for this entry is being prepared. Its existing dossier and captured documents remain available."
          : "This exact project identity is not present in the atlas.",
        "missing",
      ),
    );
    if (node) root.append(R_projectLink(entry));
    return;
  }
  const panel = R_technicalPanel(node);
  root.append(R_badge(node.work_status), el("h1", node.name));
  if (panel) root.append(panel);
}
/**
 * Open the source reading projection used by technical explanations.
 * @param {URLSearchParams} params - Public technical route selection.
 * @returns {void} The reading surface is replaced.
 */
function technicalSourceView(params) {
  R_documentView(
    params,
    data.library,
    projects,
    technicalSourceHref,
    "Explanation sources",
  );
}

export {
  technicalView,
  technicalSourceView,
  technicalSourceHref,
  guides as technicalGuides,
  references as technicalReferences,
  data as technicalData,
};
