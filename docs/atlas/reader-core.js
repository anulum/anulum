// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Reader data and navigation primitives

(() => {
  'use strict';
  const atlas = JSON.parse(document.getElementById('atlas-data').textContent);
  const resources = JSON.parse(document.getElementById('resource-data').textContent);
  const budget = JSON.parse(document.getElementById('budget-data').textContent);
  const nodes = new Map(atlas.nodes.map(n => [n.id, n]));
  const groups = new Map(atlas.groups.map(g => [g.id, g]));
  const programmeDescriptions = {
    'SCPN-REACTOR-SYSTEMS': ['Reactor systems', 'Plasma modelling, simulation and reactor design research.'],
    'SC-NEUROMORPHIC-COMPUTING-SYSTEMS': ['Neuromorphic computing', 'Stochastic and spiking neural models, software and hardware research.'],
    'SCPN-QUANTUM-COMPUTING-SYSTEMS': ['Quantum computing', 'Quantum modelling, control, compilation and analysis.'],
    'SCPN-SYSTEMS-INTEGRATION-AND-CONTROL': ['Systems integration & control', 'Control methods and interfaces connecting modelled systems.'],
    'AGENTIC-COORDINATION-ASSURANCE-AND-CONTINUITY-SYSTEMS': ['Agentic systems', 'Coordination, assurance and continuity across agent workflows.'],
    'SCIENTIFIC-DISCOVERY-AND-EXPERIMENTATION': ['Scientific discovery', 'Experiment orchestration and reproducible reporting across domains.']
  };
  const el = (tag, text, cls) => {
    const node = document.createElement(tag);
    if (text !== undefined && text !== null) node.textContent = text;
    if (cls) node.className = cls;
    return node;
  };
  const href = params => '#' + new URLSearchParams(params).toString();
  const link = (text, target, cls) => {
    const node = el('a', text, cls);
    node.href = target;
    if (/^https?:\/\//.test(target)) { node.target = '_blank'; node.rel = 'noopener noreferrer'; }
    return node;
  };
  const button = (text, action, cls) => {
    const node = el('button', text, cls);
    node.type = 'button'; node.addEventListener('click', action);
    return node;
  };
  const list = (items, cls) => {
    const node = el('ul', undefined, cls);
    for (const text of items) node.append(el('li', text));
    return node;
  };
  const facts = pairs => {
    const node = el('dl', undefined, 'facts');
    for (const [name, value] of pairs) node.append(el('dt', name), el('dd', value));
    return node;
  };
  const disclosure = (title, children, open = false) => {
    const node = el('details', undefined, 'disclosure');
    node.open = open; node.append(el('summary', title), ...children);
    return node;
  };
  const badge = (text = 'In progress') => el('span', text, 'badge');
  const missing = field => el('p', field + ' is being specified by the owning group.', 'missing');
  const isProposal = edge => ['architect proposal', 'architect design'].includes(edge.layer);
  const knownEdges = (id, proposals = false) => atlas.edges.filter(e =>
    (e.from === id || e.to === id) && (proposals || !isProposal(e)));
  const groupName = id => programmeDescriptions[id]?.[0] || groups.get(id)?.name || id;
  const projectLink = (id, text) => link(text || nodes.get(id)?.name || id, href({project: id}));
  const projectCard = n => {
    const card = el('article', undefined, 'project-card');
    card.style.setProperty('--group-color', groups.get(n.group)?.color || '#315d4c');
    card.append(badge(), el('p', n.kind, 'eyebrow'), el('h3'));
    card.querySelector('h3').append(projectLink(n.id));
    card.append(el('p', n.function), el('p', n.phase, 'caption'),
      link('Partnership brief →', href({view: 'support', entry: n.id}), 'brief-link'));
    return card;
  };
  const searchText = n => {
    const d = n.dossier || {};
    return JSON.stringify([n.id, n.function, n.kind, d.purpose, d.inputs, d.outputs,
      d.expected_outputs, d.partner_needs, n.partner_slots,
      n.resource_needs?.map(r => [r.need, r.unlocks]),
      n.resource_candidates?.map(r => [r.item, r.need])]).toLowerCase();
  };
  const searchIndex = new Map(atlas.nodes.map(n => [n.id, searchText(n)]));
  const search = (term, group = '') => atlas.nodes.filter(n =>
    (!group || n.group === group) && searchIndex.get(n.id).includes(term.trim().toLowerCase()));
  const clear = (crumbs = []) => {
    const content = document.getElementById('content'); content.replaceChildren();
    const nav = document.getElementById('breadcrumbs'); nav.replaceChildren(link('Programme', href({view: 'overview'})));
    for (const [name, target] of crumbs) nav.append(el('span', ' / '), target ? link(name, target) : el('span', name));
    return content;
  };
  const money = amount => '€' + new Intl.NumberFormat('en-GB', {maximumFractionDigits: 2}).format(Number(amount));
  window.AtlasReader = {atlas, resources, budget, nodes, groups, programmeDescriptions,
    el, href, link, button, list, facts, disclosure, badge, missing, isProposal,
    knownEdges, groupName, projectLink, projectCard, search, clear, money};
})();
