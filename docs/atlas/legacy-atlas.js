// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Complete technical atlas renderer

"use strict";
/** @type {import('../../types/atlas.js').AtlasData} */
const data = JSON.parse(
  /** @type {string} */ (
    /** @type {HTMLScriptElement} */ (document.getElementById("atlas-data"))
      .textContent
  ),
);
const byId = new Map(data.nodes.map((n) => [n.id, n]));
const svg = /** @type {SVGSVGElement} */ (document.querySelector("#atlas-svg"));
const canvas = /** @type {HTMLDivElement} */ (
  document.getElementById("canvas")
);
const detail = /** @type {HTMLElement} */ (document.getElementById("detail"));
const positions = data.layout.positions;
/** @type {string|null} Exact selected source identity, independent of filters. */
let selected = null;
let filter = "",
  query = "";
/** @type {{point:DOMPoint,matrix:DOMMatrix,view:{x:number,y:number,w:number,h:number},moved:boolean,node:string|undefined}|null} */
let drag = null;
let view = { x: 0, y: 0, w: data.layout.width, h: data.layout.height };
const ns = "http://www.w3.org/2000/svg";

/**
 * Create a detached native HTML element and insert source text without parsing markup.
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} tag - Native tag name.
 * @param {string | number | null} [text] - Plain source value; omitted text leaves an empty element.
 * @param {string} [cls] - CSS class names.
 * @returns {HTMLElementTagNameMap[K]} The element, owned by the calling view.
 */
function el(tag, text, cls) {
  const e = document.createElement(tag);
  if (text !== undefined) e.textContent = String(text);
  if (cls) e.className = cls;
  return e;
}
/**
 * Match original source fields and programme ownership without a readiness filter.
 * @param {import('../../types/atlas.js').AtlasNode} n - Original source entry.
 * @returns {boolean} Whether the current native filters include it.
 */
function visible(n) {
  return (
    (!filter || n.group === filter) &&
    (!query ||
      [
        n.name,
        n.function,
        n.phase,
        n.kind,
        ...n.owning_groups,
        JSON.stringify(n.dossier || {}),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query))
  );
}
/** Apply the current navigation camera; coordinates describe atlas layout only. */
function applyView() {
  svg.setAttribute("viewBox", `${view.x} ${view.y} ${view.w} ${view.h}`);
}
/**
 * Fit the supplied source-layout bounds to the actual viewport.
 * @param {{x:number,y:number,width:number,height:number}} b - Project or programme layout rectangle.
 * @returns {void} Keep the source layout separate from physical geometry.
 */
function fitBox(b) {
  const pad = b.width < 700 ? 190 : 60;
  const ratio = canvas.clientWidth / canvas.clientHeight;
  const w = Math.max(b.width + pad * 2, (b.height + pad * 2) * ratio),
    h = w / ratio;
  view = { x: b.x + b.width / 2 - w / 2, y: b.y + b.height / 2 - h / 2, w, h };
  applyView();
}
/** Restore the complete source-layout bounds without modifying the source selection. */
function fitAll() {
  view = { x: 0, y: 0, w: data.layout.width, h: data.layout.height };
  applyView();
}
/**
 * Zoom around a viewport fraction within the existing camera bounds.
 * @param {number} factor - Positive factor from native controls or wheel direction.
 * @param {number} [x] - Horizontal viewport fraction.
 * @param {number} [y] - Vertical viewport fraction.
 * @returns {void} Change only the navigation camera.
 */
function zoom(factor, x = 0.5, y = 0.5) {
  const nw = Math.max(250, Math.min(data.layout.width * 2, view.w * factor));
  const nh = view.h * (nw / view.w);
  view = {
    x: view.x + (view.w - nw) * x,
    y: view.y + (view.h - nh) * y,
    w: nw,
    h: nh,
  };
  applyView();
}
/**
 * Identify the distinct source-recorded architecture proposal layer.
 * @param {import('../../types/atlas.js').AtlasEdge} e - Original directed relationship.
 * @returns {boolean} Whether the source marks this relation as a proposal.
 */
function isProposal(e) {
  return ["architect proposal", "architect design"].includes(e.layer || "");
}
/** Draw only the chosen declared/proposed relationship layer incident to the current selection. */
function drawEdges() {
  const layer = /** @type {SVGGElement} */ (document.querySelector("#edges"));
  layer.replaceChildren();
  const mode = /** @type {HTMLSelectElement} */ (
    document.getElementById("edge-mode")
  ).value;
  if (mode === "none" || (!selected && mode === "selected")) return;
  for (const e of data.edges) {
    if (
      isProposal(e) &&
      !(
        /** @type {HTMLInputElement} */ (
          document.getElementById("show-proposals")
        ).checked
      )
    )
      continue;
    if (mode === "selected" && e.from !== selected && e.to !== selected)
      continue;
    const a = positions[e.from],
      b = positions[e.to];
    if (!a || !b) continue;
    const forward = a.x < b.x;
    const x1 = a.x + (forward ? a.width : 0),
      y1 = a.y + a.height / 2,
      x2 = b.x + (forward ? 0 : b.width),
      y2 = b.y + b.height / 2;
    const arch =
      isProposal(e) ||
      [
        "architecture responsibility",
        "interface in progress",
        "planned interface",
      ].includes(e.kind);
    const color =
      e.kind === "pinned contract"
        ? "#8a5b9a"
        : e.kind === "optional interface"
          ? "#4b7898"
          : arch
            ? "#a17936"
            : "#476c59";
    const path = document.createElementNS(ns, "path");
    path.setAttribute(
      "d",
      `M ${x1} ${y1} C ${x1 + (forward ? 120 : -120)} ${y1},${x2 + (forward ? -120 : 120)} ${y2},${x2} ${y2}`,
    );
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", color);
    path.setAttribute("stroke-width", mode === "all" ? "2" : "4");
    if (e.kind === "optional interface" || arch)
      path.setAttribute("stroke-dasharray", "10 7");
    path.setAttribute("marker-end", "url(#edge-arrow)");
    path.setAttribute("class", "edge");
    path.setAttribute("opacity", mode === "all" ? ".44" : ".9");
    const title = document.createElementNS(ns, "title");
    title.textContent = `${e.from} → ${e.to}: ${e.kind}`;
    path.append(title);
    layer.append(path);
  }
}
/**
 * Display supplied source statements without inventing absent detail.
 * @param {string} title - Visible source section heading.
 * @param {string[]|undefined} values - Source statements in their original order.
 * @returns {void} Absent statements add no invented list.
 */
function paragraphList(title, values) {
  if (!values?.length) return;
  detail.append(el("h3", title));
  const list = el("ul");
  for (const value of values) list.append(el("li", value));
  detail.append(list);
}
/**
 * Display source-reported capabilities, expected outputs and their qualification boundaries.
 * @param {import('../../types/atlas.js').AtlasNode['dossier']|undefined} d - Original project dossier.
 * @returns {void} Keep target outputs distinct from accepted results.
 */
function renderDossier(d) {
  if (!d) return;
  if (d.evidence_state)
    detail.append(el("p", "Evidence state: " + d.evidence_state));
  if (d.configurations?.length) {
    paragraphList("Reactor configurations", d.configurations);
    if (d.configuration_state) detail.append(el("p", d.configuration_state));
  }
  paragraphList("Responsibility", d.scope?.length ? d.scope : d.responsibility);
  if (d.current_surfaces?.length) {
    detail.append(el("h3", "What exists today"));
    for (const c of d.current_surfaces) {
      const block = el("details", undefined, "capability");
      block.append(el("summary", c.name + " · " + c.maturity));
      for (const line of c.description || []) block.append(el("p", line));
      block.append(el("p", c.evidence, "sources"));
      if (c.verification_basis)
        block.append(el("p", c.verification_basis, "sources"));
      detail.append(block);
    }
  }
  if (d.expected_outputs?.length) {
    detail.append(el("h3", "Expected outputs"));
    if (d.acceptance_note) detail.append(el("p", d.acceptance_note, "sources"));
    for (const output of d.expected_outputs) {
      const block = el("div", undefined, "relation");
      const basis =
        output.basis === "agreed target"
          ? "Programme goal · in progress"
          : output.basis === "architect proposal"
            ? "Architecture proposal · in progress"
            : output.basis;
      block.append(el("strong", output.deliverable), el("p", basis));
      if (output.acceptance)
        block.append(el("p", "Acceptance summary: " + output.acceptance));
      if (output.qualification_requirements) {
        const requirements = el("details", undefined, "capability");
        requirements.append(
          el("summary", "Detailed qualification requirements"),
        );
        const text = el("p", output.qualification_requirements);
        text.style.whiteSpace = "pre-line";
        text.style.overflowWrap = "anywhere";
        requirements.append(text);
        block.append(requirements);
      }
      detail.append(block);
    }
  }
  if (d.programme_tracks?.length) {
    detail.append(el("h3", "Programme outputs in progress"));
    for (const track of d.programme_tracks) {
      detail.append(el("strong", track.name), el("p", track.scope));
    }
    detail.append(el("p", d.programme_basis, "sources"));
  }
  paragraphList("Model and interface inputs", d.inputs);
  if (d.inputs_basis) detail.append(el("p", d.inputs_basis, "sources"));
  paragraphList("Intended result artifacts", d.outputs);
  if (d.outputs_basis) detail.append(el("p", d.outputs_basis, "sources"));
  if (d.critical_boundary)
    detail.append(
      el("h3", "Critical modelling boundary"),
      el("p", d.critical_boundary),
    );
  paragraphList("Interface definitions in progress", d.connection_needs);
  paragraphList("Acceptance and next gates", d.acceptance);
  if (d.acceptance_basis) detail.append(el("p", d.acceptance_basis, "sources"));
  paragraphList("Partner capabilities sought", d.partner_needs);
  paragraphList("Model and implementation limits", d.limitations);
  if (d.references?.length) {
    detail.append(el("h3", "Selected primary references"));
    for (const reference of d.references) {
      if (!/^https?:\/\//.test(reference.url)) continue;
      const block = el("div", undefined, "relation");
      const link = el("a", reference.title);
      link.href = reference.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      block.append(
        link,
        el("p", reference.source_revision),
        el("p", reference.scope),
      );
      detail.append(block);
    }
  }
  if (d.source_records?.length) {
    const block = el("details", undefined, "capability");
    block.append(el("summary", "Dated source fingerprints"));
    for (const record of d.source_records) {
      block.append(el("p", record.document), el("p", record.sha256, "sources"));
    }
    detail.append(block);
  }
  if (d.review_state) detail.append(el("p", d.review_state, "sources"));
  paragraphList("Details being completed", d.open_fields);
}
/**
 * Retain project-specific needs and their separate shared-resource or budget associations.
 * @param {import('../../types/atlas.js').AtlasNode} n - Actual selected source entry.
 * @returns {void} No project or institute purchase total is inferred.
 */
function renderProjectResources(n) {
  if (n.repository_record) {
    detail.append(
      el("h3", "Repository development"),
      el("p", n.repository_record.stage + " · " + n.repository_record.as_of),
      el("p", n.repository_record.basis, "sources"),
    );
  }
  if (n.resource_needs?.length) {
    detail.append(el("h3", "Project resources required"));
    for (const r of n.resource_needs) {
      const block = el("details", undefined, "capability");
      block.append(
        el("summary", r.need),
        el("p", "Unlocks: " + r.unlocks),
        el("p", "Current basis: " + r.today),
        el("p", "Stage: " + r.when + " · " + r.price),
        el("p", r.quantity),
        el("p", "Partner slot: " + r.partner_slot),
        el("p", r.basis, "sources"),
        el("p", r.author + " · " + r.as_of, "sources"),
      );
      detail.append(block);
    }
  }
  if (n.resource_candidates?.length) {
    detail.append(el("h3", "Acquisition planning"));
    for (const c of n.resource_candidates) {
      const block = el("details", undefined, "capability");
      block.append(
        el("summary", c.item + " · " + c.maker),
        el("p", c.need),
        el("p", c.catalogue_scope),
        el("p", c.fit_state),
        el("p", c.own_or_access + " · " + c.price),
      );
      block.append(
        el(
          "p",
          (c.author ||
            "Owning group; independent primary-page check by CEO seat") +
            " · " +
            c.as_of,
          "sources",
        ),
      );
      if (c.source) {
        const a = el(
          "a",
          c.source_read
            ? "Primary source · independently read " + c.as_of
            : "Source supplied by group · verification scope in the record",
        );
        a.href = c.source;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        block.append(a);
      } else
        block.append(
          el(
            "p",
            "Preliminary maker/product name; not yet checked at the maker’s page.",
            "sources",
          ),
        );
      detail.append(block);
    }
  }
  const a = el("a", "Explore project and group resource needs");
  a.href = "resources.html#group=" + encodeURIComponent(n.group);
  const wrapper = el("p", undefined, "sources");
  wrapper.append(a);
  detail.append(wrapper);
}
/**
 * Open an exact source identity and optionally focus its original layout position.
 * @param {string} id - Stable project identity.
 * @param {boolean} [focus] - Whether to move the camera to its original source bounds.
 * @returns {void} Unknown identities do not fabricate project records.
 */
function selectNode(id, focus = true) {
  const n = byId.get(id);
  if (!n) return;
  if (!visible(n)) {
    query = "";
    filter = "";
    /** @type {HTMLInputElement} */ (document.getElementById("search")).value =
      "";
    /** @type {HTMLSelectElement} */ (
      document.getElementById("group-filter")
    ).value = "";
    refresh();
  }
  selected = id;
  /** @type {NodeListOf<SVGGElement>} */ (
    document.querySelectorAll(".node")
  ).forEach((e) => e.classList.toggle("selected", e.dataset.id === id));
  detail.replaceChildren(
    el("span", n.work_status, "badge"),
    el("h2", n.name),
    el("p", n.function),
  );
  const facts = el("dl", undefined, "facts");
  for (const [label, value] of [
    ["Phase", n.phase],
    ["Kind", n.kind],
    ["Release", n.release || "No independently released version stated"],
    ["Licence", n.licence],
    ["Date", n.as_of],
    [
      "Owners",
      n.owning_groups
        .map((g) => data.groups.find((x) => x.id === g)?.name || g)
        .join("; "),
    ],
  ]) {
    facts.append(el("dt", label), el("dd", value));
  }
  detail.append(facts);
  const group = data.groups.find((g) => g.id === n.group);
  if (group?.ownership_note) {
    detail.append(
      el("h3", "Owning group"),
      el("p", group.formation || "Work in progress"),
      el(
        "p",
        group.registered_project_count !== undefined
          ? group.registered_project_count + " registered projects"
          : group.inventory_summary ||
              group.architecture_project_count +
                " owning projects / " +
                group.architecture_instrument_count +
                " research-instrument concepts",
      ),
      el("p", group.ownership_note),
    );
  }
  renderDossier(n.dossier);
  renderProjectResources(n);
  if (n.source_reported_limits) {
    detail.append(el("h3", "Current source-reported review limits"));
    for (const limit of n.source_reported_limits)
      detail.append(
        el("p", limit.text),
        el("p", limit.state, "sources"),
        el("p", limit.author + " · " + limit.as_of, "sources"),
      );
  }
  if (n.partner_slots?.length) {
    detail.append(el("h3", "Partner needs"));
    for (const slot of n.partner_slots) {
      const block = el("details");
      block.append(
        el("summary", slot.gap),
        el("p", slot.state, "sources"),
        el("p", "Profile: " + slot.profile),
        el("p", slot.brings_gains),
        el("p", "First proposal: " + slot.first_step),
        el("p", slot.author + " · " + slot.as_of, "sources"),
      );
      detail.append(block);
    }
  }
  if (n.boundary) {
    detail.append(el("h3", "Current scope"), el("p", n.boundary));
  }
  if (n.url && /^https?:\/\//.test(n.url)) {
    const a = el("a", "Open project source");
    a.href = n.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    detail.append(a);
  }
  detail.append(el("h3", "Connections"));
  const links = data.edges.filter(
    (e) =>
      (e.from === id || e.to === id) &&
      (!isProposal(e) ||
        /** @type {HTMLInputElement} */ (
          document.getElementById("show-proposals")
        ).checked),
  );
  if (!links.length)
    detail.append(
      el(
        "p",
        "No technical relation is asserted by the supplied source records.",
      ),
    );
  for (const e of links) {
    const incoming = e.to === id,
      target = incoming ? e.from : e.to;
    const row = el("div", undefined, "relation");
    const button = el("button", (incoming ? "← " : "→ ") + target);
    button.addEventListener("click", () => selectNode(target));
    row.append(
      button,
      el(
        "small",
        e.kind === "planned interface" ? "Interface in progress" : e.kind,
      ),
    );
    if (e.payload) row.append(el("p", e.payload));
    if (e.state) row.append(el("small", "State: " + e.state));
    row.append(el("small", e.evidence));
    if (e.caution) row.append(el("small", e.caution));
    detail.append(row);
  }
  const proposalCount = data.edges.filter(
    (e) => (e.from === id || e.to === id) && isProposal(e),
  ).length;
  if (
    proposalCount &&
    !(
      /** @type {HTMLInputElement} */ (
        document.getElementById("show-proposals")
      ).checked
    )
  )
    detail.append(
      el(
        "p",
        proposalCount +
          " architecture proposals available: enable Architecture proposals to inspect the intended interfaces.",
        "sources",
      ),
    );
  detail.append(el("h3", "Sources"));
  for (const source of n.sources) {
    const a = el("a", "Read the group source");
    a.href = source;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    const p = el("p", undefined, "sources");
    p.append(a);
    detail.append(p);
  }
  detail.append(el("p", n.source_note, "sources"));
  const discuss = el("a", "Discuss this project");
  discuss.href =
    "mailto:protoscience@anulum.li?subject=" +
    encodeURIComponent("Partnership / " + n.name);
  detail.append(discuss);
  history.replaceState(null, "", "#project=" + encodeURIComponent(id));
  if (focus) fitBox(positions[id]);
  drawEdges();
  /** @type {HTMLDivElement} */ (
    document.getElementById("results")
  ).classList.add("hidden");
}
/** Restore the original filtered SVG and inventory populations without changing source identities. */
function refresh() {
  const found = data.nodes.filter(visible);
  /** @type {HTMLSpanElement} */ (
    document.getElementById("counter")
  ).textContent =
    `${found.length} / ${data.nodes.length} entries · 13 Oct 2026`;
  /** @type {NodeListOf<SVGGElement>} */ (
    document.querySelectorAll(".node")
  ).forEach((e) =>
    e.classList.toggle(
      "dim",
      !data.nodes.some((node) => node.id === e.dataset.id && visible(node)),
    ),
  );
  /** @type {NodeListOf<SVGGElement>} */ (
    document.querySelectorAll(".group-panel")
  ).forEach((e) =>
    e.classList.toggle("dim", !!filter && e.dataset.group !== filter),
  );
  const list = /** @type {HTMLDivElement} */ (
    document.getElementById("inventory")
  );
  list.replaceChildren();
  for (const n of found) {
    const row = el("button", undefined, "inventory-card");
    row.append(
      el("strong", n.name),
      el("span", n.function),
      el("small", n.work_status + " · " + n.phase),
    );
    row.addEventListener("click", () => selectNode(n.id, false));
    list.append(row);
  }
  const results = /** @type {HTMLDivElement} */ (
    document.getElementById("results")
  );
  results.replaceChildren();
  if (query) {
    for (const n of found.slice(0, 60)) {
      const button = el("button", undefined, "result");
      button.append(el("strong", n.name), el("small", n.function));
      button.addEventListener("click", () => selectNode(n.id));
      results.append(button);
    }
    if (!found.length) results.append(el("p", "No matching entry."));
    results.classList.remove("hidden");
  } else results.classList.add("hidden");
}
for (const g of data.groups) {
  if (!Number.isFinite(g.x)) continue;
  const o = document.createElement("option");
  o.value = g.id;
  o.textContent = g.name;
  /** @type {HTMLSelectElement} */ (
    document.getElementById("group-filter")
  ).append(o);
}
/** @type {HTMLParagraphElement} */ (
  document.getElementById("coverage")
).textContent = data.coverage;
/** @type {HTMLInputElement} */ (
  document.getElementById("search")
).addEventListener("input", (e) => {
  query = /** @type {HTMLInputElement|HTMLSelectElement} */ (e.target).value
    .trim()
    .toLowerCase();
  refresh();
});
/** @type {HTMLSelectElement} */ (
  document.getElementById("group-filter")
).addEventListener("change", (e) => {
  filter = /** @type {HTMLInputElement|HTMLSelectElement} */ (e.target).value;
  refresh();
  const g = data.groups.find((g) => g.id === filter);
  if (g) fitBox(g);
  else fitAll();
  history.replaceState(
    null,
    "",
    filter
      ? "#group=" + encodeURIComponent(filter)
      : location.pathname + location.search,
  );
});
/** @type {HTMLButtonElement} */ (
  document.getElementById("fit")
).addEventListener("click", fitAll);
/** @type {HTMLButtonElement} */ (
  document.getElementById("zoom-in")
).addEventListener("click", () => zoom(0.7));
/** @type {HTMLButtonElement} */ (
  document.getElementById("zoom-out")
).addEventListener("click", () => zoom(1 / 0.7));
/** @type {HTMLSelectElement} */ (
  document.getElementById("edge-mode")
).addEventListener("change", drawEdges);
/** @type {HTMLInputElement} */ (
  document.getElementById("show-proposals")
).addEventListener("change", () => {
  if (selected) selectNode(selected, false);
  else drawEdges();
});
/** @type {NodeListOf<SVGGElement>} */ (
  document.querySelectorAll(".node")
).forEach((e) => {
  e.addEventListener("click", () => {
    if (!drag?.moved) selectNode(e.dataset.id || "");
  });
  e.addEventListener("keydown", (event) => {
    if (["Enter", " "].includes(event.key)) {
      event.preventDefault();
      selectNode(e.dataset.id || "");
    }
  });
});
/**
 * Map a native pointer position into the connected source-layout SVG.
 * @param {number} x - Horizontal client coordinate in CSS pixels.
 * @param {number} y - Vertical client coordinate in CSS pixels.
 * @param {DOMMatrix} [matrix] - Retained inverse transform during a drag.
 * @returns {DOMPoint} Position in the atlas navigation coordinate system.
 */
function svgPoint(
  x,
  y,
  matrix = /** @type {DOMMatrix} */ (svg.getScreenCTM()).inverse(),
) {
  return new DOMPoint(x, y).matrixTransform(matrix);
}
canvas.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    const p = svgPoint(e.clientX, e.clientY);
    zoom(
      e.deltaY > 0 ? 1.14 : 1 / 1.14,
      (p.x - view.x) / view.w,
      (p.y - view.y) / view.h,
    );
  },
  { passive: false },
);
canvas.addEventListener("pointerdown", (e) => {
  if (/** @type {Element} */ (e.target).closest(".results")) return;
  const matrix = /** @type {DOMMatrix} */ (svg.getScreenCTM()).inverse();
  drag = {
    point: svgPoint(e.clientX, e.clientY, matrix),
    matrix,
    view: { ...view },
    moved: false,
    node: /** @type {SVGGElement|null} */ (
      /** @type {Element} */ (e.target).closest(".node")
    )?.dataset.id,
  };
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener("pointermove", (e) => {
  if (!drag) return;
  const p = svgPoint(e.clientX, e.clientY, drag.matrix),
    dx = p.x - drag.point.x,
    dy = p.y - drag.point.y;
  if (Math.abs(dx) + Math.abs(dy) > 5) drag.moved = true;
  view = { ...drag.view, x: drag.view.x - dx, y: drag.view.y - dy };
  applyView();
});
canvas.addEventListener("pointerup", () => {
  const moved = drag?.moved;
  if (!moved && drag?.node) selectNode(drag.node);
  setTimeout(() => {
    drag = null;
  }, 0);
  if (moved)
    /** @type {HTMLDivElement} */ (
      document.getElementById("results")
    ).classList.add("hidden");
});
canvas.addEventListener("pointercancel", () => {
  drag = null;
});
/** @type {HTMLButtonElement} */ (
  document.getElementById("map-tab")
).addEventListener("click", () => {
  canvas.classList.remove("hidden");
  /** @type {HTMLDivElement} */ (
    document.getElementById("inventory")
  ).classList.add("hidden");
  /** @type {HTMLButtonElement} */ (
    document.getElementById("map-tab")
  ).setAttribute("aria-pressed", "true");
  /** @type {HTMLButtonElement} */ (
    document.getElementById("list-tab")
  ).setAttribute("aria-pressed", "false");
});
/** @type {HTMLButtonElement} */ (
  document.getElementById("list-tab")
).addEventListener("click", () => {
  canvas.classList.add("hidden");
  /** @type {HTMLDivElement} */ (
    document.getElementById("inventory")
  ).classList.remove("hidden");
  /** @type {HTMLButtonElement} */ (
    document.getElementById("map-tab")
  ).setAttribute("aria-pressed", "false");
  /** @type {HTMLButtonElement} */ (
    document.getElementById("list-tab")
  ).setAttribute("aria-pressed", "true");
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    /** @type {HTMLDivElement} */ (
      document.getElementById("results")
    ).classList.add("hidden");
  }
});
/** Restore a retained project or programme from its public fragment, leaving unknown identities unexpanded. */
function readLink() {
  const p = new URLSearchParams(location.hash.slice(1));
  const id = p.get("project");
  if (id && byId.has(id)) {
    selectNode(id);
    return;
  }
  const gid = p.get("group");
  const g = data.groups.find((x) => x.id === gid);
  if (g && Number.isFinite(g.x)) {
    filter = g.id;
    /** @type {HTMLSelectElement} */ (
      document.getElementById("group-filter")
    ).value = g.id;
    refresh();
    fitBox(g);
  }
}
window.addEventListener("hashchange", readLink);
refresh();
fitAll();
readLink();
