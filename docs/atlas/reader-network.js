// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Local source interface graph

import {
  requireRecord,
  atlas as R_atlas,
  badge as R_badge,
  el as R_el,
  facts as R_facts,
  groups as R_groups,
  href as R_href,
  isProposal as R_isProposal,
  knownEdges as R_knownEdges,
  link as R_link,
  list as R_list,
  nodes as R_nodes,
  projectLink as R_projectLink,
} from "@atlas/reader-core";

const ns = "http://www.w3.org/2000/svg";
/**
 * Create an owned SVG element; attributes and source text are never parsed as markup.
 * @template {keyof SVGElementTagNameMap} K
 * @param {K} tag - Native SVG element name.
 * @param {Record<string,string|number>} [attrs] - SVG attributes in source order.
 * @param {string | number} [text] - Plain text for a title or label.
 * @returns {SVGElementTagNameMap[K]} Detached SVG element.
 */
const svgEl = (tag, attrs, text) => {
  const node = document.createElementNS(ns, tag);
  for (const [key, value] of Object.entries(attrs || {}))
    node.setAttribute(key, String(value));
  if (text !== undefined) node.textContent = String(text);
  return node;
};
/**
 * Select the source relationship colour without changing its reported status.
 * @param {import('../../types/atlas.js').AtlasEdge} e - Directed source relationship.
 * @returns {string} Source/proposal styling without a readiness score.
 */
const color = (e) =>
  R_isProposal(e)
    ? "#ad733b"
    : e.kind === "pinned contract"
      ? "#81518f"
      : e.kind === "optional interface"
        ? "#426f99"
        : "#365f4c";
/**
 * Explain one declared relationship without treating it as exercised integration.
 * @param {import('../../types/atlas.js').AtlasEdge} edge - Original directed edge.
 * @param {string} id - Current project identity.
 * @returns {HTMLElement} Direction, payload, source and scope card.
 */
function edgeCard(edge, id) {
  const other = edge.from === id ? edge.to : edge.from;
  const card = R_el("article", undefined, "interface-card");
  card.append(
    R_el(
      "h3",
      (edge.from === id ? "Outgoing" : "Incoming") + " · " + edge.kind,
    ),
  );
  const direction = R_el("p");
  direction.append(
    R_projectLink(edge.from),
    document.createTextNode(" → "),
    R_projectLink(edge.to),
  );
  card.append(
    direction,
    R_badge(
      R_isProposal(edge)
        ? "Architecture proposal · in progress"
        : "Source-declared relation",
    ),
  );
  card.append(
    R_facts([
      ["Other entry", R_nodes.get(other)?.function || other],
      [
        "Payload / interface",
        edge.payload ||
          "Detailed exchanged data is not specified in this record.",
      ],
      [
        "State",
        edge.state ||
          "Declaration; exercised integration is not established by this edge.",
      ],
      ["Evidence", edge.evidence || "No additional source statement supplied."],
    ]),
  );
  if (edge.caution) card.append(R_el("p", edge.caution, "notice"));
  if (edge.as_of)
    card.append(R_el("p", "Source date: " + edge.as_of, "caption"));
  return card;
}
/**
 * Lay out the current entry and its declared neighbours while retaining edge direction.
 * @param {import('../../types/atlas.js').AtlasNode} center - Selected source entry.
 * @param {import('../../types/atlas.js').AtlasEdge[]} edges - Selected source/proposal layer.
 * @returns {SVGSVGElement} Native linked source-interface graph.
 */
function graph(center, edges) {
  const ids = [...new Set(edges.flatMap((e) => [e.from, e.to]))].filter(
    (id) => id !== center.id,
  );
  const incoming = ids.filter((id) =>
    edges.some((e) => e.from === id && e.to === center.id),
  );
  const outgoing = ids.filter((id) => !incoming.includes(id));
  const h = Math.max(320, Math.max(incoming.length, outgoing.length) * 94 + 90),
    w = 1160;
  const positions = new Map([
    [center.id, { x: 440, y: h / 2 - 35, w: 280, h: 70 }],
  ]);
  for (const [array, x] of /** @type {[string[],number][]} */ ([
    [incoming, 20],
    [outgoing, 860],
  ])) {
    array.forEach((id, i) =>
      positions.set(id, { x, y: 55 + i * 94, w: 280, h: 70 }),
    );
  }
  const svg = svgEl("svg", {
    viewBox: "0 0 " + w + " " + h,
    role: "img",
    "aria-label": "Local interface graph for " + center.name,
  });
  const defs = svgEl("defs");
  const marker = svgEl("marker", {
    id: "local-edge-arrow",
    markerWidth: 8,
    markerHeight: 8,
    refX: 7,
    refY: 4,
    orient: "auto",
  });
  defs.append(marker);
  marker.append(
    svgEl("path", {
      d: "M1 1 L7 4 L1 7",
      fill: "none",
      stroke: "context-stroke",
      "stroke-width": 1.5,
    }),
  );
  svg.append(defs);
  for (const edge of edges) {
    const a = positions.get(edge.from),
      b = positions.get(edge.to);
    if (!a || !b) continue;
    const forward = a.x < b.x,
      x1 = a.x + (forward ? a.w : 0),
      x2 = b.x + (forward ? 0 : b.w);
    const y1 = a.y + a.h / 2,
      y2 = b.y + b.h / 2;
    const path = svgEl("path", {
      d: `M${x1} ${y1} C${x1 + (forward ? 100 : -100)} ${y1},${x2 + (forward ? -100 : 100)} ${y2},${x2} ${y2}`,
      fill: "none",
      stroke: color(edge),
      "stroke-width": 2,
      "marker-end": "url(#local-edge-arrow)",
    });
    if (R_isProposal(edge) || /optional|progress|planned/.test(edge.kind))
      path.setAttribute("stroke-dasharray", "7 5");
    path.append(
      svgEl("title", {}, edge.from + " → " + edge.to + ": " + edge.kind),
    );
    svg.append(path);
  }
  for (const [id, position] of positions) {
    const n = requireRecord(R_nodes.get(id)),
      a = svgEl("a", { href: R_href({ project: id }), "aria-label": n.name });
    a.append(
      svgEl("rect", {
        x: position.x,
        y: position.y,
        width: position.w,
        height: position.h,
        rx: 10,
        fill: id === center.id ? "#e1ece0" : "#fff",
        stroke: R_groups.get(n.group)?.color || "#315d4c",
        "stroke-width": 2,
      }),
    );
    const lines =
      n.name.length > 28
        ? [
            n.name.slice(0, 28),
            n.name.slice(28, 55) + (n.name.length > 55 ? "…" : ""),
          ]
        : [n.name];
    lines.slice(0, 2).forEach((line, i) =>
      a.append(
        svgEl(
          "text",
          {
            x: position.x + 12,
            y: position.y + 29 + i * 19,
            fill: "#18392d",
            "font-size": 14,
            "font-family": "system-ui, sans-serif",
          },
          line,
        ),
      ),
    );
    svg.append(a);
  }
  return svg;
}
/**
 * Switch declared and proposed source relationships through the native project interface tab.
 * @param {HTMLElement} root - Current passport panel.
 * @param {import('../../types/atlas.js').AtlasNode} n - Actual selected source entry.
 * @returns {void} Empty source layers remain explicitly described.
 */
function renderInterfaces(root, n) {
  root.append(
    R_el("h2", "Inputs, outputs and neighbouring projects"),
    R_el(
      "p",
      "Arrows preserve the source direction and relationship type. A package dependency can point toward the required package; it is not necessarily the direction of data flow. Declared interfaces do not establish tested integration.",
      "notice",
    ),
  );
  const label = R_el("label", undefined, "toggle");
  const toggle = R_el("input");
  toggle.type = "checkbox";
  toggle.id = "include-interface-proposals";
  label.append(
    toggle,
    document.createTextNode("Include architecture proposals"),
  );
  const counter = R_el("p", undefined, "caption");
  counter.setAttribute("aria-live", "polite");
  const image = R_el("div", undefined, "network-wrap");
  const cards = R_el("div", undefined, "interface-list");
  /** Rebuild only the selected source layer and its corresponding interface cards. */
  function update() {
    const edges = R_knownEdges(n.id, toggle.checked);
    const proposals = R_atlas.edges.filter(
      (e) => (e.from === n.id || e.to === n.id) && R_isProposal(e),
    ).length;
    counter.textContent =
      edges.length +
      " displayed relations · " +
      proposals +
      " architecture proposals " +
      (toggle.checked ? "included" : "available separately");
    image.replaceChildren();
    cards.replaceChildren();
    if (edges.length) {
      image.append(graph(n, edges));
      for (const edge of edges) cards.append(edgeCard(edge, n.id));
    } else
      cards.append(
        R_el(
          "p",
          "No source relation is supplied for this entry in the selected layer.",
          "missing",
        ),
      );
  }
  toggle.addEventListener("change", update);
  root.append(label, counter, image, cards);
  const d = n.dossier || {};
  if (d.connection_needs?.length)
    root.append(
      R_el("h2", "Interface definitions in progress"),
      R_list(d.connection_needs),
    );
  root.append(
    R_link(
      "Open complete technical atlas",
      "atlas_full.html#project=" + encodeURIComponent(n.id),
    ),
  );
  update();
}

export { renderInterfaces };
