// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Semantic map navigation and camera

import {
  atlas as R_atlas,
  badge as R_badge,
  button as R_button,
  clear as R_clear,
  disclosure as R_disclosure,
  el as R_el,
  groupName as R_groupName,
  groups as R_groups,
  href as R_href,
  isProposal as R_isProposal,
  link as R_link,
  mapLifecycle as R_mapLifecycle,
  nodes as R_nodes,
  projectLink as R_projectLink,
  search as R_search,
} from "@atlas/reader-core";
import { mapScene as R_mapScene } from "@atlas/reader-map-scene";
import {
  entryFamily as R_entryFamily,
  unknown as R_unknown,
} from "@atlas/reader-views";

/**
 * Explore source groups and projects through native SVG navigation and a bounded camera.
 * @param {URLSearchParams} params - Public programme, family or focused project selection.
 * @returns {void} Unknown source selections retain the unavailable-view contract.
 */
function semanticMap(params) {
  const focused = R_nodes.get(params.get("focus") || "");
  const group = focused?.group || params.get("group") || "";
  const family = focused
    ? R_entryFamily(focused.kind)
    : params.get("type") || "";
  if (group && !R_groups.has(group)) return R_unknown();
  if (
    family &&
    !R_atlas.nodes.some(
      (n) => n.group === group && R_entryFamily(n.kind) === family,
    )
  )
    return R_unknown();
  /** @type {[string,string|null][]} Visible programme ancestry. */
  const crumbs = [["Map", R_href({ view: "map" })]];
  if (group) crumbs.push([R_groupName(group), R_href({ view: "map", group })]);
  if (family) crumbs.push([family, null]);
  const root = R_clear(crumbs);
  root.append(
    R_el("p", "Explore one level at a time", "eyebrow"),
    R_el("h1", "The programme, in focus"),
    R_el(
      "p",
      "Open a programme, then a family of source entries, then a project passport. Map positions organise navigation; they do not represent geography or readiness.",
      "lede",
    ),
  );
  const tools = R_el("div", undefined, "map-tools");
  const parent = family
    ? R_href({ view: "map", group })
    : R_href({ view: "map" });
  const back = R_link(
    family ? "← Programme families" : "← All programmes",
    parent,
    "action-link",
  );
  if (group) tools.append(back);
  const pickerLabel = R_el("label", "Open a programme or context group");
  pickerLabel.htmlFor = "map-programme";
  const picker = R_el("select");
  picker.id = "map-programme";
  const all = R_el("option", "All groups");
  all.value = "";
  picker.append(all);
  for (const g of R_atlas.groups) {
    const option = R_el("option", R_groupName(g.id));
    option.value = g.id;
    picker.append(option);
  }
  picker.value = group;
  picker.addEventListener("change", () => {
    location.hash = R_href({
      view: "map",
      ...(picker.value ? { group: picker.value } : {}),
    });
  });
  tools.append(pickerLabel, picker);
  const stageLabel = R_el(
    "p",
    family ||
      (group
        ? R_groupName(group)
        : "Research programmes and supporting context"),
    "map-level",
  );
  const viewport = R_el("div", undefined, "semantic-canvas");
  viewport.id = "semantic-canvas";
  const status = R_el("p", "", "caption");
  status.id = "map-status";
  status.setAttribute("aria-live", "polite");
  const showLabel = R_el("label", undefined, "toggle");
  const show = R_el("input");
  show.type = "checkbox";
  show.id = "map-show-relations";
  showLabel.append(show, document.createTextNode("Show source relation links"));
  const proposalLabel = R_el("label", undefined, "toggle");
  const proposals = R_el("input");
  proposals.type = "checkbox";
  proposals.id = "map-show-proposals";
  proposalLabel.append(
    proposals,
    document.createTextNode("Include architecture proposals"),
  );
  const edgeControls = R_el("div", undefined, "map-layers");
  edgeControls.append(showLabel, proposalLabel);
  const edgeButtons = R_el("div", undefined, "map-edge-buttons");
  const explanation = R_el("section", undefined, "map-relation-explanation");
  explanation.hidden = true;
  const search = R_el("section", undefined, "map-lookup");
  const lookupLabel = R_el("label", "Find a project or capability in the map");
  lookupLabel.htmlFor = "map-project-search";
  const input = R_el("input");
  input.type = "search";
  input.id = "map-project-search";
  input.placeholder = "Project name, function or resource…";
  const matches = R_el("div", undefined, "map-search-results");
  const searchCount = R_el(
    "p",
    "Enter a term to locate a source entry.",
    "caption",
  );
  searchCount.setAttribute("aria-live", "polite");
  input.addEventListener("input", () => {
    const term = input.value.trim();
    matches.replaceChildren();
    if (!term) {
      searchCount.textContent = "Enter a term to locate a source entry.";
      return;
    }
    const found = R_search(term).sort(
      (a, b) =>
        Number(b.id.toLowerCase() === term.toLowerCase()) -
        Number(a.id.toLowerCase() === term.toLowerCase()),
    );
    searchCount.textContent =
      found.length + " source matches · showing " + Math.min(8, found.length);
    for (const n of found.slice(0, 8))
      matches.append(
        R_link(
          n.name + " · " + R_groupName(n.group),
          R_href({ view: "map", focus: n.id }),
          "map-search-result",
        ),
      );
  });
  search.append(lookupLabel, input, searchCount, matches);
  root.append(
    search,
    tools,
    stageLabel,
    edgeControls,
    status,
    viewport,
    R_el(
      "p",
      "Drag to pan · scroll to zoom · zoom further over a programme or family to open it · Enter opens a focused card. On a phone, drag the map or use the programme selector.",
      "caption",
    ),
    R_el(
      "p",
      "Only relations crossing the displayed tiles are drawn at this level. Open a project passport for its full source relationships. Link labels count source declarations and separately included proposals.",
      "caption",
    ),
    edgeButtons,
    explanation,
  );
  if (focused) {
    const selection = R_el("section", undefined, "map-focused-project");
    selection.append(
      R_badge(focused.work_status),
      R_el("h2", focused.name),
      R_el("p", focused.function),
      R_projectLink(focused.id, "Open the full project passport →"),
      R_link(
        "Read the partnership brief →",
        R_href({ view: "support", entry: focused.id }),
        "brief-link",
      ),
    );
    root.append(selection);
  }
  /** @typedef {{x:number,y:number,w:number,h:number}} CameraView */
  /** @type {import('./reader-map-scene.js').Scene} Set synchronously by draw before event dispatch. */
  let scene;
  /** @type {SVGSVGElement} Owned current drawing, connected by draw. */
  let svg;
  /** @type {CameraView} Current camera, initialised by the first reset in draw. */
  let view;
  /** @type {CameraView} Initial fit used to bound subsequent zoom. */
  let fit;
  /** @type {{point:DOMPoint,matrix:DOMMatrix,view:CameraView,moved:boolean,target:string|undefined}|null} */
  let drag = null;
  let narrow = false;
  /**
   * Apply the current camera to its owned connected SVG.
   * @returns {void} The SVG view box receives the current camera coordinates.
   */
  const apply = () =>
    svg.setAttribute("viewBox", [view.x, view.y, view.w, view.h].join(" "));
  /** Fit the source level to the actual viewport and retain an optional focused entry. */
  function reset() {
    const ratio = viewport.clientWidth / viewport.clientHeight;
    const width =
      viewport.clientWidth >= 1000 && scene.level !== "projects"
        ? Math.max(scene.width, scene.height * ratio)
        : scene.width;
    view = { x: (scene.width - width) / 2, y: 0, w: width, h: width / ratio };
    fit = { ...view };
    if (focused) {
      const tile = scene.tiles.find((t) => t.id === focused.id);
      if (tile) {
        view.x = Math.max(
          0,
          Math.min(
            Math.max(0, scene.width - view.w),
            tile.x + tile.w / 2 - view.w / 2,
          ),
        );
        view.y = Math.max(
          0,
          Math.min(
            Math.max(0, scene.height - view.h),
            tile.y + tile.h / 2 - view.h / 2,
          ),
        );
      }
    }
    apply();
  }
  /**
   * Zoom around a viewport fraction while retaining the existing bounded camera range.
   * @param {number} factor - Positive factor from native controls or wheel direction.
   * @param {number} [x] - Horizontal viewport fraction.
   * @param {number} [y] - Vertical viewport fraction.
   * @returns {void} Update the camera without changing source geometry.
   */
  function zoom(factor, x = 0.5, y = 0.5) {
    const width = Math.max(220, Math.min(fit.w * 2.5, view.w * factor));
    const height = (view.h * width) / view.w;
    view = {
      x: view.x + (view.w - width) * x,
      y: view.y + (view.h - height) * y,
      w: width,
      h: height,
    };
    apply();
  }
  /**
   * Open every retained source edge represented by the selected aggregate.
   * @param {import('./reader-map-scene.js').RelationPair} pair - Actual directed source aggregate.
   * @returns {void} Keep declarations and proposals distinct from exercised integration.
   */
  function explain(pair) {
    explanation.hidden = false;
    explanation.replaceChildren(
      R_el("h2", "Underlying declared relations"),
      R_el(
        "p",
        "This aggregate links navigation tiles using the exact records below. It does not establish exercised integration or a common data-flow direction.",
        "notice",
      ),
    );
    for (const edge of pair.edges) {
      const title = R_el("p");
      title.append(
        R_projectLink(edge.from),
        document.createTextNode(" → "),
        R_projectLink(edge.to),
      );
      explanation.append(
        R_disclosure(
          edge.kind +
            (R_isProposal(edge)
              ? " · architecture proposal"
              : " · source declaration"),
          [
            title,
            R_el("p", edge.payload || "Payload specification not supplied."),
            R_el("p", edge.state || "Declaration, not an integration verdict."),
            R_el("p", edge.evidence, "caption"),
            R_el("p", edge.caution || "", "caption"),
          ],
        ),
      );
    }
    explanation.scrollIntoView({ block: "start" });
  }
  /**
   * Rebuild the selected source/proposal layer and own the camera before event callbacks run.
   * @param {boolean} [resetCamera] - Reset only when the navigation level or viewport changes.
   * @returns {void} Replace the SVG and relation controls together.
   */
  function draw(resetCamera = true) {
    narrow = viewport.clientWidth < 600;
    scene = R_mapScene.scene(group, family, viewport.clientWidth);
    const drawing = R_mapScene.draw(
      scene,
      show.checked,
      proposals.checked,
      focused?.id,
      explain,
    );
    svg = drawing.svg;
    viewport.replaceChildren(svg);
    if (resetCamera || !view) reset();
    else apply();
    const levelNames = {
      programmes: "programme and context groups",
      families: "entry families",
      projects: "source entries",
    };
    status.textContent =
      scene.tiles.length +
      " " +
      levelNames[scene.level] +
      " at this level · " +
      (show.checked
        ? drawing.pairs.length + " relation pairs shown"
        : "relation links hidden") +
      (narrow || scene.level === "projects"
        ? " · pan to explore the full level"
        : "");
    edgeButtons.replaceChildren();
    if (show.checked)
      for (const pair of drawing.pairs) {
        const sources = pair.edges.filter((e) => !R_isProposal(e)).length;
        edgeButtons.append(
          R_button(
            (scene.tiles.find((t) => t.id === pair.from)?.title || pair.from) +
              " → " +
              (scene.tiles.find((t) => t.id === pair.to)?.title || pair.to) +
              ": " +
              sources +
              " source / " +
              (pair.edges.length - sources) +
              " proposal",
            () => explain(pair),
          ),
        );
      }
    explanation.hidden = true;
  }
  tools.append(
    R_button("Reset view", reset),
    R_button("＋", () => zoom(0.75)),
    R_button("−", () => zoom(1 / 0.75)),
  );
  /**
   * Transform a native pointer position into the current SVG coordinate system.
   * @param {MouseEvent} event - Native pointer or wheel position in the connected map.
   * @param {DOMMatrix} [matrix] - Retained inverse matrix during a pointer drag.
   * @returns {DOMPoint} Position in the current SVG source coordinate system.
   */
  const point = (
    event,
    matrix = /** @type {DOMMatrix} */ (svg.getScreenCTM()).inverse(),
  ) => new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix);
  viewport.addEventListener("pointerdown", (event) => {
    if (
      event.button !== 0 ||
      /** @type {Element} */ (event.target).closest(".map-relation-label")
    )
      return;
    const matrix = /** @type {DOMMatrix} */ (svg.getScreenCTM()).inverse();
    drag = {
      point: point(event, matrix),
      matrix,
      view: { ...view },
      moved: false,
      target: /** @type {SVGElement | null} */ (
        /** @type {Element} */ (event.target).closest("[data-target]")
      )?.dataset.target,
    };
    viewport.setPointerCapture(event.pointerId);
  });
  viewport.addEventListener("pointermove", (event) => {
    if (!drag) return;
    const current = point(event, drag.matrix),
      dx = current.x - drag.point.x,
      dy = current.y - drag.point.y;
    if (Math.abs(dx) + Math.abs(dy) > 6) drag.moved = true;
    view = { ...drag.view, x: drag.view.x - dx, y: drag.view.y - dy };
    apply();
  });
  viewport.addEventListener("pointerup", (event) => {
    if (!drag) return;
    const finished = drag;
    drag = null;
    if (viewport.hasPointerCapture(event.pointerId))
      viewport.releasePointerCapture(event.pointerId);
    if (!finished.moved && finished.target) location.hash = finished.target;
  });
  viewport.addEventListener("pointercancel", () => {
    drag = null;
  });
  viewport.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      const tile = /** @type {SVGElement | null} */ (
        /** @type {Element} */ (event.target).closest("[data-target]")
      );
      if (
        event.deltaY < 0 &&
        scene.level !== "projects" &&
        tile &&
        view.w <= fit.w * 0.65
      ) {
        location.hash = /** @type {string} */ (tile.dataset.target);
        return;
      }
      if (event.deltaY > 0 && group && view.w >= fit.w * 1.8) {
        location.hash = parent;
        return;
      }
      const cursor = point(event);
      zoom(
        event.deltaY < 0 ? 0.85 : 1 / 0.85,
        (cursor.x - view.x) / view.w,
        (cursor.y - view.y) / view.h,
      );
    },
    { passive: false },
  );
  show.addEventListener("change", () => draw(false));
  proposals.addEventListener("change", () => draw(false));
  draw();
  let previousWidth = viewport.clientWidth;
  const observer = new ResizeObserver(() => {
    if (!viewport.isConnected) return;
    if (viewport.clientWidth !== previousWidth) {
      previousWidth = viewport.clientWidth;
      draw();
    }
  });
  observer.observe(viewport);
  R_mapLifecycle.cleanup = () => observer.disconnect();
  root.append(
    R_el(
      "p",
      "Source relations and architecture proposals retain their original evidence scopes. Entry families are navigation groupings based on recorded kind; they do not add architecture ownership or physical validation.",
      "notice",
    ),
    R_link(
      "Open the original complete technical atlas",
      "atlas_full.html" +
        (focused
          ? "#project=" + encodeURIComponent(focused.id)
          : group
            ? "#group=" + encodeURIComponent(group)
            : ""),
    ),
  );
}

export { semanticMap };
