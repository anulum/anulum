// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Local source interface graph

(() => {
  'use strict';
  const R = window.AtlasReader, ns = 'http://www.w3.org/2000/svg';
  const svgEl = (tag, attrs, text) => {
    const node = document.createElementNS(ns, tag);
    for (const [key, value] of Object.entries(attrs || {})) node.setAttribute(key, value);
    if (text !== undefined) node.textContent = text; return node;
  };
  const color = e => R.isProposal(e) ? '#ad733b' : e.kind === 'pinned contract' ? '#81518f'
    : e.kind === 'optional interface' ? '#426f99' : '#365f4c';
  function edgeCard(edge, id) {
    const other = edge.from === id ? edge.to : edge.from;
    const card = R.el('article', undefined, 'interface-card');
    card.append(R.el('h3', (edge.from === id ? 'Outgoing' : 'Incoming') + ' · ' + edge.kind));
    const direction = R.el('p'); direction.append(R.projectLink(edge.from), document.createTextNode(' → '), R.projectLink(edge.to));
    card.append(direction, R.badge(R.isProposal(edge) ? 'Architecture proposal · in progress' : 'Source-declared relation'));
    card.append(R.facts([['Other entry', R.nodes.get(other)?.function || other],
      ['Payload / interface', edge.payload || 'Detailed exchanged data is not specified in this record.'],
      ['State', edge.state || 'Declaration; exercised integration is not established by this edge.'],
      ['Evidence', edge.evidence || 'No additional source statement supplied.']]));
    if (edge.caution) card.append(R.el('p', edge.caution, 'notice'));
    if (edge.as_of) card.append(R.el('p', 'Source date: ' + edge.as_of, 'caption'));
    return card;
  }
  function graph(center, edges) {
    const ids = [...new Set(edges.flatMap(e => [e.from, e.to]))].filter(id => id !== center.id);
    const incoming = ids.filter(id => edges.some(e => e.from === id && e.to === center.id));
    const outgoing = ids.filter(id => !incoming.includes(id));
    const h = Math.max(320, Math.max(incoming.length, outgoing.length) * 94 + 90), w = 1160;
    const positions = new Map([[center.id, {x: 440, y: h / 2 - 35, w: 280, h: 70}]]);
    for (const [array, x] of [[incoming, 20], [outgoing, 860]]) {
      array.forEach((id, i) => positions.set(id, {x, y: 55 + i * 94, w: 280, h: 70}));
    }
    const svg = svgEl('svg', {viewBox: '0 0 ' + w + ' ' + h, role: 'img', 'aria-label': 'Local interface graph for ' + center.name});
    const defs = svgEl('defs');
    defs.append(svgEl('marker', {id: 'local-edge-arrow', markerWidth: 8, markerHeight: 8, refX: 7, refY: 4, orient: 'auto'}));
    defs.firstChild.append(svgEl('path', {d: 'M1 1 L7 4 L1 7', fill: 'none', stroke: 'context-stroke', 'stroke-width': 1.5}));
    svg.append(defs);
    for (const edge of edges) {
      const a = positions.get(edge.from), b = positions.get(edge.to); if (!a || !b) continue;
      const forward = a.x < b.x, x1 = a.x + (forward ? a.w : 0), x2 = b.x + (forward ? 0 : b.w);
      const y1 = a.y + a.h / 2, y2 = b.y + b.h / 2;
      const path = svgEl('path', {d: `M${x1} ${y1} C${x1 + (forward ? 100 : -100)} ${y1},${x2 + (forward ? -100 : 100)} ${y2},${x2} ${y2}`,
        fill: 'none', stroke: color(edge), 'stroke-width': 2, 'marker-end': 'url(#local-edge-arrow)'});
      if (R.isProposal(edge) || /optional|progress|planned/.test(edge.kind)) path.setAttribute('stroke-dasharray', '7 5');
      path.append(svgEl('title', {}, edge.from + ' → ' + edge.to + ': ' + edge.kind)); svg.append(path);
    }
    for (const [id, position] of positions) {
      const n = R.nodes.get(id), a = svgEl('a', {href: R.href({project: id}), 'aria-label': n.name});
      a.append(svgEl('rect', {x: position.x, y: position.y, width: position.w, height: position.h, rx: 10,
        fill: id === center.id ? '#e1ece0' : '#fff', stroke: R.groups.get(n.group)?.color || '#315d4c', 'stroke-width': 2}));
      const lines = n.name.length > 28 ? [n.name.slice(0, 28), n.name.slice(28, 55) + (n.name.length > 55 ? '…' : '')] : [n.name];
      lines.slice(0, 2).forEach((line, i) => a.append(svgEl('text', {x: position.x + 12, y: position.y + 29 + i * 19,
        fill: '#18392d', 'font-size': 14, 'font-family': 'system-ui, sans-serif'}, line)));
      svg.append(a);
    }
    return svg;
  }
  function renderInterfaces(root, n) {
    root.append(R.el('h2', 'Inputs, outputs and neighbouring projects'),
      R.el('p', 'Arrows preserve the source direction and relationship type. A package dependency can point toward the required package; it is not necessarily the direction of data flow. Declared interfaces do not establish tested integration.', 'notice'));
    const label = R.el('label', undefined, 'toggle'); const toggle = R.el('input'); toggle.type = 'checkbox'; toggle.id = 'include-interface-proposals';
    label.append(toggle, document.createTextNode('Include architecture proposals'));
    const counter = R.el('p', undefined, 'caption'); counter.setAttribute('aria-live', 'polite');
    const image = R.el('div', undefined, 'network-wrap');
    const cards = R.el('div', undefined, 'interface-list');
    function update() {
      const edges = R.knownEdges(n.id, toggle.checked);
      const proposals = R.atlas.edges.filter(e => (e.from === n.id || e.to === n.id) && R.isProposal(e)).length;
      counter.textContent = edges.length + ' displayed relations · ' + proposals + ' architecture proposals ' + (toggle.checked ? 'included' : 'available separately');
      image.replaceChildren(); cards.replaceChildren();
      if (edges.length) { image.append(graph(n, edges)); for (const edge of edges) cards.append(edgeCard(edge, n.id)); }
      else cards.append(R.el('p', 'No source relation is supplied for this entry in the selected layer.', 'missing'));
    }
    toggle.addEventListener('change', update); root.append(label, counter, image, cards);
    const d = n.dossier || {};
    if (d.connection_needs?.length) root.append(R.el('h2', 'Interface definitions in progress'), R.list(d.connection_needs));
    root.append(R.link('Open complete technical atlas', 'atlas_full.html#project=' + encodeURIComponent(n.id)));
    update();
  }
  R.renderInterfaces = renderInterfaces;
})();
