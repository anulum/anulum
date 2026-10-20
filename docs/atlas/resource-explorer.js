// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Resource explorer, shareable filters and downloads

import { render as renderResourceCoverage } from "@atlas/resource-coverage";
import {
  VIEWS,
  readSelection,
  selectionHash,
  selectedRecords,
  verificationLabel,
  selectionCsv,
  selectionFilename,
} from "@atlas/resource-inventory";

/** @type {import('../../types/atlas.js').ResourceData} */
const data = JSON.parse(
  /** @type {string} */ (
    /** @type {HTMLScriptElement} */ (document.getElementById("resource-data"))
      .textContent
  ),
);
const byGroup = new Map(data.groups.map((group) => [group.id, group]));
const controls = {
  group: /** @type {HTMLSelectElement} */ (document.getElementById("group")),
  scope: /** @type {HTMLSelectElement} */ (document.getElementById("scope")),
  kind: /** @type {HTMLSelectElement} */ (document.getElementById("kind")),
  verification: /** @type {HTMLSelectElement} */ (
    document.getElementById("verification")
  ),
  search: /** @type {HTMLInputElement} */ (document.getElementById("search")),
};
const results = /** @type {HTMLDivElement} */ (
  document.getElementById("results")
);
const counter = /** @type {HTMLParagraphElement} */ (
  document.getElementById("counter")
);
const download = /** @type {HTMLButtonElement} */ (
  document.getElementById("download-selection")
);
const selectionLink = /** @type {HTMLAnchorElement} */ (
  document.getElementById("selection-link")
);
/** @type {HTMLElement} */ (document.querySelector("main")).prepend(
  renderResourceCoverage(data),
);
const views = {
  needs: "Resource needs",
  candidates: "Acquisition candidates",
  people: "People",
  spaces: "Spaces",
};
let selection = readSelection(location.hash, data);

/**
 * Create a detached native HTML element and insert source text without parsing markup.
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} tag - Native tag name.
 * @param {string | number | null} [text] - Plain source value; omitted text leaves an empty element.
 * @param {string} [cls] - CSS class names.
 * @returns {HTMLElementTagNameMap[K]} The element, owned by the calling view.
 */
function element(tag, text, cls) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = String(text);
  if (cls) node.className = cls;
  return node;
}

/**
 * Show source project associations without assigning group-wide records to a project.
 * @param {HTMLElement} block - Parent card owned by this renderer.
 * @param {import('./resource-inventory.js').InventoryRecord} record - Source inventory row.
 * @returns {void} Append native source links or the explicit group-wide statement.
 */
function projectLinks(block, record) {
  if (!record.project_ids.length) {
    block.append(element("p", "Group-wide requirement"));
    return;
  }
  const paragraph = element("p");
  for (const id of record.project_ids) {
    const link = element("a", id);
    link.href = "index.html#project=" + encodeURIComponent(id);
    paragraph.append(link, document.createTextNode(" "));
  }
  block.append(paragraph);
}

/**
 * Keep supplied names and values together without interpreting free-text units.
 * @param {HTMLElement} block - Parent source card.
 * @param {(string | number | null | undefined)[][]} pairs - Field names and original values.
 * @returns {void} Append a native definition list.
 */
function factList(block, pairs) {
  const facts = element("dl", undefined, "facts");
  for (const [key, value] of pairs)
    facts.append(element("dt", key), element("dd", value));
  block.append(facts);
}

/**
 * Render one record from the currently selected source population.
 * @param {import('./resource-inventory.js').InventoryRecord} record - Original need, candidate or estimate.
 * @returns {HTMLElement} A source-bound card with no inferred purchase or supplier fit.
 */
function recordCard(record) {
  const planning = ["people", "spaces"].includes(selection.view);
  const candidate = selection.view === "candidates";
  const card = element("article", undefined, candidate ? "candidate" : "need");
  card.dataset.recordId = record.id;
  card.append(
    element("span", byGroup.get(record.group)?.name || record.group, "badge"),
    element(
      "h3",
      planning ? record.title : candidate ? record.item : record.need,
    ),
  );
  projectLinks(card, record);
  if (planning) {
    card.append(element("p", record.state, "notice"));
    factList(
      card,
      Object.entries(record.values || {}).filter(
        ([key]) => !["Post", "Role", "Room"].includes(key),
      ),
    );
    card.append(element("p", record.basis, "sources"));
  } else if (candidate) {
    card.append(
      element("span", verificationLabel(record, selection.view), "badge"),
      element("p", record.maker),
      element("p", record.need),
      element("p", record.catalogue_scope),
      element("p", record.fit_state),
    );
    factList(card, [
      ["Own / access", record.own_or_access],
      ["Quantity", record.quantity],
      ["Price / estimate", record.price],
    ]);
    if (record.source) {
      const link = element(
        "a",
        record.source_read
          ? "Primary source; independently read " + record.as_of
          : "Group-supplied source; review scope above",
      );
      link.href = record.source;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      card.append(link);
    } else {
      card.append(
        element(
          "p",
          "Maker/product name from preliminary planning; catalogue check pending.",
          "sources",
        ),
      );
    }
  } else {
    card.append(element("p", "Enables: " + record.unlocks));
    factList(card, [
      ["Kind", record.kind],
      ["Stage", record.when],
      ["Quantity", record.quantity],
      ["Price", record.price],
      ["Partner slot", record.partner_slot],
      ["Own / access", record.own_or_access || "Choice being agreed"],
      ["Preliminary class", record.preliminary_price_class || "Not supplied"],
    ]);
    const detail = element("details");
    detail.append(
      element("summary", "Current evidence and source basis"),
      element("p", record.today),
      element("p", record.basis, "sources"),
      element("p", record.class_basis || "", "sources"),
      element("p", "Source SHA-256 " + record.source_sha256, "sources"),
    );
    card.append(detail);
  }
  card.append(
    element(
      "p",
      (record.author || "Owning group") + " · " + record.as_of,
      "sources",
    ),
  );
  return card;
}

/**
 * Restore controls, records and download state from the sanitised public selection.
 * @param {''|'push'|'replace'} [historyMode] - Optional native history operation.
 * @returns {void} Active selections do not duplicate history entries.
 */
function render(historyMode = "") {
  controls.group.value = selection.group;
  controls.scope.value = selection.scope;
  controls.kind.value = selection.kind;
  controls.verification.value = selection.verification;
  controls.search.value = selection.q;
  controls.kind.disabled = selection.view !== "needs";
  controls.verification.disabled = selection.view !== "candidates";
  for (const [view, title] of Object.entries(views)) {
    const tab = /** @type {HTMLButtonElement} */ (
      document.getElementById(view + "-tab")
    );
    tab.setAttribute("aria-pressed", String(view === selection.view));
    tab.textContent = title;
  }
  const rows = selectedRecords(data, selection);
  const planning = ["people", "spaces"].includes(selection.view);
  counter.textContent =
    rows.length +
    " matching " +
    (selection.view === "candidates"
      ? "acquisition records"
      : planning
        ? "preliminary planning records"
        : "requirements") +
    "; overlapping uses are not a purchase total";
  results.replaceChildren(...rows.map(recordCard));
  if (planning) results.prepend(element("p", data.people_and_spaces, "notice"));
  if (!rows.length)
    results.append(
      element(
        "p",
        "No records match these filters. Reset filters to see the inventory.",
        "empty",
      ),
    );
  const target = location.pathname + location.search + selectionHash(selection);
  const current = location.pathname + location.search + location.hash;
  const historyAction = historyMode === "push" ? "pushState" : "replaceState";
  if (historyMode && target !== current)
    history[historyAction](null, "", target);
  selectionLink.href = target;
  download.disabled = !rows.length;
  download.textContent = "Download " + rows.length + " records as CSV";
}

/**
 * Apply a user selection through the same public fragment parser used on reload.
 * @param {import('./resource-inventory.js').Selection} next - Requested source selection.
 * @param {'push'|'replace'} [historyMode] - Input changes replace; discrete actions push.
 * @returns {void} Unsupported filter values are discarded by the public parser.
 */
function choose(next, historyMode = "push") {
  selection = readSelection(selectionHash(next), data);
  render(historyMode);
}

for (const group of data.groups) {
  const option = element("option", group.name);
  option.value = group.id;
  controls.group.append(option);
  const card = element("article", undefined, "group-card");
  card.append(
    element("h3", group.name),
    element("p", group.resource_inventory_state),
  );
  card.append(
    element(
      "p",
      data.needs.filter((row) => row.group === group.id).length +
        " supplied needs · " +
        data.candidates.filter((row) => row.group === group.id).length +
        " acquisition planning records",
    ),
  );
  const button = element("button", "Explore this group");
  button.type = "button";
  button.addEventListener("click", () => {
    choose({ ...selection, group: group.id });
    results.scrollIntoView({ block: "start" });
  });
  card.append(button);
  if (group.starting_priorities) {
    const detail = element("details"),
      list = element("ol");
    detail.append(element("summary", "Where to start; preliminary"));
    for (const text of group.starting_priorities.items)
      list.append(element("li", text));
    detail.append(
      list,
      element("p", group.starting_priorities.state, "sources"),
      element(
        "p",
        group.starting_priorities.author +
          " · " +
          group.starting_priorities.as_of,
        "sources",
      ),
    );
    card.append(detail);
  }
  /** @type {HTMLDivElement} */ (document.getElementById("groups")).append(
    card,
  );
}
for (const kind of [
  ...new Set(
    data.needs.flatMap((row) => row.kind.split(";").map((x) => x.trim())),
  ),
].sort()) {
  const option = element("option", kind);
  option.value = kind;
  controls.kind.append(option);
}
for (const id of /** @type {const} */ ([
  "group",
  "scope",
  "kind",
  "verification",
])) {
  controls[id].addEventListener("change", () =>
    choose({ ...selection, [id]: controls[id].value }),
  );
}
controls.search.addEventListener("input", () =>
  choose({ ...selection, q: controls.search.value }, "replace"),
);
for (const view of VIEWS) {
  /** @type {HTMLButtonElement} */ (
    document.getElementById(view + "-tab")
  ).addEventListener("click", () => choose({ ...selection, view }));
}
/** @type {HTMLButtonElement} */ (
  document.getElementById("reset-selection")
).addEventListener("click", () =>
  choose({
    ...selection,
    group: "",
    scope: "",
    kind: "",
    verification: "",
    q: "",
  }),
);
download.addEventListener("click", () => {
  if (!selectedRecords(data, selection).length) return;
  const blob = new Blob(
    [selectionCsv(data, selection, new URL(selectionLink.href).href)],
    { type: "text/csv;charset=utf-8" },
  );
  const url = URL.createObjectURL(blob);
  const link = element("a");
  link.href = url;
  link.download = selectionFilename(data, selection);
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
/** Restore a native back/forward or hash selection without creating another history entry. */
function restore() {
  selection = readSelection(location.hash, data);
  render();
}
window.addEventListener("popstate", restore);
window.addEventListener("hashchange", restore);
/** @type {HTMLParagraphElement} */ (
  document.getElementById("dated")
).textContent =
  "Updated " +
  new Date(data.as_of).toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }) +
  " UTC · Source-bound snapshot";
render("replace");
