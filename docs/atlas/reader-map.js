// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Semantic map navigation and camera

(() => {
  'use strict';
  const R = window.AtlasReader;
  function semanticMap(params) {
    const focused = R.nodes.get(params.get('focus'));
    const group = focused?.group || params.get('group') || '';
    const family = focused ? R.entryFamily(focused.kind) : params.get('type') || '';
    if (group && !R.groups.has(group)) return R.unknown();
    if (family && !R.atlas.nodes.some(n => n.group === group && R.entryFamily(n.kind) === family)) return R.unknown();
    const crumbs = [['Map', R.href({view: 'map'})]];
    if (group) crumbs.push([R.groupName(group), R.href({view: 'map', group})]);
    if (family) crumbs.push([family, null]);
    const root = R.clear(crumbs);
    root.append(R.el('p', 'Explore one level at a time', 'eyebrow'), R.el('h1', 'The programme, in focus'),
      R.el('p', 'Open a programme, then a family of source entries, then a project passport. Map positions organise navigation; they do not represent geography or readiness.', 'lede'));
    const tools = R.el('div', undefined, 'map-tools');
    const parent = family ? R.href({view: 'map', group}) : R.href({view: 'map'});
    const back = R.link(family ? '← Programme families' : '← All programmes', parent, 'action-link');
    if (group) tools.append(back);
    const pickerLabel = R.el('label', 'Open a programme or context group'); pickerLabel.htmlFor = 'map-programme';
    const picker = R.el('select'); picker.id = 'map-programme';
    const all = R.el('option', 'All groups'); all.value = ''; picker.append(all);
    for (const g of R.atlas.groups) { const option = R.el('option', R.groupName(g.id)); option.value = g.id; picker.append(option); }
    picker.value = group; picker.addEventListener('change', () => { location.hash = R.href({view: 'map', ...(picker.value ? {group: picker.value} : {})}); });
    tools.append(pickerLabel, picker);
    const stageLabel = R.el('p', family || (group ? R.groupName(group) : 'Research programmes and supporting context'), 'map-level');
    const viewport = R.el('div', undefined, 'semantic-canvas'); viewport.id = 'semantic-canvas';
    const status = R.el('p', '', 'caption'); status.id = 'map-status'; status.setAttribute('aria-live', 'polite');
    const showLabel = R.el('label', undefined, 'toggle'); const show = R.el('input'); show.type = 'checkbox'; show.id = 'map-show-relations';
    showLabel.append(show, document.createTextNode('Show source relation links'));
    const proposalLabel = R.el('label', undefined, 'toggle'); const proposals = R.el('input'); proposals.type = 'checkbox'; proposals.id = 'map-show-proposals';
    proposalLabel.append(proposals, document.createTextNode('Include architecture proposals'));
    const edgeControls = R.el('div', undefined, 'map-layers'); edgeControls.append(showLabel, proposalLabel);
    const edgeButtons = R.el('div', undefined, 'map-edge-buttons');
    const explanation = R.el('section', undefined, 'map-relation-explanation'); explanation.hidden = true;
    const search = R.el('section', undefined, 'map-lookup');
    const lookupLabel = R.el('label', 'Find a project or capability in the map'); lookupLabel.htmlFor = 'map-project-search';
    const input = R.el('input'); input.type = 'search'; input.id = 'map-project-search'; input.placeholder = 'Project name, function or resource…';
    const matches = R.el('div', undefined, 'map-search-results'); const searchCount = R.el('p', 'Enter a term to locate a source entry.', 'caption'); searchCount.setAttribute('aria-live', 'polite');
    input.addEventListener('input', () => {
      const term = input.value.trim(); matches.replaceChildren();
      if (!term) { searchCount.textContent = 'Enter a term to locate a source entry.'; return; }
      const found = R.search(term).sort((a, b) => Number(b.id.toLowerCase() === term.toLowerCase()) - Number(a.id.toLowerCase() === term.toLowerCase()));
      searchCount.textContent = found.length + ' source matches · showing ' + Math.min(8, found.length);
      for (const n of found.slice(0, 8)) matches.append(R.link(n.name + ' · ' + R.groupName(n.group), R.href({view: 'map', focus: n.id}), 'map-search-result'));
    });
    search.append(lookupLabel, input, searchCount, matches);
    root.append(search, tools, stageLabel, edgeControls, status, viewport,
      R.el('p', 'Drag to pan · scroll to zoom · zoom further over a programme or family to open it · Enter opens a focused card. On a phone, drag the map or use the programme selector.', 'caption'),
      R.el('p', 'Only relations crossing the displayed tiles are drawn at this level. Open a project passport for its full source relationships. Link labels count source declarations and separately included proposals.', 'caption'),
      edgeButtons, explanation);
    if (focused) {
      const selection = R.el('section', undefined, 'map-focused-project');
      selection.append(R.badge(), R.el('h2', focused.name), R.el('p', focused.function),
        R.projectLink(focused.id, 'Open the full project passport →'),
        R.link('Read the partnership brief →', R.href({view: 'support', entry: focused.id}), 'brief-link'));  root.append(selection);
    }
    let scene, svg, view, fit, drag = null, narrow = false;
    const apply = () => svg.setAttribute('viewBox', [view.x, view.y, view.w, view.h].join(' '));
    function reset() {
      const ratio = viewport.clientWidth / viewport.clientHeight;
      const width = viewport.clientWidth >= 1000 && scene.level !== 'projects' ? Math.max(scene.width, scene.height * ratio) : scene.width;
      view = {x: (scene.width - width) / 2, y: 0, w: width, h: width / ratio}; fit = {...view};
      if (focused) {
        const tile = scene.tiles.find(t => t.id === focused.id);
        if (tile) {
          view.x = Math.max(0, Math.min(Math.max(0, scene.width - view.w), tile.x + tile.w / 2 - view.w / 2));
          view.y = Math.max(0, Math.min(Math.max(0, scene.height - view.h), tile.y + tile.h / 2 - view.h / 2));
        }
      }
      apply();
    }
    function zoom(factor, x = 0.5, y = 0.5) {
      const width = Math.max(220, Math.min(fit.w * 2.5, view.w * factor));
      const height = view.h * width / view.w;
      view = {x: view.x + (view.w - width) * x, y: view.y + (view.h - height) * y, w: width, h: height}; apply();
    }
    function explain(pair) {
      explanation.hidden = false;
      explanation.replaceChildren(R.el('h2', 'Underlying declared relations'),
        R.el('p', 'This aggregate links navigation tiles using the exact records below. It does not establish exercised integration or a common data-flow direction.', 'notice'));
      for (const edge of pair.edges) {
        const title = R.el('p'); title.append(R.projectLink(edge.from), document.createTextNode(' → '), R.projectLink(edge.to));
        explanation.append(R.disclosure(edge.kind + (R.isProposal(edge) ? ' · architecture proposal' : ' · source declaration'), [title,
          R.el('p', edge.payload || 'Payload specification not supplied.'), R.el('p', edge.state || 'Declaration, not an integration verdict.'),
          R.el('p', edge.evidence, 'caption'), R.el('p', edge.caution || '', 'caption')]));
      }
      explanation.scrollIntoView({block: 'start'});
    }
    function draw(resetCamera = true) {
      narrow = viewport.clientWidth < 600;
      scene = R.mapScene.scene(group, family, viewport.clientWidth);
      const drawing = R.mapScene.draw(scene, show.checked, proposals.checked, focused?.id, explain);
      svg = drawing.svg; viewport.replaceChildren(svg); if (resetCamera || !view) reset(); else apply();
      const levelNames = {programmes: 'programme and context groups', families: 'entry families', projects: 'source entries'};
      status.textContent = scene.tiles.length + ' ' + levelNames[scene.level] + ' at this level · ' +
        (show.checked ? drawing.pairs.length + ' relation pairs shown' : 'relation links hidden') +
        (narrow || scene.level === 'projects' ? ' · pan to explore the full level' : '');
      edgeButtons.replaceChildren();
      if (show.checked) for (const pair of drawing.pairs) {
        const sources = pair.edges.filter(e => !R.isProposal(e)).length;
        edgeButtons.append(R.button((scene.tiles.find(t => t.id === pair.from)?.title || pair.from) + ' → ' +
          (scene.tiles.find(t => t.id === pair.to)?.title || pair.to) + ': ' + sources + ' source / ' + (pair.edges.length - sources) + ' proposal', () => explain(pair)));
      }
      explanation.hidden = true;
    }
    tools.append(R.button('Reset view', reset), R.button('＋', () => zoom(0.75)), R.button('−', () => zoom(1 / 0.75)));
    const point = (event, matrix = svg.getScreenCTM().inverse()) => new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix);
    viewport.addEventListener('pointerdown', event => {
      if (event.button !== 0 || event.target.closest('.map-relation-label')) return;
      const matrix = svg.getScreenCTM().inverse();
      drag = {point: point(event, matrix), matrix, view: {...view}, moved: false, target: event.target.closest('[data-target]')?.dataset.target};
      viewport.setPointerCapture(event.pointerId);
    });
    viewport.addEventListener('pointermove', event => {
      if (!drag) return;
      const current = point(event, drag.matrix), dx = current.x - drag.point.x, dy = current.y - drag.point.y;
      if (Math.abs(dx) + Math.abs(dy) > 6) drag.moved = true;
      view = {...drag.view, x: drag.view.x - dx, y: drag.view.y - dy}; apply();
    });
    viewport.addEventListener('pointerup', event => {
      if (!drag) return; const finished = drag; drag = null;
      if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
      if (!finished.moved && finished.target) location.hash = finished.target;
    });
    viewport.addEventListener('pointercancel', () => { drag = null; });
    viewport.addEventListener('wheel', event => {
      event.preventDefault();
      const tile = event.target.closest('[data-target]');
      if (event.deltaY < 0 && scene.level !== 'projects' && tile && view.w <= fit.w * 0.65) { location.hash = tile.dataset.target; return; }
      if (event.deltaY > 0 && group && view.w >= fit.w * 1.8) { location.hash = parent; return; }
      const cursor = point(event); zoom(event.deltaY < 0 ? 0.85 : 1 / 0.85, (cursor.x - view.x) / view.w, (cursor.y - view.y) / view.h);
    }, {passive: false});
    show.addEventListener('change', () => draw(false)); proposals.addEventListener('change', () => draw(false));
    draw();
    let previousWidth = viewport.clientWidth;
    const observer = new ResizeObserver(() => {
      if (!viewport.isConnected) return;
      if (viewport.clientWidth !== previousWidth) { previousWidth = viewport.clientWidth; draw(); }
    });
    observer.observe(viewport); R.cleanupMap = () => observer.disconnect();
    root.append(R.el('p', 'Source relations and architecture proposals retain their original evidence scopes. Entry families are navigation groupings based on recorded kind; they do not add architecture ownership or physical validation.', 'notice'),
      R.link('Open the original complete technical atlas', 'atlas_full.html' + (focused ? '#project=' + encodeURIComponent(focused.id) : group ? '#group=' + encodeURIComponent(group) : '')));
  }
  R.semanticMap = semanticMap;
})();
