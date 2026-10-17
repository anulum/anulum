// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Technical explanation and current source routing

(() => {
  'use strict';
  const R = window.AtlasReader, {el, href, link} = R;
  const data = JSON.parse(document.getElementById('technical-data').textContent);
  const guides = new Map(data.guides.map(guide => [guide.project_id, guide]));
  const references = new Map(data.references.map(row => [row.id, row]));
  const projects = new Map(data.library.projects.map(row => [row.project_id, row]));
  const technicalSourceHref = (entry, document, line) => document ? href({view: 'technical-source', entry, document,
    ...(line ? {line: String(line)} : {})}) : href({view: 'technical', ...(entry ? {entry} : {})});
  function technicalView(params) {
    const entry = params.get('entry') || '';
    const root = R.clear([['Technical explanations', entry ? href({view: 'technical'}) : null]]);
    if (!entry) {
      root.append(el('h1', 'Understand how the systems work'), el('p',
        'Follow inputs, result artefacts, component responsibilities and documented project connections back to the source passages.', 'lede'),
        el('p', data.state, 'notice'), link('Compare systems side by side →', href({view: 'compare'})));
      const programme = params.get('programme') || '';
      if (programme && !R.groups.has(programme)) {
        root.append(el('p', 'This owning programme is not present in this atlas.', 'missing')); return;
      }
      const form = el('form', undefined, 'document-search'), query = el('input'), owner = el('select');
      query.id = 'technical-query'; query.type = 'search'; query.value = params.get('q') || '';
      query.placeholder = 'Project, inputs, artefacts, components or connections';
      const queryLabel = el('label', 'Search technical explanations'); queryLabel.htmlFor = query.id;
      owner.id = 'technical-owner';
      const ownerLabel = el('label', 'Owning programme'); ownerLabel.htmlFor = owner.id;
      const all = el('option', 'All programmes'); all.value = ''; owner.append(all);
      for (const [id] of R.groups) { const option = el('option', R.groupName(id)); option.value = id; owner.append(option); }
      owner.value = programme;
      const clear = el('button', 'Clear filters'); clear.type = 'button';
      form.append(queryLabel, query, ownerLabel, owner, clear);
      const grid = el('div', undefined, 'technical-guide-grid'), count = el('p', undefined, 'caption'); count.setAttribute('role', 'status');
      function update() {
        grid.replaceChildren(); const q = query.value.trim().toLowerCase(); let matches = 0;
        for (const [id, guide] of guides) {
          const node = R.nodes.get(id);
          if (owner.value && !node.owning_groups.includes(owner.value)) continue;
          const records = [guide.purpose, guide.scope, ...['implementation', 'inputs', 'outputs', 'components', 'connections', 'limits', 'external_roles', 'model_layers', 'source_notes'].flatMap(key => guide[key] || [])];
          const text = [id, node.name, ...node.owning_groups.map(R.groupName), ...records.flatMap(row => [row.title || '', row.project_id || '', row.text])].join('\n').toLowerCase();
          if (q && !text.includes(q)) continue;
          matches++;
          const card = el('article', undefined, 'technical-guide-card'); card.dataset.explanationProject = id;
          const title = el('h2'); title.append(link(node.name, href({view: 'technical', entry: id})));
          card.append(R.badge(), title, el('p', node.owning_groups.map(R.groupName).join(' · '), 'caption'),
            el('p', guide.purpose.text), link('Read the explanation →', href({view: 'technical', entry: id}))); grid.append(card);
        }
        count.textContent = matches + ' of ' + guides.size + ' technical explanations match these filters.';
        if (!matches) grid.append(el('p', 'No technical explanation matches these filters.', 'missing'));
        history.replaceState(null, '', href({view: 'technical', ...(owner.value ? {programme: owner.value} : {}), ...(query.value ? {q: query.value} : {})}));
      }
      form.addEventListener('submit', event => { event.preventDefault(); update(); });
      query.addEventListener('input', update); owner.addEventListener('change', update);
      clear.addEventListener('click', () => { query.value = ''; owner.value = ''; update(); query.focus(); });
      root.append(form, count, grid); update(); return;
    }
    const node = R.nodes.get(entry);
    if (!node || !guides.has(entry)) {
      root.append(el('h1', 'Explanation unavailable'), el('p',
        node ? 'A source-supported explanation for this entry is being prepared. Its existing dossier and captured documents remain available.' :
          'This exact project identity is not present in the atlas.', 'missing'));
      if (node) root.append(R.projectLink(entry)); return;
    }
    root.append(R.badge(), el('h1', node.name), R.technicalPanel(node));
  }
  function technicalSourceView(params) {
    R.documentView(params, data.library, projects, technicalSourceHref, 'Explanation sources');
  }
  Object.assign(R, {technicalView, technicalSourceView, technicalSourceHref, technicalGuides: guides,
    technicalReferences: references, technicalData: data});
})();
