// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Source-backed map scene construction

import {
  requireRecord,
  atlas as R_atlas,
  groupName as R_groupName,
  groups as R_groups,
  href as R_href,
  isProposal as R_isProposal,
  nodes as R_nodes,
  programmeDescriptions as R_programmeDescriptions,
} from "@atlas/reader-core";
import { entryFamily as R_entryFamily } from "@atlas/reader-views";

/**
 * @typedef {{id:string,title:string,color:string,text:string,count:string,target:string,
 * x:number,y:number,w:number,h:number}} SceneTile
 * @typedef {{tiles:SceneTile[],width:number,height:number,level:'programmes'|'families'|'projects',
 * key:(node:import('../../types/atlas.js').AtlasNode|undefined)=>string|null,tileKeys:Set<string>}} Scene
 * @typedef {{from:string,to:string,edges:import('../../types/atlas.js').AtlasEdge[]}} RelationPair
 */

const ns = "http://www.w3.org/2000/svg";
/**
 * Create an owned SVG element; attributes and source text are never parsed as markup.
 * @template {keyof SVGElementTagNameMap} K
 * @param {K} tag - Native SVG element name.
 * @param {Record<string,string|number>} [attrs] - SVG attributes in source order.
 * @param {string | number} [text] - Plain text for a title or label.
 * @returns {SVGElementTagNameMap[K]} Detached SVG element.
 */
const svgEl = (tag, attrs = {}, text) => {
  const node = document.createElementNS(ns, tag);
  for (const [key, value] of Object.entries(attrs))
    node.setAttribute(key, String(value));
  if (text !== undefined) node.textContent = String(text);
  return node;
};
/**
 * Wrap source text into bounded SVG lines without interpreting it as markup.
 * @param {string} value - Source label or description.
 * @param {number} limit - Maximum code units per display line.
 * @param {number} maxLines - Maximum visible lines, with an ellipsis for remaining text.
 * @returns {string[]} Lines in their original text order.
 */
function wrap(value, limit, maxLines) {
  const words = value.split(/\s+/).flatMap((word) =>
    word.length > limit
      ? // Positive internal limits and word.length > limit guarantee a match.
        /** @type {string[]} */ (
          word.match(new RegExp(".{1," + limit + "}", "g"))
        )
      : [word],
  );
  const lines = [];
  for (const word of words) {
    if (
      !lines.length ||
      lines[lines.length - 1].length + word.length + 1 > limit
    )
      lines.push(word);
    else lines[lines.length - 1] += " " + word;
  }
  const result = lines.slice(0, maxLines);
  if (lines.length > maxLines) result[maxLines - 1] += "…";
  return result;
}
/**
 * Build programme, source-kind family or project navigation geometry from actual atlas records.
 * @param {string} group - Validated programme identity, or empty for all groups.
 * @param {string} family - Existing navigation family, or empty for programme families.
 * @param {number} viewportWidth - Actual available CSS pixels.
 * @returns {Scene} Source-backed navigation tiles; positions do not describe geography or readiness.
 */
function scene(group, family, viewportWidth) {
  const level = group ? (family ? "projects" : "families") : "programmes";
  const members = R_atlas.nodes.filter((n) => !group || n.group === group);
  let tiles;
  if (level === "programmes")
    tiles = R_atlas.groups.map((g) => {
      const count = members.filter((n) => n.group === g.id).length;
      return {
        id: g.id,
        title: R_groupName(g.id),
        color: g.color,
        text: R_programmeDescriptions[g.id]?.[1] || g.name,
        count: count + " atlas entries · In progress",
        target: R_href({ view: "map", group: g.id }),
      };
    });
  else if (level === "families")
    tiles = [...new Set(members.map((n) => R_entryFamily(n.kind)))].map(
      (name) => {
        const subset = members.filter((n) => R_entryFamily(n.kind) === name);
        return {
          id: name,
          title: name,
          color: requireRecord(R_groups.get(group)).color,
          text:
            "Recorded kinds: " +
            [...new Set(subset.map((n) => n.kind))].join(", "),
          count: subset.length + " source entries · In progress",
          target: R_href({ view: "map", group, type: name }),
        };
      },
    );
  else
    tiles = members
      .filter((n) => R_entryFamily(n.kind) === family)
      .map((n) => ({
        id: n.id,
        title: n.name,
        color: requireRecord(R_groups.get(group)).color,
        text: n.function,
        count: n.kind + " · " + n.work_status,
        target: R_href({ project: n.id }),
      }));
  const columns =
    viewportWidth < 600
      ? 1
      : viewportWidth < 1000 || level === "families"
        ? 2
        : 3;
  const w = 360,
    h = level === "projects" ? 174 : 230,
    gap = 28,
    padding = 28;
  const placedTiles = tiles.map((tile, i) => ({
    ...tile,
    x: padding + (i % columns) * (w + gap),
    y: padding + Math.floor(i / columns) * (h + gap),
    w,
    h,
  }));
  const width = padding * 2 + columns * (w + gap) - gap;
  const height =
    padding * 2 + Math.ceil(tiles.length / columns) * (h + gap) - gap;
  const tileKeys = new Set(placedTiles.map((t) => t.id));
  /**
   * Resolve a retained endpoint to the tile visible at the current navigation level.
   * @param {import('../../types/atlas.js').AtlasNode | undefined} n - Optional retained edge endpoint.
   * @returns {string | null} Visible tile identity, or no crossing tile at this level.
   */
  const key = (n) =>
    !n || (group && n.group !== group)
      ? null
      : level === "programmes"
        ? n.group
        : level === "families"
          ? R_entryFamily(n.kind)
          : n.id;
  return { tiles: placedTiles, width, height, level, key, tileKeys };
}
/**
 * Aggregate only directed source relations crossing distinct visible tiles.
 * @param {Scene} scene - Current source-grounded navigation level.
 * @param {boolean} includeProposals - Include separately identified proposal edges.
 * @returns {RelationPair[]} Directed aggregates retaining every original edge.
 */
function relationPairs(scene, includeProposals) {
  /** @type {Map<string, RelationPair>} Directed source aggregates. */
  const pairs = new Map();
  for (const edge of R_atlas.edges) {
    if (R_isProposal(edge) && !includeProposals) continue;
    const from = scene.key(R_nodes.get(edge.from)),
      to = scene.key(R_nodes.get(edge.to));
    if (
      !from ||
      !to ||
      from === to ||
      !scene.tileKeys.has(from) ||
      !scene.tileKeys.has(to)
    )
      continue;
    const key = JSON.stringify([from, to]);
    let pair = pairs.get(key);
    if (!pair) {
      pair = { from, to, edges: [] };
      pairs.set(key, pair);
    }
    pair.edges.push(edge);
  }
  return [...pairs.values()];
}
/**
 * Render navigation and optional source-link aggregates as keyboard-operable native SVG.
 * @param {Scene} scene - Current source-derived navigation geometry.
 * @param {boolean} includeRelations - Show only crossing aggregate relationships.
 * @param {boolean} includeProposals - Include the distinct architecture-proposal layer.
 * @param {string | undefined} focus - Optional current project identity.
 * @param {(pair:RelationPair)=>void} choosePair - Open the actual records behind an aggregate.
 * @returns {{svg:SVGSVGElement,pairs:RelationPair[]}} Owned SVG and its retained source aggregates.
 */
function draw(scene, includeRelations, includeProposals, focus, choosePair) {
  const svg = svgEl("svg", {
    role: "group",
    "aria-label": "Programme map · " + scene.level,
  });
  const defs = svgEl("defs");
  const marker = svgEl("marker", {
    id: "semantic-map-arrow",
    markerWidth: 8,
    markerHeight: 8,
    refX: 7,
    refY: 4,
    orient: "auto",
  });
  marker.append(
    svgEl("path", {
      d: "M1 1 L7 4 L1 7",
      fill: "none",
      stroke: "context-stroke",
      "stroke-width": 1.5,
    }),
  );
  defs.append(marker);
  svg.append(defs);
  const tiles = new Map(scene.tiles.map((t) => [t.id, t]));
  const pairs = relationPairs(scene, includeProposals),
    labels = [];
  if (includeRelations)
    for (const pair of pairs) {
      const a = requireRecord(tiles.get(pair.from)),
        b = requireRecord(tiles.get(pair.to));
      const ax = a.x + a.w / 2,
        ay = a.y + a.h / 2,
        bx = b.x + b.w / 2,
        by = b.y + b.h / 2;
      const dx = bx - ax,
        dy = by - ay;
      const scaleA = Math.min(
        dx ? a.w / 2 / Math.abs(dx) : Infinity,
        dy ? a.h / 2 / Math.abs(dy) : Infinity,
      );
      const scaleB = Math.min(
        dx ? b.w / 2 / Math.abs(dx) : Infinity,
        dy ? b.h / 2 / Math.abs(dy) : Infinity,
      );
      const x1 = ax + dx * scaleA,
        y1 = ay + dy * scaleA,
        x2 = bx - dx * scaleB,
        y2 = by - dy * scaleB;
      const source = pair.edges.filter((e) => !R_isProposal(e)).length;
      const proposals = pair.edges.length - source;
      const path = svgEl("path", {
        d: `M${x1} ${y1} Q${(x1 + x2) / 2 + 38} ${(y1 + y2) / 2 - 38} ${x2} ${y2}`,
        fill: "none",
        stroke: source ? "#476955" : "#9c733e",
        "stroke-width": 2,
        "stroke-dasharray": proposals ? "8 5" : "",
        "marker-end": "url(#semantic-map-arrow)",
      });
      path.append(
        svgEl(
          "title",
          {},
          pair.from +
            " → " +
            pair.to +
            ": " +
            source +
            " source relations, " +
            proposals +
            " proposals",
        ),
      );
      svg.append(path);
      const label = svgEl("g", {
        class: "map-relation-label",
        role: "button",
        tabindex: 0,
        "aria-label": "Explain relations: " + pair.from + " to " + pair.to,
      });
      const x = (x1 + x2) / 2 - 30,
        y = (y1 + y2) / 2 - 30;
      label.append(
        svgEl("rect", {
          x,
          y,
          width: 60,
          height: 26,
          rx: 6,
          fill: "#fff",
          stroke: "#abbba8",
        }),
        svgEl(
          "text",
          {
            x: x + 30,
            y: y + 18,
            "text-anchor": "middle",
            "font-size": 13,
            fill: "#244335",
          },
          source + (proposals ? "+" + proposals : ""),
        ),
      );
      label.addEventListener("click", () => choosePair(pair));
      label.addEventListener("keydown", (event) => {
        if (["Enter", " "].includes(event.key)) {
          event.preventDefault();
          choosePair(pair);
        }
      });
      labels.push(label);
    }
  for (const tile of scene.tiles) {
    const selected = tile.id === focus;
    const node = svgEl("g", {
      class: "map-entry" + (selected ? " selected" : ""),
      role: "link",
      tabindex: 0,
      "data-entry": tile.id,
      "data-target": tile.target,
      "aria-label": tile.title,
    });
    node.append(
      svgEl("title", {}, tile.title + ": " + tile.text),
      svgEl("rect", {
        x: tile.x,
        y: tile.y,
        width: tile.w,
        height: tile.h,
        rx: 14,
        fill: selected ? "#e5f0df" : "#fff",
        stroke: tile.color,
        "stroke-width": selected ? 4 : 2,
      }),
    );
    const titleSize = scene.level === "projects" ? 20 : 26;
    const titles = wrap(tile.title, scene.level === "projects" ? 28 : 25, 2);
    titles.forEach((line, i) =>
      node.append(
        svgEl(
          "text",
          {
            x: tile.x + 20,
            y: tile.y + 35 + i * 28,
            "font-size": titleSize,
            "font-weight": 600,
            fill: "#183a2d",
          },
          line,
        ),
      ),
    );
    const descriptions = wrap(
      tile.text,
      37,
      scene.level === "projects" ? 2 : 3,
    );
    descriptions.forEach((line, i) =>
      node.append(
        svgEl(
          "text",
          {
            x: tile.x + 20,
            y: tile.y + 93 + i * 19,
            "font-size": 16,
            fill: "#526b60",
          },
          line,
        ),
      ),
    );
    wrap(tile.count, 40, 2).forEach((line, i, lines) =>
      node.append(
        svgEl(
          "text",
          {
            x: tile.x + 20,
            y: tile.y + tile.h - 18 - (lines.length - 1 - i) * 17,
            "font-size": 14,
            fill: tile.color,
          },
          line,
        ),
      ),
    );
    node.addEventListener("keydown", (event) => {
      if (["Enter", " "].includes(event.key)) {
        event.preventDefault();
        location.hash = tile.target;
      }
    });
    svg.append(node);
  }
  svg.append(...labels);
  return { svg, pairs };
}
/** Construct navigation geometry and expose its retained directed source aggregates. */
const mapScene = { scene, relationPairs, draw };

export { mapScene };
