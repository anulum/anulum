// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Source-bound resource coverage and unresolved quantities

(() => {
  'use strict';
  const pending = new Set(['', 'unknown; derivation pending', 'not fixed', 'not specified', '—']);
  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  /**
   * Render coverage of the complete supplied snapshot, independently of selection filters.
   * Counts refer to records; supplied quantities retain their own verification scope.
   * @param {object} data Source-bound atlas resource inventory.
   * @returns {HTMLElement} Accessible coverage and source-gap section.
   */
  function render(data) {
    const rows = data.groups.map(group => ({...group,
      needs: data.needs.filter(row => row.group === group.id),
      candidates: data.candidates.filter(row => row.group === group.id),
      planning: data.planning_estimates.filter(row => row.group === group.id)}));
    const covered = rows.filter(row => row.needs.length).length;
    const unresolved = records => records.filter(row =>
      pending.has((row.quantity || '').trim().toLowerCase())).length;
    const box = element('section', undefined, 'resource-coverage');
    box.setAttribute('aria-label', 'Resource inventory coverage and open quantities');
    box.append(element('h2', 'Coverage and quantities still to resolve'),
      element('p', 'Source snapshot: ' + data.as_of.slice(0, 10)
        + '. This covers the complete supplied dataset, before filters. Newer group work may be awaiting reconciliation.', 'coverage-source'));
    const summary = element('div', undefined, 'coverage-grid');
    for (const [value, label, key] of [
      [covered + ' / ' + rows.length, 'groups with detailed need records', 'groups'],
      [data.needs.length, 'requirement records', 'needs'],
      [data.candidates.length, 'acquisition alternatives', 'candidates'],
      [unresolved(data.needs), 'requirements with quantity missing or pending', 'pending-needs']]) {
      const card = element('div', undefined, 'coverage-stat');
      card.dataset.coverageMetric = key;
      card.append(element('strong', String(value)), element('span', label)); summary.append(card);
    }
    box.append(summary, element('p', unresolved(data.candidates) + ' of ' + data.candidates.length
      + ' acquisition alternatives have blank or explicitly pending quantity fields. Other supplied values retain their original meaning; they are not verified purchase quantities.'),
      element('p', 'Records and alternatives are not equipment counts, hires, floor-area totals or an additive budget. Shared capacity and current holdings still need their own evidence.'));
    const missing = rows.filter(row => !row.needs.length);
    if (missing.length) box.append(element('p', 'Detailed need records are absent from this snapshot for '
      + missing.map(row => row.name).join('; ')
      + '. This does not mean that the group has no resource needs.', 'coverage-gap'));
    const detail = element('details');
    detail.append(element('summary', 'Compare group record coverage and open each inventory'));
    const list = element('ul', undefined, 'coverage-groups');
    for (const row of rows) {
      const item = element('li'); item.dataset.coverageGroup = row.id;
      item.append(element('strong', row.name), element('span', row.needs.length + ' needs · '
        + row.candidates.length + ' acquisition alternatives · ' + row.planning.length + ' preliminary people/space records'));
      const links = element('span', undefined, 'coverage-links');
      for (const [title, view] of [['Needs', 'needs'], ['Acquisition alternatives', 'candidates'], ['People', 'people'], ['Spaces', 'spaces']]) {
        const link = element('a', title);
        link.href = 'resources.html#' + new URLSearchParams({view, group: row.id});
        links.append(link);
      }
      item.append(links); list.append(item);
    }
    detail.append(list); box.append(detail);
    return box;
  }
  window.AtlasResourceCoverage = Object.freeze({render});
})();
