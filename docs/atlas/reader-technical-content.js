// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Source-supported project responsibilities and artefacts

(() => {
  'use strict';
  const R = window.AtlasReader, {el, link, href} = R;
  function citations(ids) {
    const root = el('div', undefined, 'technical-citations'); root.setAttribute('aria-label', 'Supporting source passages');
    for (const id of ids) {
      const row = R.technicalReferences.get(id), target = link(row.project + ' · ' + row.document + ' · lines ' + row.start + '–' + row.end,
        R.technicalSourceHref(row.project, row.document, row.start)); target.dataset.sourceReference = id; root.append(target);
    }
    return root;
  }
  function paragraph(row) {
    const root = el('div', undefined, 'technical-record'); root.append(el('p', row.text), citations(row.references)); return root;
  }
  function record(row) {
    const card = el('article', undefined, 'technical-record');
    if (row.project_id || row.title) {
      const heading = el('h4');
      if (row.project_id) heading.append(R.projectLink(row.project_id)); else heading.textContent = row.title;
      card.append(heading);
    }
    card.append(el('p', row.text), citations(row.references)); return card;
  }
  function records(title, key, items) {
    const root = el('section', undefined, 'technical-section'); root.dataset.guideSection = key; root.append(el('h3', title));
    const grid = el('div', undefined, 'technical-record-grid');
    for (const row of items || []) grid.append(record(row));
    root.append(grid); return root;
  }
  function technicalPanel(node) {
    const guide = R.technicalGuides.get(node.id); if (!guide) return null;
    const root = el('section', undefined, 'technical-panel'); root.dataset.technicalGuide = node.id;
    root.append(el('h2', 'How this system works'), el('p', R.technicalData.state, 'notice'),
      el('p', 'Explanation source update (UTC): ' + (R.technicalData.guide_source_captures[node.id] || R.technicalData.captured_at_utc) + '. Each cited document retains its own capture date and exact supporting passage.', 'caption'),
      paragraph(guide.purpose), el('h3', 'Scope of this explanation'), paragraph(guide.scope));
    if (guide.implementation?.length) root.append(records('Implemented in the current source', 'implementation', guide.implementation),
      el('p', 'This section describes inspected source. Execution, scientific and deployment acceptance require their own evidence.', 'caption'),
      link('View project architecture illustrations →', href({project: node.id, tab: 'visuals'})));
    root.append(records('What goes in', 'inputs', guide.inputs), records('Source-described result artefacts', 'outputs', guide.outputs),
      el('p', 'These artefacts describe the source’s responsibilities and target contracts. They do not add accepted output records or a readiness score to the atlas.', 'caption'),
      records('Component responsibilities', 'components', guide.components),
      el('p', 'Read these as responsibilities, rather than a prescribed linear runtime sequence. Coupling, feedback and separate consumer scopes follow the linked source.', 'caption'));
    if (guide.model_layers?.length) root.append(records('Models and what their results mean', 'model_layers', guide.model_layers));
    if (guide.connections.length) root.append(records('Documented connections and ownership', 'connections', guide.connections),
      el('p', 'Connection descriptions are source statements. The atlas graph and its source/proposal layers remain separate; current consumer acceptance needs its own evidence.', 'caption'));
    if (guide.external_roles?.length) root.append(records('Separately owned dependency roles', 'external_roles', guide.external_roles));
    root.append(records('Limits that matter when interpreting a result', 'limits', guide.limits));
    if (guide.source_notes?.length) root.append(records('Where source records differ', 'source_notes', guide.source_notes));
    const actions = el('div', undefined, 'context-links'); actions.append(link('Project passport', href({project: node.id})),
      link('Compare with another system', href({view: 'compare', entries: node.id})),
      link('Locate in the programme map', href({view: 'map', focus: node.id})),
      link('Read the partnership brief', href({view: 'support', entry: node.id})),
      link('Browse captured repository documents', R.documentHref(node.id))); root.append(actions);
    return root;
  }
  function technicalPreview(node) {
    const guide = R.technicalGuides.get(node.id); if (!guide) return null;
    const root = el('section', undefined, 'technical-preview'); root.dataset.technicalPreview = node.id;
    root.append(el('h2', 'How this system works'), el('p', guide.purpose.text),
      link('Read inputs, artefacts, responsibilities and source passages →', href({view: 'technical', entry: node.id})),
      link('Compare this system →', href({view: 'compare', entries: node.id})),
      el('p', 'Source-reading explanation · owning content review pending', 'caption')); return root;
  }
  Object.assign(R, {technicalPanel, technicalPreview, technicalRecord: record});
})();
