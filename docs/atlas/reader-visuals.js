// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Project illustrations and reciprocal gallery navigation

(() => {
  'use strict';
  const R = window.AtlasReader;
  const {el, link, href, facts, list, disclosure} = R;
  const catalogue = JSON.parse(document.getElementById('visual-data').textContent);
  const illustrations = catalogue.illustrations;
  const forProject = id => illustrations.filter(row => row.project === id);

  function image(row) {
    const img = el('img', undefined, 'visual-image');
    img.src = row.asset; img.alt = row.title + '. ' + row.representation_label;
    img.loading = 'lazy'; img.decoding = 'async';
    return img;
  }

  function card(row) {
    const box = el('article', undefined, 'visual-card');
    box.id = 'visual-' + row.id; box.dataset.illustration = row.id; box.dataset.project = row.project;
    box.tabIndex = -1;
    box.append(R.badge(), el('p', row.project + ' · ' + row.representation_label, 'eyebrow'), el('h3', row.title), el('p', row.description));
    const artwork = link('', row.asset); artwork.setAttribute('aria-label', 'Open full illustration: ' + row.title);
    artwork.append(image(row)); box.append(artwork);
    box.append(el('p', row.review.summary, 'visual-review'));
    const actions = el('div', undefined, 'context-links');
    actions.append(link('Project details →', href({project: row.project, tab: 'visuals'})), link('Open full illustration ↗', row.asset));
    for (const download of row.downloads) {
      const a = link(download.label, download.path); a.setAttribute('download', ''); actions.append(a);
    }
    box.append(actions);
    const profile = el('pre', row.profile, 'visual-profile');
    box.append(disclosure('Representation, source and review scope', [
      facts([['Representation', row.representation_label], ['Source snapshot', row.source_version], ['Source author', row.author], ['Licence', row.licence]]),
      el('h4', 'This illustration does not establish'), list(row.limits),
      el('h4', 'Source profile'), profile,
      el('h4', 'Scoped source review'), el('p', row.review.scope),
      el('p', 'Independent review: ' + String(row.review.independent) + '. Content, presentation and publication review scope follows this record.', 'caption'),
      el('p', 'Review fingerprint: ' + row.review.fingerprint, 'fingerprint'),
      el('p', 'Original image fingerprint: ' + row.asset_sha256, 'fingerprint')
    ]));
    return box;
  }

  function visualPanel(n) {
    const root = el('section', undefined, 'passport-section');
    const rows = forProject(n.id);
    root.append(el('h2', 'Architecture & visuals'));
    if (!rows.length) root.append(el('p', 'No project-specific illustration has been supplied to this snapshot. This does not imply that the project has no design or simulation work.', 'missing'));
    else {
      root.append(el('p', 'Source drawings retain their representation and review scope. Design and concept illustrations are separate from measured or qualified simulation outputs.', 'notice'));
      const grid = el('div', undefined, 'visual-grid'); grid.append(...rows.map(card)); root.append(grid);
    }
    root.append(link('Explore the architecture gallery →', href({view: 'visuals'})));
    return root;
  }

  function visualPreview(n) {
    const rows = forProject(n.id), root = el('section', undefined, 'visual-preview');
    if (!rows.length) return root;
    root.append(el('h2', 'See how this project is designed'));
    const a = link('', href({project: n.id, tab: 'visuals'}));
    a.setAttribute('aria-label', 'Read architecture illustrations for ' + n.name); a.append(image(rows[0]));
    root.append(a, el('p', rows[0].title + ' · ' + rows[0].representation_label, 'caption'),
      link('Explore ' + rows.length + (rows.length === 1 ? ' illustration →' : ' illustrations →'), href({project: n.id, tab: 'visuals'})));
    return root;
  }

  function visualIndex(params) {
    const root = R.clear([['Architecture gallery', null]]);
    root.append(el('p', 'Research in progress', 'eyebrow'), el('h1', 'Architecture gallery'),
      el('p', 'Explore project designs, result provenance and reactor concepts, then follow each illustration into its project details.', 'lede'),
      el('p', illustrations.length + ' supplied illustrations cover ' + new Set(illustrations.map(row => row.project)).size + ' projects. Each record retains its own source and review scope; scientific, presentation and publication qualification remain separate.', 'notice'));
    const form = el('form', undefined, 'visual-filters'); form.setAttribute('role', 'search'); form.setAttribute('aria-label', 'Architecture gallery filters');
    const search = el('input'); search.type = 'search'; search.id = 'visual-search'; search.value = params.get('q') || '';
    const group = el('select'); group.id = 'visual-group'; group.append(el('option', 'All programmes')); group.firstChild.value = '';
    for (const id of [...new Set(illustrations.map(row => R.nodes.get(row.project).group))]) {
      const option = el('option', R.groupName(id)); option.value = id; group.append(option);
    }
    group.value = params.get('programme') || '';
    const kind = el('select'); kind.id = 'visual-kind';
    for (const [value, text] of [['', 'All representations'], ['design', 'Design illustrations'], ['concept', 'Concept artwork']]) {
      const option = el('option', text); option.value = value; kind.append(option);
    }
    kind.value = params.get('kind') || '';
    for (const [labelText, input] of [['Search projects and illustrations', search], ['Programme', group], ['Representation', kind]]) {
      const label = el('label', labelText); label.htmlFor = input.id; const field = el('div'); field.append(label, input); form.append(field);
    }
    const reset = R.button('Clear filters', () => {
      search.value = ''; group.value = ''; kind.value = ''; selectedProject = ''; update(); search.focus();
    }); form.append(reset);
    let selectedProject = params.get('projectFilter') || '';
    const selected = el('p', undefined, 'caption');
    const count = el('p', undefined, 'visual-count'); count.setAttribute('role', 'status'); count.setAttribute('aria-live', 'polite');
    const empty = el('p', 'No illustrations match these filters. Clear the filters to explore the supplied designs.', 'missing');
    const grid = el('div', undefined, 'visual-grid'); const cards = illustrations.map(card); grid.append(...cards);
    root.append(form, selected, count, empty, grid);
    function update() {
      const query = search.value.trim().toLowerCase(); let visible = 0;
      illustrations.forEach((row, i) => {
        const matches = (!selectedProject || row.project === selectedProject) && (!group.value || R.nodes.get(row.project).group === group.value) &&
          (!kind.value || row.representation === kind.value) && (!query || [row.project, row.title, row.description].join(' ').toLowerCase().includes(query));
        cards[i].hidden = !matches; visible += Number(matches);
      });
      count.textContent = visible + ' of ' + illustrations.length + ' illustrations'; empty.hidden = visible !== 0;
      selected.textContent = selectedProject ? 'Project filter: ' + selectedProject : ''; selected.hidden = !selectedProject;
      history.replaceState(null, '', href({view: 'visuals', ...(selectedProject ? {projectFilter: selectedProject} : {}),
        ...(query ? {q: search.value} : {}), ...(group.value ? {programme: group.value} : {}), ...(kind.value ? {kind: kind.value} : {})}));
    }
    form.addEventListener('submit', event => event.preventDefault()); form.addEventListener('input', update); form.addEventListener('change', update);
    update();
  }

  Object.assign(R, {visualPanel, visualPreview, visualIndex});
})();
