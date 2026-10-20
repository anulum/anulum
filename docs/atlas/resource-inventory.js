// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Resource selection and source-preserving CSV

/**
 * @typedef {'needs'|'candidates'|'people'|'spaces'} InventoryView
 * @typedef {{view: InventoryView, group: string, scope: string, kind: string,
 * verification: string, q: string}} Selection
 * @typedef {Pick<import('../../types/atlas.js').ResourceNeed, 'id'|'group'|'project_ids'|'as_of'> &
 * Partial<import('../../types/atlas.js').ResourceNeed & import('../../types/atlas.js').ResourceCandidate &
 * import('../../types/atlas.js').ResourceEstimate>} InventoryRecord
 * @typedef {InventoryRecord & {kind: string}} NeedRecord
 * @typedef {{as_of: string, scope: string, people_and_spaces: string,
 * groups: {id: string, name: string}[], needs: NeedRecord[],
 * candidates: InventoryRecord[], planning_estimates: InventoryRecord[]}} InventoryData
 */

/** @type {readonly InventoryView[]} Supported source populations. */
export const VIEWS = Object.freeze(["needs", "candidates", "people", "spaces"]);
/** @type {readonly (keyof Selection)[]} Supported route parameters. */
const PARAMETERS = Object.freeze([
  "view",
  "group",
  "scope",
  "kind",
  "verification",
  "q",
]);
const VERIFICATIONS = Object.freeze([
  "independent",
  "source-reported",
  "preliminary-memory",
]);

export const CSV_COLUMNS = Object.freeze([
  "record_type",
  "record_id",
  "group_id",
  "group_name",
  "project_ids",
  "title",
  "quantity",
  "price",
  "planning_values",
  "state",
  "verification",
  "source_date",
  "source_url",
  "source_sha256",
  "author",
  "source_basis",
  "snapshot_as_of",
  "selection_url",
  "source_record_json",
]);

/**
 * Read supported filters and discard values that do not apply to the selected view.
 * @param {string} hash - Public inventory fragment.
 * @param {InventoryData} data - Captured group and resource records.
 * @returns {Selection} Supported filters with unknown values discarded.
 */
export function readSelection(hash, data) {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  const requestedView = params.get("view");
  const view = /** @type {InventoryView} */ (
    VIEWS.find((item) => item === requestedView) || "needs"
  );
  const kinds = new Set(
    data.needs.flatMap((row) => row.kind.split(";").map((x) => x.trim())),
  );
  const group = params.get("group") || "";
  const scope = params.get("scope") || "";
  const kind = params.get("kind") || "";
  const verification = params.get("verification") || "";
  return {
    view,
    group: data.groups.some((item) => item.id === group) ? group : "",
    scope: ["project", "group-wide"].includes(scope) ? scope : "",
    kind: view === "needs" && kinds.has(kind) ? kind : "",
    verification:
      view === "candidates" && VERIFICATIONS.includes(verification)
        ? verification
        : "",
    q: params.get("q") || "",
  };
}

/**
 * Serialise the complete selection into a reusable fragment.
 * @param {Selection} selection - Validated inventory view and filters.
 * @returns {string} Reusable URL fragment.
 */
export function selectionHash(selection) {
  const params = new URLSearchParams();
  for (const key of PARAMETERS) {
    if (selection[key] && (key !== "view" || selection.view !== "needs")) {
      params.set(key, selection[key]);
    }
  }
  return params.size ? "#" + params.toString() : "";
}

/**
 * Select real source records without deduplicating or summing acquisition alternatives.
 * @param {InventoryData} data - Captured group and resource records.
 * @param {Selection} selection - Validated inventory view and filters.
 * @returns {InventoryRecord[]} Matching original records, preserving acquisition alternatives.
 */
export function selectedRecords(data, selection) {
  const planning = ["people", "spaces"].includes(selection.view);
  const population = planning
    ? data.planning_estimates.filter(
        (row) =>
          row.kind === (selection.view === "people" ? "people" : "space"),
      )
    : selection.view === "candidates"
      ? data.candidates
      : data.needs;
  const query = selection.q.trim().toLowerCase();
  return population.filter(
    (row) =>
      (!selection.group || row.group === selection.group) &&
      (!query || JSON.stringify(row).toLowerCase().includes(query)) &&
      (!selection.scope ||
        (selection.scope === "group-wide"
          ? !row.project_ids.length
          : row.project_ids.length > 0)) &&
      (selection.view !== "needs" ||
        !selection.kind ||
        (row.kind || "")
          .split(";")
          .map((x) => x.trim())
          .includes(selection.kind)) &&
      (selection.view !== "candidates" ||
        !selection.verification ||
        (selection.verification === "independent"
          ? row.source_read === true
          : row.verification_state === selection.verification)),
  );
}

/**
 * Describe the source check; it never represents a purchased or installed item.
 * @param {InventoryRecord} record - Original captured resource row.
 * @param {InventoryView} view - Current source population.
 * @returns {string} Source verification wording for the selected population.
 */
export function verificationLabel(record, view) {
  if (view !== "candidates") return "Owning-group source report";
  if (record.source_read) return "Primary page independently read";
  return record.verification_state === "source-reported"
    ? "Preliminary source report"
    : "Preliminary; catalogue check pending";
}

/**
 * Export the visible records as quoted UTF-8 CSV, retaining every original field in JSON.
 * Spreadsheet formula markers are escaped in display cells. Source JSON stays exact.
 * @param {InventoryData} data - Captured group and resource records.
 * @param {Selection} selection - Validated inventory view and filters.
 * @param {string} selectionUrl - Public URL reproducing the exported selection.
 * @returns {string} UTF-8 CSV with source JSON retained in every row.
 */
export function selectionCsv(data, selection, selectionUrl) {
  const groups = new Map(data.groups.map((group) => [group.id, group.name]));
  const rows = selectedRecords(data, selection).map((record) => [
    selection.view,
    record.id,
    record.group,
    groups.get(record.group) || record.group,
    JSON.stringify(record.project_ids),
    record.title || record.item || record.need || "",
    record.quantity || "",
    record.price || "",
    JSON.stringify(record.values || {}),
    record.state || record.fit_state || "",
    verificationLabel(record, selection.view),
    record.as_of,
    record.source || "",
    record.source_sha256 || "",
    record.author || "",
    record.basis || "",
    data.as_of,
    selectionUrl,
    JSON.stringify(record),
  ]);
  /**
   * Quote a display cell while preventing spreadsheet formula interpretation.
   * @param {unknown} value - Display cell; source JSON is retained separately.
   * @returns {string} Quoted CSV with spreadsheet formula markers escaped.
   */
  const quote = (value) => {
    let text = String(value);
    if (/^[\s\uFEFF]*[=+\-@]/u.test(text) || /^[\t\r\n]/.test(text))
      text = "'" + text;
    return '"' + text.replaceAll('"', '""') + '"';
  };
  return (
    "\uFEFF" +
    [CSV_COLUMNS, ...rows].map((row) => row.map(quote).join(",")).join("\r\n") +
    "\r\n"
  );
}

/**
 * Give the downloaded view a bounded filename with the original snapshot date.
 * @param {InventoryData} data - Captured group and resource records.
 * @param {Selection} selection - Validated inventory view and filters.
 * @returns {string} Bounded download name containing the snapshot date.
 */
export function selectionFilename(data, selection) {
  const group = (selection.group || "all-groups")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-");
  return (
    "anulum-" +
    group +
    "-" +
    selection.view +
    "-" +
    data.as_of.slice(0, 10) +
    ".csv"
  );
}
