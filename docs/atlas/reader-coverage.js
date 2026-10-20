// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Supplied source fields and project coverage navigation

import {
  requireRecord,
  atlas as R_atlas,
  badge as R_badge,
  button as R_button,
  clear as R_clear,
  groupName as R_groupName,
  groups as R_groups,
  resources as R_resources,
  el,
  link,
  href,
} from "@atlas/reader-core";
import { directSourceRecords as R_directSourceRecords } from "@atlas/reader-direct-sources";
import { unknown as R_unknown } from "@atlas/reader-views";

/** @type {import('../../types/atlas.js').UpdateData} */
const annex = JSON.parse(
  /** @type {string} */ (
    /** @type {HTMLScriptElement} */ (
      document.getElementById("source-update-data")
    ).textContent
  ),
);
/** @type {import('../../types/atlas.js').VisualData} */
const visuals = JSON.parse(
  /** @type {string} */ (
    /** @type {HTMLScriptElement} */ (document.getElementById("visual-data"))
      .textContent
  ),
);
const annexIds = new Set(annex.projects.map((row) => row.project_id));
/**
 * Distinguish an actual source text field from an absent or empty value.
 * @param {unknown} text - Value supplied by an output record.
 * @returns {boolean} Whether non-whitespace source text is present.
 */
const hasText = (text) => typeof text === "string" && text.trim().length > 0;
const rows = R_atlas.nodes.map((node) => {
  const outputs = node.dossier?.expected_outputs || [];
  return {
    node,
    outputs: outputs.length,
    acceptance: outputs.filter((row) => hasText(row.acceptance)).length,
    qualification: outputs.filter((row) =>
      hasText(row.qualification_requirements),
    ).length,
    profiles: node.dossier?.partner_needs?.length || 0,
    proposals: node.partner_slots?.length || 0,
    needs: R_resources.needs.filter((row) => row.project_ids.includes(node.id))
      .length,
    documents: R_directSourceRecords.get(node.id)?.documents.length || 0,
    annex: annexIds.has(node.id),
    visuals: visuals.illustrations.filter((row) => row.project === node.id)
      .length,
  };
});
/**
 * Source-field filters retain the distinction between absent records and incomplete fields.
 * @type {[string, [string, (row: (typeof rows)[number]) => boolean]][]}
 */
const filterEntries = [
  ["", ["All source entries", () => true]],
  [
    "direct",
    ["Direct repository document not captured", (row) => !row.documents],
  ],
  [
    "outputs",
    ["Expected-output records not supplied", (row) => row.outputs === 0],
  ],
  [
    "qualification",
    [
      "Output qualification text incomplete",
      (row) => row.outputs > 0 && row.qualification < row.outputs,
    ],
  ],
  [
    "partners",
    [
      "Partner profiles or proposals not supplied",
      (row) => !row.profiles && !row.proposals,
    ],
  ],
  [
    "formal-partners",
    ["Formal partner proposals not supplied", (row) => !row.proposals],
  ],
  [
    "needs",
    ["Project-specific requirement rows not supplied", (row) => !row.needs],
  ],
  [
    "annex",
    ["Additional master annex record not supplied", (row) => !row.annex],
  ],
  ["visuals", ["Project illustration not supplied", (row) => !row.visuals]],
];
const filters = new Map(filterEntries);

/**
 * Quote a displayed source field and reject spreadsheet formula interpretation.
 * @param {unknown} value - Original display value.
 * @returns {string} One quoted CSV cell.
 */
function csvCell(value) {
  const text = String(value);
  const safe = /^[=+\-@\t\r\n]/.test(text) ? "'" + text : text;
  return '"' + safe.replaceAll('"', '""') + '"';
}

/**
 * Download exactly the displayed source-coverage rows without adding procurement totals.
 * @param {typeof rows} selected - Current filtered rows from the actual atlas.
 * @returns {void} The native CSV download retains source identities.
 */
function exportRows(selected) {
  /** @type {(string | number)[][]} Original header and source count rows. */
  const values = [
    [
      "project_id",
      "project_name",
      "owning_groups",
      "output_records",
      "acceptance_text_records",
      "qualification_text_records",
      "partner_profile_records",
      "formal_partner_proposal_records",
      "project_requirement_records",
      "additional_master_annex",
      "illustration_records",
      "direct_repository_documents",
      "project_source_date",
    ],
  ];
  for (const row of selected)
    values.push([
      row.node.id,
      row.node.name,
      row.node.owning_groups.join("; "),
      row.outputs,
      row.acceptance,
      row.qualification,
      row.profiles,
      row.proposals,
      row.needs,
      Number(row.annex),
      row.visuals,
      row.documents,
      row.node.as_of || "",
    ]);
  const body =
    "\uFEFF" +
    values.map((row) => row.map(csvCell).join(",")).join("\r\n") +
    "\r\n";
  const url = URL.createObjectURL(
    new Blob([body], { type: "text/csv;charset=utf-8" }),
  );
  const a = link("", url);
  a.download = "ANULUM_supplied_source_fields.csv";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/**
 * Link the original entry to each supplied or missing source-detail family.
 * @param {(typeof rows)[number]} row - Counts derived from the original source datasets.
 * @returns {HTMLTableRowElement} Source-detail comparison row.
 */
function tableRow(row) {
  const tr = el("tr");
  tr.dataset.coverageProject = row.node.id;
  const name = el("th");
  name.scope = "row";
  name.append(
    R_badge(row.node.work_status),
    link(row.node.name, href({ project: row.node.id })),
    el("p", row.node.owning_groups.map(R_groupName).join("; "), "caption"),
  );
  const outputs = el("td");
  outputs.append(
    link(
      row.outputs
        ? row.outputs +
            (row.outputs === 1 ? " output record" : " output records")
        : "Not supplied",
      href({ project: row.node.id, tab: "outputs" }),
    ),
    el(
      "p",
      row.acceptance +
        (row.acceptance === 1
          ? " acceptance text field · "
          : " acceptance text fields · ") +
        row.qualification +
        (row.qualification === 1
          ? " detailed qualification field"
          : " detailed qualification fields"),
      "caption",
    ),
  );
  const partners = el("td");
  partners.append(
    link(
      row.profiles +
        (row.profiles === 1 ? " profile · " : " profiles · ") +
        row.proposals +
        (row.proposals === 1 ? " formal proposal" : " formal proposals"),
      href({ view: "support", entry: row.node.id }),
    ),
    el(
      "p",
      row.profiles || row.proposals
        ? "Source-reported scope; fit and commitments separate"
        : "No profile or proposal supplied",
      "caption",
    ),
  );
  const needs = el("td");
  needs.append(
    link(
      row.needs
        ? row.needs + (row.needs === 1 ? " associated row" : " associated rows")
        : "No project-specific rows",
      href({ view: "support", entry: row.node.id }),
    ),
    el("p", "Group-wide context remains separate", "caption"),
  );
  const source = el("td");
  source.append(
    link(
      row.annex ? "Additional record supplied" : "Not in this annex",
      href({ project: row.node.id, tab: "sources" }),
    ),
  );
  const direct = el("td");
  direct.append(
    link(
      row.documents
        ? row.documents +
            (row.documents === 1
              ? " document / source file captured"
              : " documents / source files captured")
        : "No selected document captured",
      href({ project: row.node.id, tab: "sources" }),
    ),
  );
  const image = el("td");
  image.append(
    link(
      row.visuals
        ? row.visuals +
            (row.visuals === 1
              ? " supplied illustration"
              : " supplied illustrations")
        : "Not supplied",
      href({ project: row.node.id, tab: "visuals" }),
    ),
  );
  for (const cell of [outputs, partners, needs, source, image])
    if (
      cell.textContent.startsWith("Not supplied") ||
      cell.textContent.startsWith("Not in this annex")
    )
      cell.classList.add("coverage-not-supplied");
  tr.append(name, outputs, partners, needs, source, image, direct);
  return tr;
}

/**
 * Filter recorded source fields without turning counts into readiness scores.
 * @param {URLSearchParams} params - Public programme, missing-field and text filters.
 * @returns {void} The comparison replaces the current reading surface.
 */
function coverageView(params) {
  const requestedGroup = params.get("programme") || "",
    requestedMissing = params.get("missing") || "";
  if (
    (requestedGroup && !R_groups.has(requestedGroup)) ||
    !filters.has(requestedMissing)
  )
    return R_unknown();
  const root = R_clear([["Supplied source details", null]]);
  root.append(
    el("p", "Understand the source snapshot", "eyebrow"),
    el("h1", "Which details are supplied?"),
    el(
      "p",
      "Compare the descriptions, requirements and illustrations supplied for each project, then open its source details or partnership brief.",
      "lede",
    ),
    el(
      "p",
      "Counts describe fields in dated documents. They do not assess specificity, scientific validity, completed acceptance or readiness. A missing project row does not mean the owning programme has no resources or work.",
      "notice",
    ),
  );
  const summary = el("div", undefined, "brief-counts");
  for (const [count, label] of [
    [rows.length, "retained source entries"],
    [
      rows.filter((row) => row.outputs).length,
      "entries with expected-output records",
    ],
    [
      rows.filter((row) => row.profiles || row.proposals).length,
      "entries with partner profiles or proposals",
    ],
    [annexIds.size, "entries with an additional master record"],
  ]) {
    const item = el("div");
    item.append(el("strong", String(count)), el("p", label));
    summary.append(item);
  }
  root.append(
    el(
      "p",
      "Across the baseline dated snapshot; direct repository capture has its own UTC timestamp",
      "caption",
    ),
    summary,
  );
  const form = el("form", undefined, "visual-filters");
  form.setAttribute("role", "search");
  form.setAttribute("aria-label", "Source coverage filters");
  const search = el("input");
  search.type = "search";
  search.id = "coverage-search";
  search.value = params.get("q") || "";
  const programme = el("select");
  programme.id = "coverage-programme";
  const all = el("option", "All owning programmes");
  all.value = "";
  programme.append(all);
  for (const group of R_atlas.groups) {
    const option = el("option", R_groupName(group.id));
    option.value = group.id;
    programme.append(option);
  }
  programme.value = requestedGroup;
  const missing = el("select");
  missing.id = "coverage-missing";
  for (const [key, [label]] of filters) {
    const option = el("option", label);
    option.value = key;
    missing.append(option);
  }
  missing.value = requestedMissing;
  for (const [
    labelText,
    input,
  ] of /** @type {[string, HTMLInputElement | HTMLSelectElement][]} */ ([
    ["Project name, purpose or owner", search],
    ["Owning programme", programme],
    ["Source field to inspect", missing],
  ])) {
    const field = el("div"),
      label = el("label", labelText);
    label.htmlFor = input.id;
    field.append(label, input);
    form.append(field);
  }
  form.append(
    R_button("Clear filters", () => {
      search.value = "";
      programme.value = "";
      missing.value = "";
      update();
      search.focus();
    }),
  );
  const count = el("p", undefined, "coverage-count");
  count.setAttribute("role", "status");
  count.setAttribute("aria-live", "polite");
  const download = R_button("Export displayed rows (.csv)", () =>
    exportRows(selected),
  );
  const empty = el(
    "p",
    "No entries match these source filters. Clear the filters or choose another source field.",
    "missing",
  );
  const wrap = el("div", undefined, "coverage-table-wrap");
  wrap.tabIndex = 0;
  wrap.setAttribute("role", "region");
  wrap.setAttribute("aria-label", "Supplied source field comparison");
  const table = el("table", undefined, "coverage-table");
  const caption = el("caption", "Dated source fields for the selected entries");
  const head = el("thead"),
    titles = el("tr");
  for (const title of [
    "Project and recorded owners",
    "Outputs and acceptance text",
    "Partner scope",
    "Project requirements",
    "Master source annex",
    "Illustrations",
    "Direct repository sources",
  ]) {
    const th = el("th", title);
    th.scope = "col";
    titles.append(th);
  }
  head.append(titles);
  const body = el("tbody");
  table.append(caption, head, body);
  wrap.append(table);
  root.append(
    form,
    count,
    download,
    empty,
    wrap,
    el(
      "p",
      "Owner filtering includes every recorded owner, including jointly owned projects. Shared requirements, scenario costs and people/space proposals are not added into totals.",
      "caption",
    ),
    el(
      "p",
      "The master annex has two family-context rows held separately; they are not added as project identities. Original source admission and independent/publication reviews remain separate.",
      "caption",
    ),
  );
  /** @type {typeof rows} Current source rows, never an accumulated purchase total. */
  let selected = [];
  /** Reapply the selected source-field predicate and retain its shareable route. */
  function update() {
    const query = search.value.trim().toLowerCase(),
      predicate = requireRecord(filters.get(missing.value))[1];
    selected = rows.filter(
      (row) =>
        (!programme.value ||
          row.node.owning_groups.includes(programme.value)) &&
        predicate(row) &&
        (!query ||
          [
            row.node.id,
            row.node.name,
            row.node.function,
            row.node.dossier?.purpose,
            ...row.node.owning_groups.map(R_groupName),
          ]
            .join(" ")
            .toLowerCase()
            .includes(query)),
    );
    body.replaceChildren(...selected.map(tableRow));
    count.textContent =
      selected.length + " of " + rows.length + " source entries";
    empty.hidden = selected.length !== 0;
    wrap.hidden = selected.length === 0;
    history.replaceState(
      null,
      "",
      href({
        view: "coverage",
        ...(programme.value ? { programme: programme.value } : {}),
        ...(missing.value ? { missing: missing.value } : {}),
        ...(search.value ? { q: search.value } : {}),
      }),
    );
  }
  form.addEventListener("submit", (event) => event.preventDefault());
  form.addEventListener("input", update);
  form.addEventListener("change", update);
  update();
}

export { coverageView };
