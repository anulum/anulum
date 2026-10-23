// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Programme hierarchy and guided reading

import {
  requireRecord,
  atlas as R_atlas,
  clear as R_clear,
  disclosure as R_disclosure,
  groupName as R_groupName,
  groups as R_groups,
  list as R_list,
  nodes as R_nodes,
  programmeDescriptions as R_programmeDescriptions,
  projectLink as R_projectLink,
  resources as R_resources,
  search as R_search,
  el,
  link,
  href,
  badge,
  projectCard,
} from "@atlas/reader-core";

/**
 * Build the programme heading with its supplied purpose and reading context.
 * @param {string} eyebrow - Context label.
 * @param {string} title - Main heading.
 * @param {string} text - Introductory source scope.
 * @returns {HTMLDivElement} Detached heading block.
 */
const heading = (eyebrow, title, text) => {
  const box = el("div", undefined, "page-heading");
  box.append(
    el("p", eyebrow, "eyebrow"),
    el("h1", title),
    el("p", text, "lede"),
  );
  return box;
};
/** Render the programme overview and its source-bound reading routes. */
function overview() {
  const root = R_clear();
  const hero = el("section", undefined, "hero");
  hero.append(
    heading(
      "Research programme · work in progress",
      "Understand the whole. Explore your part.",
      "Explore by domain, follow the work each project enables, and find the expertise and resources it needs.",
    ),
  );
  const miniature = el("div", undefined, "domain-navigation");
  miniature.append(
    el("p", "Six research domains · choose a starting point", "caption"),
  );
  for (const [id, [name]] of Object.entries(R_programmeDescriptions)) {
    const item = link(name, href({ group: id }), "domain-tile");
    item.style.setProperty(
      "--group-color",
      requireRecord(R_groups.get(id)).color,
    );
    miniature.append(item);
  }
  miniature.append(
    el(
      "p",
      "Navigation overview. Technical interfaces have their own source scope in each project.",
      "caption",
    ),
  );
  hero.append(miniature);
  root.append(hero);
  const paths = el("section", undefined, "intent-grid");
  /** @type {Array<[string, string, string, Record<string, string>]>} Public reading intents and their routes. */
  const intents = [
    [
      "Understand",
      "The whole programme",
      "Start with domains, then inspect projects and interfaces.",
      { view: "guides" },
    ],
    [
      "Collaborate",
      "Where can I contribute?",
      "Search descriptions, reported partner needs and resource proposals.",
      { view: "partners" },
    ],
    [
      "Fund",
      "What would support enable?",
      "Inspect resource-to-project links and separate preliminary budget scenarios.",
      { view: "resources" },
    ],
  ];
  for (const [label, title, description, target] of intents) {
    const card = el("article", undefined, "intent-card");
    card.append(
      el("p", label, "eyebrow"),
      el("h2", title),
      el("p", description),
      link("Explore →", href(target)),
    );
    paths.append(card);
  }
  root.append(paths, el("h2", "Research programmes"));
  const grid = el("section", undefined, "programme-grid");
  for (const [id, [name, description]] of Object.entries(
    R_programmeDescriptions,
  )) {
    const group = requireRecord(R_groups.get(id)),
      members = R_atlas.nodes.filter((n) => n.group === id);
    const count = R_resources.needs.filter((n) => n.group === id).length;
    const card = el("article", undefined, "programme-card");
    card.style.setProperty("--group-color", group.color);
    const title = el("h2");
    title.append(link(name, href({ group: id })));
    card.append(badge(), title, el("p", description));
    card.append(
      el(
        "p",
        members.length +
          " atlas entries · " +
          (id === "SCIENTIFIC-DISCOVERY-AND-EXPERIMENTATION"
            ? "resource inputs under dedicated review"
            : count + " supplied needs"),
        "caption",
      ),
    );
    card.append(
      link("Explore this programme →", href({ group: id }), "action-link"),
    );
    grid.append(card);
  }
  root.append(grid, el("h2", "Programme context"));
  const context = el("div", undefined, "context-links");
  for (const id of ["ANULUM-COMPANY-OPERATIONS", "WEBMASTER"]) {
    context.append(link(R_groupName(id), href({ group: id })));
  }
  context.append(
    link("Explore the map by level", href({ view: "map" })),
    link(
      "All " + R_atlas.nodes.length + " source entries",
      href({ view: "search" }),
    ),
    link("Compare supplied source details", href({ view: "coverage" })),
    link(
      "Systems and programme figures",
      href({ view: "guides", section: "figures" }),
    ),
  );
  root.append(context);
}
/**
 * Group existing source kinds for navigation without adding architecture ownership.
 * @param {string} kind - Source-recorded entry kind.
 * @returns {string} Navigation family.
 */
const family = (kind) => {
  if (["package", "workbench", "workbench module", "service"].includes(kind))
    return "Software foundations and services";
  if (["component", "conditional architecture destination"].includes(kind))
    return "Components in development";
  if (["tool", "shared", "research instrument"].includes(kind))
    return "Tools and research instruments";
  return "Research and programme context";
};
/**
 * Open a programme and its source entries, retaining source kind families.
 * @param {string} id - Exact programme identity.
 * @returns {void} The route replaces the current content surface.
 */
function group(id) {
  const g = R_groups.get(id);
  if (!g) return unknown();
  const root = R_clear([[R_groupName(id), null]]);
  root.append(
    heading(
      g.name,
      R_groupName(id),
      R_programmeDescriptions[id]?.[1] ||
        "Explore the source entries and programme context owned by this group.",
    ),
  );
  root.append(
    badge(),
    el(
      "p",
      g.ownership_note ||
        "Group responsibility follows the dated source inventory.",
      "notice",
    ),
  );
  const resourceGroup = R_resources.groups.find((x) => x.id === id);
  if (resourceGroup?.starting_priorities) {
    root.append(
      R_disclosure("Where to start · preliminary sequence", [
        R_list(resourceGroup.starting_priorities.items),
        el("p", resourceGroup.starting_priorities.state, "caption"),
      ]),
    );
  }
  const actions = el("div", undefined, "context-links");
  actions.append(
    link("Explore this programme in the map", href({ view: "map", group: id })),
    link("Resource needs", "resources.html#group=" + encodeURIComponent(id)),
    link(
      "Technical atlas for this group",
      "atlas_full.html#group=" + encodeURIComponent(id),
    ),
    link("Search in this programme", href({ view: "search", scope: id })),
  );
  root.append(actions);
  const members = R_atlas.nodes.filter((n) => n.group === id);
  for (const category of [...new Set(members.map((n) => family(n.kind)))]) {
    const section = el("section", undefined, "family-section");
    section.append(el("h2", category));
    const grid = el("div", undefined, "project-grid");
    for (const node of members.filter((n) => family(n.kind) === category))
      grid.append(projectCard(node));
    section.append(grid);
    root.append(section);
  }
}
/**
 * Render the source search with optional partner and programme context.
 * @param {boolean} [partners] - Present partner-oriented reading guidance.
 * @param {string} [scope] - Initially selected programme identity.
 * @param {string} [initial] - Initial source search phrase.
 */
function searchView(partners = false, scope = "", initial = "") {
  const root = R_clear([[partners ? "Partner fit" : "Search", null]]);
  root.append(
    heading(
      partners ? "Explore collaboration" : "Search the atlas",
      partners
        ? "Your expertise, connected to the work"
        : "Find a project, function or resource",
      "Search existing descriptions and reported requirements, then open a project partnership brief to read its outputs, requested contributions and separate resource proposals. Matches do not establish operational readiness or validated partner fit.",
    ),
  );
  const form = el("div", undefined, "search-form");
  const label = el("label", "Area of expertise, project or resource");
  label.htmlFor = "reader-search";
  const input = el("input");
  input.id = "reader-search";
  input.type = "search";
  input.value = initial;
  input.placeholder = "Try plasma, FPGA, measurement, runtime…";
  const groupLabel = el("label", "Programme");
  groupLabel.htmlFor = "reader-search-group";
  const select = el("select");
  select.id = "reader-search-group";
  const all = el("option", "All groups");
  all.value = "";
  select.append(all);
  for (const g of R_atlas.groups) {
    const option = el("option", R_groupName(g.id));
    option.value = g.id;
    select.append(option);
  }
  select.value = scope;
  form.append(label, input, groupLabel, select);
  const count = el("p", "", "caption");
  count.setAttribute("aria-live", "polite");
  const grid = el("div", undefined, "project-grid search-results");
  /** Refresh source matches for the entered phrase and selected programme. */
  function update() {
    const hits = R_search(input.value, select.value);
    grid.replaceChildren();
    count.textContent = hits.length + " matching source entries";
    if (!hits.length)
      grid.append(
        el("p", "No matching entry. Try another term or programme.", "missing"),
      );
    for (const node of hits) grid.append(projectCard(node));
  }
  input.addEventListener("input", update);
  select.addEventListener("change", update);
  root.append(form, count, grid);
  update();
}
const guides = [
  {
    id: "reactor",
    title: "Reactor models, geometry and evidence",
    group: "SCPN-REACTOR-SYSTEMS",
    description:
      "Read a device model, its source-reported geometry scope, and the separate geometry and result-record requirements.",
    steps: [
      ["SCPN-TOKAMAK-CORE", "Device model and geometry"],
      ["SCPN-REACTOR-KERNELS", "Shared kernel scope"],
      ["REACTOR-GEOMETRY-WITNESS", "Geometry evidence requirements"],
      ["REACTOR-RUN-PACK", "Retained result records"],
    ],
  },
  {
    id: "neuro",
    title: "From neural modelling to hardware evidence",
    group: "SC-NEUROMORPHIC-COMPUTING-SYSTEMS",
    description:
      "Inspect the workbench, compiler output proposals, hardware target scope and distinct verification requirements.",
    steps: [
      ["SC-NEUROCORE", "Workbench scope"],
      ["SC-NC-COMPILER", "Compiler outputs"],
      ["SC-NC-HARDWARE", "Hardware target scope"],
      ["SC-NC-VERIFY", "Verification requirements"],
    ],
  },
  {
    id: "quantum",
    title: "Quantum modelling and result provenance",
    group: "SCPN-QUANTUM-COMPUTING-SYSTEMS",
    description:
      "Read the modelling scope, source-reported review limitations and the proposed result and conformance tools.",
    steps: [
      ["SCPN-QUANTUM-CONTROL", "Workbench and review limits"],
      ["SCPN-QC-SIM", "Simulation scope"],
      ["QPU-RESULT-PACK", "Result provenance scope"],
      ["CONFORMANCE-WITNESS", "Conformance scope"],
    ],
  },
];
/** Render the three guided reading sequences and their source figures. */
function guidedPaths() {
  const root = R_clear([["Guided paths", null]]);
  root.append(
    heading(
      "Follow an outcome",
      "Three ways into the programme",
      "These are guided reading routes. Each project states its own current scope, intended outputs and qualification requirements; a reading sequence is not an exercised integration.",
    ),
  );
  for (const guide of guides) {
    const section = el("section", undefined, "guide");
    section.id = "guide-" + guide.id;
    section.style.setProperty(
      "--group-color",
      requireRecord(R_groups.get(guide.group)).color,
    );
    section.append(el("h2", guide.title), el("p", guide.description));
    const steps = el("ol", undefined, "guide-steps");
    for (const [id, label] of guide.steps) {
      const n = R_nodes.get(id);
      if (!n) continue;
      const step = el("li");
      step.append(
        el("p", label, "eyebrow"),
        R_projectLink(id),
        el("p", n.function),
      );
      const outputs = n.dossier?.expected_outputs || [];
      step.append(
        el(
          "p",
          outputs.length
            ? "Expected: " + outputs[0].deliverable
            : "Detailed output and acceptance specifications are being completed.",
          "caption",
        ),
      );
      steps.append(step);
    }
    section.append(steps);
    root.append(section);
  }
  const figures = el("section");
  figures.id = "figures";
  figures.append(el("h2", "Systems, funding and conditional outputs"));
  figures.append(
    el(
      "p",
      "These illustrations retain their 13 October 2026 source scope. The interactive map and project passports include later dated updates. Staffing, funding and schedule drawings remain conditional scenarios.",
      "caption",
    ),
    link("Explore the current inventory", href({ view: "map" })),
  );
  const grid = el("div", undefined, "figure-grid");
  for (const [file, title, note] of [
    [
      "F1_detailed_system_in_progress_v0.3.svg",
      "System overview",
      "Source-bound programme architecture.",
    ],
    [
      "F3_detailed_discovery_cycle_in_progress_v0.3.svg",
      "Discovery cycle",
      "Declared research-cycle scope and boundaries.",
    ],
    [
      "F4_funding_blocks_outcomes_v0.4.svg",
      "Funding routes and blocks",
      "Preliminary proposed route-to-block fit, not awards.",
    ],
    [
      "F5_conditional_timeline_v0.4.svg",
      "First-team schedule",
      "Source staffing phases and conditional year-end targets.",
    ],
  ]) {
    const card = el("figure");
    const a = link("", file);
    const image = el("img");
    image.src = file;
    image.alt = title;
    image.loading = "lazy";
    a.append(image);
    card.append(a, el("figcaption", title), el("p", note, "caption"));
    grid.append(card);
  }
  figures.append(grid);
  root.append(figures);
}
/** Render dated reader changes separately from project evidence dates. */
function history() {
  const root = R_clear([["Updates", null]]);
  root.append(
    heading(
      "A dated programme",
      "What changed in this reader",
      "Presentation changes are recorded separately from project releases, scientific validation and source-owner confirmation.",
    ),
  );
  const timeline = el("ol", undefined, "update-list");
  for (const [title, description] of [
    [
      "23 October 2026 · portfolio and resource-source refresh",
      "Updated published-source captures and project interface descriptions, incorporated the approved Discovery resource projection, and added official references for existing funding routes. Original source dates, preliminary estimates and publication exclusions remain explicit. These changes establish no new scientific result, resource acquisition or funding award.",
    ],
    [
      "13 October 2026 · reader v0.17",
      "Added an interactive map with programme, entry-family and project levels; project lookup, pan/zoom, keyboard navigation and separately selectable source/proposal relation layers. Source snapshot remains v0.13.",
    ],
    [
      "13 October 2026 · reader v0.16",
      "Added programme hierarchy, standard project passports, local interface views, guided reading routes and resource-to-project navigation. Uses the v0.13 source snapshot without new capability qualification.",
    ],
    [
      "13 October 2026 · source snapshot v0.13",
      "142 source requirements, 24 owner feedback panels, nine Quantum partner profiles and dated F4/F5 source figures. Estimates retain their own scope; separate budget scenarios are not combined.",
    ],
    [
      "13 October 2026 · Discovery input before content review",
      "The additional Discovery needs and acquisition/people/space scenarios were initially awaiting content review. Their approved dated projection is now included. The original preliminary estimates have not become measured capacity, equipment holdings or staff appointments.",
    ],
  ]) {
    const item = el("li");
    item.append(el("h2", title), el("p", description));
    timeline.append(item);
  }
  root.append(
    timeline,
    el("h2", "Project evidence dates"),
    el(
      "p",
      "Each passport displays its source date, reported release, current scope and available review notes. The date is a source timestamp, not an independent confirmation date.",
    ),
  );
}
/** Show a recovery route for a link without a known source entry. */
function unknown() {
  const root = R_clear();
  root.append(
    heading(
      "Entry not found",
      "Choose a programme or search the atlas",
      "This link does not identify a known source entry.",
    ),
  );
  root.append(link("Search all entries", href({ view: "search" })));
}

export {
  family as entryFamily,
  overview,
  group,
  searchView,
  guidedPaths,
  history,
  unknown,
};
