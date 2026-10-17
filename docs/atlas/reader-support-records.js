// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Source records in project partnership briefs

(() => {
  'use strict';
  const R = window.AtlasReader;
  const {el, facts, disclosure, link} = R;
  const supplied = value => value || 'Not supplied in this snapshot';

  function source(row) {
    const box = el('div', undefined, 'brief-source');
    box.append(el('p', supplied(row.author) + ' · ' + supplied(row.as_of), 'caption'));
    if (row.basis) box.append(el('p', row.basis, 'caption'));
    if (row.source_sha256) box.append(el('p', 'Source fingerprint: ' + row.source_sha256, 'fingerprint'));
    return box;
  }

  function projects(ids) {
    const box = el('p', undefined, 'brief-associations');
    box.append(document.createTextNode('Project associations stated in source: '));
    if (!ids.length) box.append(document.createTextNode('group-wide; no project allocation'));
    ids.forEach((id, i) => { if (i) box.append(document.createTextNode('; ')); box.append(R.projectLink(id)); });
    return box;
  }

  function need(row) {
    const box = el('article', undefined, 'brief-record'); box.dataset.need = row.id;
    box.append(el('h3', row.need), el('p', row.state, 'caption'), el('p', 'Expected use stated in source: ' + row.unlocks),
      facts([['Quantity', supplied(row.quantity)], ['Price basis', supplied(row.price)], ['Timing', supplied(row.when)],
        ['Ownership / access', supplied(row.own_or_access)], ['Partner profile', supplied(row.partner_slot)]]), projects(row.project_ids));
    if (row.preliminary_price_class) box.append(el('p', 'Preliminary class: ' + row.preliminary_price_class), el('p', row.class_basis, 'caption'));
    box.append(disclosure('Current observations and source scope', [el('p', row.today), source(row)]));
    return box;
  }

  function candidate(row) {
    const classification = row.source_read ? 'Primary page read in dated intake; fit remains unconfirmed' :
      row.verification_state === 'source-reported' || row.source_supplied ? 'Manager source report; independent review incomplete' :
        'Preliminary option; independent review incomplete';
    const children = [el('p', classification, 'caption'), el('p', row.fit_state, 'notice'),
      facts([['Publisher / maker as recorded', supplied(row.maker)], ['Recorded purpose', supplied(row.need)],
        ['Ownership / access', supplied(row.own_or_access)], ['Quantity', supplied(row.quantity)], ['Price basis', supplied(row.price)]]),
      el('p', row.catalogue_scope), projects(row.project_ids), source(row)];
    if (/^https?:\/\//.test(row.source || '')) children.push(link('Dated source: ' + row.source, row.source));
    const box = disclosure(row.item, children); box.dataset.acquisition = row.id;
    return box;
  }

  function partner(row) {
    const box = disclosure(row.gap, [el('p', row.state, 'notice'), facts([
      ['Profile sought', row.profile], ['Contribution and reciprocal benefit', row.brings_gains], ['First discussion scope', row.first_step]]),
      projects(row.project_ids || []), source(row)]);
    box.dataset.partner = row.id;
    return box;
  }

  function estimate(row) {
    const box = disclosure(row.title, [el('p', row.kind + ' · ' + row.state, 'notice'),
      facts(Object.entries(row.values)), projects(row.project_ids), source(row)]);
    box.dataset.estimate = row.id;
    return box;
  }

  Object.assign(R, {supportRecords: {need, candidate, partner, estimate}});
})();
