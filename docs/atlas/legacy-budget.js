// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Preliminary budget and shared-resource guide

"use strict";
/** @type {import('../../types/atlas.js').BudgetData} */
const data = JSON.parse(
  /** @type {string} */ (
    /** @type {HTMLScriptElement} */ (document.getElementById("budget-data"))
      .textContent
  ),
);
/**
 * Create a detached native HTML element and insert source text without parsing markup.
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} tag - Native tag name.
 * @param {string | number | null} [text] - Plain source value; omitted text leaves an empty element.
 * @param {string} [cls] - CSS class names.
 * @returns {HTMLElementTagNameMap[K]} The element, owned by the calling view.
 */
const el = (tag, text, cls) => {
  const n = document.createElement(tag);
  if (text !== undefined) n.textContent = String(text);
  if (cls) n.className = cls;
  return n;
};
/**
 * Format a source euro amount, including decimal strings retained by the source capture.
 * @param {number|string} n - Original amount in euros.
 * @returns {string} British-English currency presentation, or an explicit missing-value statement.
 */
const euro = (n) => {
  const value = typeof n === "number" ? n : Number(n.trim() || Number.NaN);
  if (!Number.isFinite(value)) return "Not supplied";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
};
const scenario = /** @type {HTMLSelectElement} */ (
    document.getElementById("scenario")
  ),
  family = /** @type {HTMLSelectElement} */ (document.getElementById("family"));
/**
 * Present one source quantity with its own label and units.
 * @param {string} label - Source metric name.
 * @param {string|number} value - Original or display-formatted source value.
 * @returns {HTMLDivElement} Detached metric; scenarios are not combined.
 */
function metric(label, value) {
  const n = el("div", undefined, "metric");
  n.append(el("div", label, "small"), el("strong", value));
  return n;
}
/**
 * Render original source rows as a native table without interpreting free-text units.
 * @param {string[]} headers - Visible source column names.
 * @param {(string|number|null|undefined)[][]} rows - Original source values in column order.
 * @returns {HTMLDivElement} Scrollable table retaining the source row order.
 */
function table(headers, rows) {
  const wrap = el("div", undefined, "table-wrap"),
    t = el("table"),
    head = el("thead"),
    tr = el("tr");
  for (const h of headers) tr.append(el("th", h));
  head.append(tr);
  const body = el("tbody");
  for (const values of rows) {
    const tr = el("tr");
    for (const value of values) tr.append(el("td", String(value)));
    body.append(tr);
  }
  t.append(head, body);
  wrap.append(t);
  return wrap;
}
/** Show only the chosen preliminary scenario, its original allocations and interpretation limits. */
function show() {
  const s = data.scenarios.find((s) => s.id === scenario.value);
  const view = /** @type {HTMLDivElement} */ (
    document.getElementById("scenario-view")
  );
  view.replaceChildren();
  if (!s) {
    view.append(
      el("p", "No scenario is available for this selection.", "notice"),
    );
    return;
  }
  view.append(
    el("p", s.state, "notice"),
    el(
      "p",
      s.author +
        " · inspected " +
        s.as_of +
        (s.source_date ? " · source case " + s.source_date : ""),
      "small",
    ),
  );
  const metrics = el("div", undefined, "metrics");
  metrics.append(
    metric("Scenario total · preliminary", euro(s.total_eur)),
    metric("Duration", s.months + " months"),
    metric("Effort · not headcount", s.person_months + " person-months"),
  );
  view.append(metrics, el("p", s.limits));
  if (s.annualised_eur && !s.effort_profile)
    view.append(
      el(
        "p",
        "Annualised duration average: " +
          euro(s.annualised_eur) +
          ". First-year cash timing is still to be derived.",
        "small",
      ),
    );
  if (s.effort_profile) {
    view.append(
      el("h3", "First-team effort · preliminary"),
      table(
        ["Months", "Full-time equivalents", "Role scope"],
        s.effort_profile.map((p) => [p.months, p.fte, p.scope]),
      ),
      el("p", s.effort_profile_basis, "small"),
    );
  }
  if (s.milestones) {
    const list = el("ol");
    for (const text of s.milestones) list.append(el("li", text));
    view.append(
      el("h3", "First-year targets"),
      list,
      el("p", s.milestone_basis, "small"),
    );
  }
  const bars = el("div", undefined, "categories");
  for (const [name, amount] of Object.entries(s.categories)) {
    const row = el("div", undefined, "bar-row"),
      track = el("div", undefined, "track"),
      fill = el("div", undefined, "fill");
    fill.style.width = (100 * Number(amount)) / Number(s.total_eur) + "%";
    track.append(fill);
    row.append(el("span", name), track, el("span", euro(amount), "money"));
    bars.append(row);
  }
  view.append(bars);
  if (s.hardware_cash_eur) {
    const box = el("div", undefined, "notice");
    box.append(
      el("h3", "Hardware-only cash and allocation"),
      el("p", "Purchase cash assumption: " + euro(s.hardware_cash_eur)),
      el(
        "p",
        "Hardware allocated to the project in this source case: " +
          (s.hardware_allocated_eur === undefined
            ? "Not supplied"
            : euro(s.hardware_allocated_eur)),
      ),
      el(
        "p",
        "These hardware-only figures differ from the full equipment category, which can contain other items.",
        "small",
      ),
    );
    if (s.commissioning_note) box.append(el("p", s.commissioning_note));
    view.append(box);
  }
  if (s.blocks.length) {
    const d = el("details");
    d.append(
      el("summary", "Work blocks / packages"),
      table(
        ["Work block", "Source allocation"],
        s.blocks.map((b) => [
          b.name + (b.start ? " · months " + b.start + "–" + b.end : ""),
          euro(b.total_eur),
        ]),
      ),
    );
    view.append(d);
  }
  if (s.lines.length) {
    const d = el("details");
    d.append(
      el("summary", "Line items and planning quantities"),
      table(
        [
          "Line",
          "Category",
          "Planning quantity",
          "Unit estimate",
          "Line estimate",
        ],
        s.lines.map((l) => [
          l.line,
          l.category,
          l.quantity,
          euro(l.unit_cost_eur),
          euro(l.total_eur),
        ]),
      ),
      el(
        "p",
        "Category A: personnel (quantity in person-months); B: subcontracting; C: purchases. Quantities are scenario assumptions, not institute inventory. Unit estimates are displayed rounded to cents; line totals retain the source calculation from full-precision inputs.",
        "small",
      ),
    );
    view.append(d);
  }
  if (s.hardware_slices.length) {
    const d = el("details");
    d.append(
      el("summary", "Staged hardware use"),
      table(
        [
          "Item",
          "Payment / purchase month",
          "Acceptance month",
          "Work package",
          "Use months",
          "Allocated estimate",
        ],
        s.hardware_slices.map((h) => [
          h.item,
          h.payment_month || h.purchase_month,
          h.commissioned_month || "Not specified",
          h.wp,
          h.use_start + "–" + h.use_end,
          euro(h.eligible_depreciation_EUR),
        ]),
      ),
    );
    view.append(d);
  }
  history.replaceState(null, "", "#scenario=" + encodeURIComponent(s.id));
}
/**
 * Populate one source family and restore a known scenario identity where supplied.
 * @param {string|null} [selected] - Original scenario identity; unknown values use the first available case.
 * @returns {void} Rebuild options from the source before displaying a scenario.
 */
function populate(selected) {
  scenario.replaceChildren();
  for (const s of data.scenarios.filter((s) => s.family === family.value)) {
    const o = el("option", s.title + " · " + euro(s.total_eur));
    o.value = s.id;
    scenario.append(o);
  }
  if (selected && [...scenario.options].some((o) => o.value === selected))
    scenario.value = selected;
  show();
}
family.addEventListener("change", () => populate());
scenario.addEventListener("change", show);
for (const h of data.hardware_basis) {
  /** @type {Partial<Record<string,string>>} Public names for the recorded hardware classes. */
  const names = {
    node: "Metered compute node",
    boards_meters: "Boards and energy meters",
    workstation: "Research workstation",
  };
  const card = metric(names[h.item] || h.item, euro(h.purchase_estimate_eur));
  card.append(
    el("p", h.state, "small"),
    el("p", h.author + " · " + h.as_of, "small"),
  );
  /** @type {HTMLDivElement} */ (document.getElementById("hardware")).append(
    card,
  );
}
for (const item of data.shared) {
  const card = el("article", undefined, "card");
  card.append(
    el("span", "Preliminary shared use", "badge"),
    el("h3", item.name),
    el("p", item.quantity),
    el("p", item.state, "small"),
  );
  const p = el("p");
  for (const group of item.groups) {
    const a = el(
      "a",
      group +
        (item.optional_groups?.includes(group) ? " · optional, later" : ""),
    );
    a.href = "resources.html#group=" + encodeURIComponent(group);
    p.append(a, document.createTextNode(" "));
  }
  card.append(p);
  for (const note of item.scope_notes || [])
    card.append(el("p", note, "small"));
  for (const note of item.owner_scope_notes || [])
    card.append(el("p", note.group + ": " + note.state, "small"));
  const d = el("details");
  d.append(el("summary", "Related needs and candidate budget lines"));
  if (item.related_needs.length) {
    const list = el("ul");
    for (const n of item.related_needs) {
      const li = el("li", n.need);
      for (const id of n.project_ids) {
        const a = el("a", id);
        a.href = "index.html#project=" + encodeURIComponent(id);
        li.append(document.createTextNode(" "), a);
      }
      list.append(li);
    }
    d.append(list);
  } else d.append(el("p", "Detailed project needs still to be joined."));
  if (item.candidate_budget_lines.length) {
    const list = el("ul");
    for (const line of item.candidate_budget_lines) {
      const li = el("li"),
        a = el(
          "a",
          line.scenario_id.split("_")[0] +
            " · " +
            line.line +
            " · " +
            euro(line.total_eur),
        );
      a.href = "#scenario=" + encodeURIComponent(line.scenario_id);
      a.addEventListener("click", (e) => {
        e.preventDefault();
        family.value = "Institute";
        populate(line.scenario_id);
        /** @type {HTMLDivElement} */ (
          document.getElementById("scenario-view")
        ).scrollIntoView({ block: "start" });
      });
      li.append(a);
      list.append(li);
    }
    d.append(list);
  } else
    d.append(
      el(
        "p",
        "No explicit budget line joined yet; a missing line is not assumed funded.",
      ),
    );
  card.append(d);
  for (const f of item.owner_feedback || []) {
    const review = el("details");
    review.append(
      el("summary", f.author + " review · preliminary"),
      el("p", f.state, "small"),
      el("p", "Project scope: " + f.project_scope),
      el("p", "First expected output: " + f.first_expected_output),
      el("p", "Acceptance criterion: " + f.acceptance_criterion),
      el("p", "Quantity basis: " + f.quantity_basis),
      el("p", "Dedicated/shared and own/access: " + f.dedication_access),
      el("p", f.timing),
      el("p", f.author + " · " + f.as_of, "small"),
    );
    card.append(review);
  }
  card.append(el("p", item.author + " · " + item.as_of, "small"));
  /** @type {HTMLDivElement} */ (document.getElementById("shared")).append(
    card,
  );
}
for (const f of data.dedicated_facilities || []) {
  const card = el("article", undefined, "card");
  card.append(
    el("span", f.state, "badge"),
    el("h3", f.need),
    el("p", f.basis),
    el("p", f.author + " · " + f.as_of, "small"),
  );
  for (const id of f.project_ids) {
    const a = el("a", id);
    a.href = "index.html#project=" + encodeURIComponent(id);
    card.append(a);
  }
  /** @type {HTMLDivElement} */ (document.getElementById("dedicated")).append(
    card,
  );
}
/** @type {HTMLParagraphElement} */ (
  document.getElementById("external-scope")
).textContent = data.external_user_service_scope || "";
for (const n of data.external_user_services || []) {
  const card = el("article", undefined, "card");
  card.append(el("h3", n.need), el("p", n.author + " · " + n.as_of, "small"));
  for (const id of n.project_ids) {
    const a = el("a", id);
    a.href = "index.html#project=" + encodeURIComponent(id);
    card.append(a);
  }
  /** @type {HTMLDivElement} */ (document.getElementById("external")).append(
    card,
  );
}
for (const n of data.additional_shared_room_proposals || []) {
  const card = el("article", undefined, "card");
  card.append(
    el("h3", n.name),
    el("p", n.area),
    el("p", n.scope),
    el("p", n.state, "small"),
    el("p", n.author + " · " + n.as_of, "small"),
  );
  /** @type {HTMLDivElement} */ (
    document.getElementById("additional-rooms")
  ).append(card);
}
for (const slot of data.partner_slots || []) {
  const card = el("article", undefined, "card");
  card.append(
    el("span", "Source-reported gap", "badge"),
    el("h3", slot.gap),
    el("p", slot.state, "small"),
    el("p", slot.project_scope),
    el("p", "Partner profile: " + slot.profile),
    el("p", slot.brings_gains),
    el("p", "First proposal: " + slot.first_step),
  );
  for (const id of slot.project_ids) {
    const a = el("a", id);
    a.href = "index.html#project=" + encodeURIComponent(id);
    card.append(a, document.createTextNode(" "));
  }
  card.append(el("p", slot.author + " · " + slot.as_of, "small"));
  /** @type {HTMLDivElement} */ (document.getElementById("partners")).append(
    card,
  );
}
for (const text of data.open_items)
  /** @type {HTMLUListElement} */ (document.getElementById("open")).append(
    el("li", text),
  );
/** @type {HTMLParagraphElement} */ (
  document.getElementById("overlap")
).textContent = "Potential overlap: " + data.overlap.scope;
const selected = new URLSearchParams(location.hash.slice(1)).get("scenario"),
  initial = data.scenarios.find((s) => s.id === selected);
if (initial) family.value = initial.family;
populate(selected || "P_preseed_first_team_12_months");
