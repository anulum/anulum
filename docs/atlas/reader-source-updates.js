// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Dated source-update candidate views

(() => {
  'use strict';
  const R = window.AtlasReader;
  const {el, facts, link, href, list} = R;
  const data = JSON.parse(document.getElementById('source-update-data').textContent);
  const records = new Map(data.projects.map(record => [record.project_id, record]));

  function value(item) {
    if (item === null || item === undefined || item === '') return 'Not supplied in this snapshot';
    if (typeof item === 'object' && !Array.isArray(item) && 'value' in item) return value(item.value);
    if (Array.isArray(item)) return item.length ? item.map(value).join('; ') : 'Not supplied in this snapshot';
    return typeof item === 'object' ? JSON.stringify(item) : String(item);
  }

  function sourceUpdatePanel(node) {
    const root = el('section', undefined, 'passport-section');
    root.append(el('h2', 'Dated source update'), el('p',
      'Private update candidate · source content and publication review pending.', 'notice'));
    root.append(R.directSourcePanel(node));
    const item = records.get(node.id);
    if (!item) {
      root.append(el('p', 'No additional master-map record is supplied for this project. Its existing dossier is retained.', 'missing'));
      return root;
    }
    const record = item.record;
    root.append(facts([
      ['Work status', 'In progress'], ['Source document', data.source_document],
      ['Snapshot date', item.source_record_date], ['Source-reported purpose', value(record.function)],
      ['Source-reported kind', value(record.kind)], ['Source-reported family', value(record.family)],
      ['Source-reported owners', value(record.owning_groups)],
      ['Source-recorded version', value(record.version)], ['Source-declared licence', value(record.licence)],
      ['Source-recorded packages', value(record.packages)],
      ['Repository visibility reported', value(item.repository_visibility_reported)]
    ]));
    root.append(el('p', 'This annex preserves dated declarations. Release, runtime and scientific evidence retain their separate qualification scope.', 'caption'));
    if (item.source_reported_public_url) root.append(link('Source-reported public repository', item.source_reported_public_url));
    else root.append(el('p', 'No public repository address is projected from this record.', 'caption'));
    root.append(el('h3', 'Snapshot fingerprint'), el('p', data.source_sha256, 'fingerprint'),
      link('Explore this source annex', href({view: 'source-updates'})));
    return root;
  }

  function sourceUpdateIndex() {
    const root = R.clear([['Dated source updates', null]]);
    root.append(el('h1', 'Dated sources, beside the living map'), el('p',
      'Private source-update candidate. Content review and publication admission are pending.', 'notice'));
    root.append(facts([['Projects in the retained atlas', data.baseline_nodes],
      ['Source rows captured', data.source_rows], ['Records linked to existing projects', data.matched_rows],
      ['Family contexts held separately', data.held_contexts.length], ['Source date', data.source_date]]));
    root.append(el('p', 'The annex adds dated context to existing identities. Project records, relationships and resource scenarios stay under their own source and review scope.', 'caption'));
    const label = el('label', 'Search these source records', 'search-label');
    const input = el('input'); input.type = 'search'; input.placeholder = 'Project or source-reported purpose';
    input.setAttribute('aria-label', 'Search source updates'); label.append(input);
    const count = el('p', undefined, 'caption'); count.setAttribute('role', 'status');
    const grid = el('div', undefined, 'project-grid'); root.append(label, count, grid);
    function render() {
      const query = input.value.trim().toLowerCase();
      const selected = data.projects.filter(item =>
        [item.project_id, item.record.function].join(' ').toLowerCase().includes(query));
      grid.replaceChildren(); count.textContent = selected.length + ' of ' + data.matched_rows + ' source records';
      for (const item of selected) {
        const node = R.nodes.get(item.project_id), card = el('article', undefined, 'project-card');
        card.append(el('h3')); card.querySelector('h3').append(link(node.name, href({project: node.id, tab: 'sources'})));
        card.append(el('p', item.record.function || 'Purpose not supplied'),
          el('p', 'Dated source declaration · ' + item.source_record_date, 'caption'));
        grid.append(card);
      }
      if (!selected.length) grid.append(el('p', 'No source records match this search.', 'missing'));
    }
    input.addEventListener('input', render); render();
    root.append(el('h2', 'Family context, without invented project nodes'),
      list(data.held_contexts.map(item => item.name + ' · ' + item.state)),
      link('Read the exact candidate annex', 'source_update_candidate.json'));
  }

  Object.assign(R, {sourceUpdatePanel, sourceUpdateIndex});
})();
