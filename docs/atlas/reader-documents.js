// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Dated document catalogue and exact source associations

(() => {
  'use strict';
  const R = window.AtlasReader, {el, href, link} = R;
  const data = JSON.parse(document.getElementById('document-library-data').textContent);
  const projects = new Map(data.projects.map(row => [row.project_id, row]));
  const documentHref = (entry, document, line) => href({view: 'documents', entry,
    ...(document ? {document} : {}), ...(line ? {line: String(line)} : {})});

  function documentCatalogue(params) {
    const entry = params.get('entry') || '', programme = params.get('programme') || '', term = params.get('q') || '';
    const root = R.clear([['Repository documents', null]]);
    root.append(el('h1', 'Read the repository documents'), el('p',
      data.documentation_bindings + ' captured documentation files across ' + data.entries_with_documents + ' entries. Read complete dated text, follow chapters and link to individual lines.', 'lede'),
      el('p', data.scope, 'notice'), el('p', 'Source capture (UTC): ' + data.captured_at_utc, 'caption'));
    if (entry && !R.nodes.has(entry)) { root.append(el('p', 'This project identity is not present in this atlas.', 'missing')); return; }
    if (entry) root.append(R.projectLink(entry, 'Return to ' + R.nodes.get(entry).name));
    if (programme && !R.groups.has(programme)) { root.append(el('p', 'This owning programme is not present in this atlas.', 'missing')); return; }
    const form = el('form', undefined, 'document-search'), query = el('input'), owner = el('select');
    query.id = 'document-library-query'; query.type = 'search'; query.value = term;
    query.placeholder = 'Project, file name or document text';
    const queryLabel = el('label', 'Search captured documentation'); queryLabel.htmlFor = query.id;
    owner.id = 'document-library-owner';
    const ownerLabel = el('label', 'Owning programme'); ownerLabel.htmlFor = owner.id;
    const all = el('option', 'All programmes'); all.value = ''; owner.append(all);
    for (const [id] of R.groups) { const option = el('option', R.groupName(id)); option.value = id; owner.append(option); }
    owner.value = programme;
    const clear = el('button', 'Clear filters'); clear.type = 'button';
    form.append(queryLabel, query, ownerLabel, owner, clear);
    const results = el('div', undefined, 'document-catalogue'), count = el('p', undefined, 'caption'); count.setAttribute('role', 'status');
    function update() {
      results.replaceChildren(); const q = query.value.trim().toLowerCase(); let matchingFiles = 0, matchingEntries = 0;
      for (const node of R.atlas.nodes) {
        if ((entry && node.id !== entry) || (owner.value && !node.owning_groups.includes(owner.value))) continue;
        const documents = projects.get(node.id).documents.filter(doc => !q ||
          (node.id + '\n' + node.name + '\n' + doc.label + '\n' + doc.lines.join('\n')).toLowerCase().includes(q));
        if (!documents.length) continue;
        matchingEntries++; matchingFiles += documents.length;
        const card = el('article', undefined, 'document-project'); card.dataset.documentProject = node.id;
        const title = el('h2'); title.append(R.projectLink(node.id)); card.append(R.badge(), title,
          el('p', node.owning_groups.map(R.groupName).join(' · '), 'caption'));
        const list = el('ul');
        for (const doc of documents) {
          const item = el('li'); item.append(link(doc.label, documentHref(node.id, doc.label)),
            el('span', ' · ' + doc.lines.length + ' lines · ' + doc.chapters.length + ' chapter headings', 'caption')); list.append(item);
        }
        card.append(list); results.append(card);
      }
      count.textContent = matchingFiles + ' documentation files in ' + matchingEntries + ' entries match these filters.';
      if (!matchingFiles) results.append(el('p', entry && !projects.get(entry)?.documents.length ?
        'This bounded source capture supplies no selected documentation file for the entry. Sources may exist elsewhere; its project dossier remains available.' :
        'No captured documentation matches these filters.', 'missing'));
      history.replaceState(null, '', href({view: 'documents', ...(entry ? {entry} : {}),
        ...(owner.value ? {programme: owner.value} : {}), ...(query.value ? {q: query.value} : {})}));
    }
    form.addEventListener('submit', event => { event.preventDefault(); update(); });
    query.addEventListener('input', update); owner.addEventListener('change', update);
    clear.addEventListener('click', () => { query.value = ''; owner.value = ''; update(); query.focus(); });
    root.append(form, count, results); update();
  }

  function documentsView(params) {
    if (params.has('document')) R.documentView(params, data, projects);
    else documentCatalogue(params);
  }
  Object.assign(R, {documentsView, documentHref, documentProjects: projects});
})();
