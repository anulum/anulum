// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Shared-resource and budget associations

import {
  budget as R_budget,
  clear as R_clear,
  groupName as R_groupName,
  money as R_money,
  nodes as R_nodes,
  projectLink as R_projectLink,
  resources as R_resources,
  el,
  link,
  facts,
  disclosure,
} from "@atlas/reader-core";
import { render as renderResourceCoverage } from "@atlas/resource-coverage";

/**
 * Show supplied project associations and the explicit group-wide alternative.
 * @param {string[] | undefined} ids - Source project identities.
 * @returns {HTMLDivElement} Project links in source order.
 */
function projectLinks(ids) {
  const box = el("div", undefined, "project-links");
  for (const id of ids || [])
    if (R_nodes.has(id)) box.append(R_projectLink(id));
  if (!box.children.length)
    box.append(
      el("p", "Group-wide scope; no project allocation asserted.", "caption"),
    );
  return box;
}
/**
 * Join a shared-resource proposal to its separately supplied scenario lines.
 * @param {import('../../types/atlas.js').BudgetShared} item - Shared source proposal.
 * @param {string} chosenScenario - Exact scenario identity; empty includes separate alternatives.
 * @returns {HTMLElement} Resource card with explicit reconciliation limits.
 */
function sharedCard(item, chosenScenario) {
  const box = el("article", undefined, "shared-card");
  box.id = "resource-" + item.id;
  box.append(
    el("h2", item.name),
    el("p", item.state, "notice"),
    facts([
      ["Quantity / capacity", item.quantity],
      ["Groups named in source", item.groups.map(R_groupName).join("; ")],
    ]),
  );
  for (const note of item.scope_notes || []) box.append(el("p", note));
  for (const note of item.owner_scope_notes || [])
    box.append(el("p", R_groupName(note.group) + ": " + note.state, "caption"));
  const related = el("section");
  related.append(el("h3", "Related requirements and expected uses"));
  if (!item.related_needs?.length)
    related.append(
      el("p", "No direct requirement association supplied.", "missing"),
    );
  for (const need of item.related_needs || []) {
    const source = R_resources.needs.find((n) => n.id === need.id),
      detail = [el("p", need.need), projectLinks(need.project_ids)];
    if (source)
      detail.push(
        el("p", "Enables: " + source.unlocks),
        el("p", source.quantity, "caption"),
      );
    related.append(disclosure(need.id, detail));
  }
  box.append(related);
  const feedback = el("section", undefined, "owner-feedback");
  feedback.append(el("h3", "Owner feedback and decisions still required"));
  for (const panel of item.owner_feedback || []) {
    feedback.append(
      disclosure(
        R_groupName(panel.group),
        [
          facts([
            ["Project scope", panel.project_scope || "Scope being clarified"],
            [
              "First expected output",
              panel.first_expected_output || "Not specified",
            ],
            [
              "Acceptance criterion",
              panel.acceptance_criterion || "Not specified",
            ],
            ["Quantity basis", panel.quantity_basis || "Not specified"],
            [
              "Dedicated / shared / access",
              panel.dedication_access || "Not specified",
            ],
            ["Timing", panel.timing || "No timing supplied"],
          ]),
          el("p", panel.state, "caption"),
          el("p", panel.author + " · " + panel.as_of, "caption"),
        ],
        false,
      ),
    );
  }
  box.append(feedback);
  const associations = (item.candidate_budget_lines || []).filter(
    (line) => !chosenScenario || line.scenario_id === chosenScenario,
  );
  const cost = el("section");
  cost.append(el("h3", "Candidate budget associations"));
  cost.append(
    el(
      "p",
      "Associations are editorial joins to separate source scenarios, not assigned funding, reconciled procurement or an additive total.",
      "caption",
    ),
  );
  for (const association of associations) {
    const scenario = R_budget.scenarios.find(
      (s) => s.id === association.scenario_id,
    );
    cost.append(
      el("p", association.line + " · " + R_money(association.total_eur)),
      el("p", scenario?.title || association.scenario_id, "caption"),
    );
  }
  if (!associations.length)
    cost.append(
      el(
        "p",
        "No budget association is supplied in the selected scenario.",
        "missing",
      ),
    );
  box.append(
    cost,
    link("Read complete budget scenarios", "budget.html"),
    el("p", item.author + " · " + item.as_of, "caption"),
  );
  return box;
}
/**
 * Open resource coverage, shared proposals and separate scenario associations.
 * @param {string} [target] - Optional resource identity to highlight.
 * @returns {void} The route replaces the current content surface.
 */
function resourceView(target = "") {
  const root = R_clear([["Shared resources", null]]);
  root.append(
    el("p", "Understand what support enables", "eyebrow"),
    el("h1", "Needs, shared resources and expected uses"),
    el(
      "p",
      "Follow a source requirement to the projects it serves and the separate preliminary budget cases associated with it. Shared ownership and capacity remain subject to the owners’ decisions.",
      "lede",
    ),
  );
  root.append(renderResourceCoverage(R_resources));
  const summary = el("div", undefined, "intent-grid");
  for (const [count, title] of [
    [R_budget.shared.length, "shared-resource families"],
    [R_budget.dedicated_facilities.length, "dedicated requirements"],
    [R_budget.external_user_services.length, "external-user services"],
  ]) {
    const box = el("div", undefined, "intent-card");
    box.append(el("strong", String(count), "stat-number"), el("p", title));
    summary.append(box);
  }
  root.append(summary);
  const controls = el("div", undefined, "search-form");
  const label = el("label", "Compare budget associations within one scenario");
  label.htmlFor = "shared-scenario";
  const select = el("select");
  select.id = "shared-scenario";
  const all = el("option", "All separate source scenarios");
  all.value = "";
  select.append(all);
  for (const scenario of R_budget.scenarios) {
    const option = el("option", scenario.title);
    option.value = scenario.id;
    select.append(option);
  }
  controls.append(label, select);
  const cards = el("div", undefined, "shared-list");
  const draw = () => {
    cards.replaceChildren(
      ...R_budget.shared.map((item) => sharedCard(item, select.value)),
    );
  };
  select.addEventListener("change", draw);
  root.append(controls, cards);
  draw();
  root.append(el("h2", "Dedicated requirements"));
  const dedicated = el("div", undefined, "project-grid");
  for (const item of R_budget.dedicated_facilities) {
    const box = el("article", undefined, "project-card");
    box.append(
      el("h3", item.need),
      el("p", item.state, "caption"),
      el(
        "p",
        item.basis ||
          "Dedicated resource scope; quantities and timing remain to be established.",
      ),
      projectLinks(item.project_ids),
    );
    dedicated.append(box);
  }
  root.append(dedicated, el("h2", "External-user services"));
  const external = el("div", undefined, "project-grid");
  for (const item of R_budget.external_user_services) {
    const box = el("article", undefined, "project-card");
    box.append(
      el("h3", item.need),
      projectLinks(item.project_ids),
      el(
        "p",
        "Rented customer-facing service; separate from internal institute infrastructure.",
        "caption",
      ),
    );
    external.append(box);
  }
  root.append(external, el("h2", "People, spaces and acquisition detail"));
  root.append(
    el(
      "p",
      "Staffing and room entries are preliminary scenario records. Overlapping shared roles, facilities and equipment require reconciliation before a total is stated. The additional room proposals refer to existing room scenarios.",
      "notice",
    ),
    link(
      "Explore the complete equipment, people and space inventory →",
      "resources.html",
    ),
    el("p", R_budget.scope, "caption"),
  );
  if (target) {
    const chosen = [...cards.children].find(
      (n) => n.id === "resource-" + target,
    );
    if (chosen) {
      chosen.classList.add("highlight");
      requestAnimationFrame(() => chosen.scrollIntoView({ block: "start" }));
    }
  }
}

export { resourceView };
