// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Source-preserving project passports

(() => {
  'use strict';
  const R = window.AtlasReader;
  const {el, link, href, list, facts, disclosure} = R;
  function section(title, items, missingText) {
    const box = el('section', undefined, 'passport-section'); box.append(el('h2', title));
    if (items?.length) box.append(list(items)); else box.append(R.missing(missingText || title));
    return box;
  }
  function evidence(n) {
    const d = n.dossier || {}, root = el('div');
    const explanation = R.technicalPanel(n); if (explanation) root.append(explanation);
    if (d.configurations?.length) {
      root.append(section('Reactor configurations', d.configurations));
      if (d.configuration_state) root.append(el('p', d.configuration_state, 'caption'));
    }
    const responsibility = d.scope?.length ? d.scope : d.responsibility;
    if (responsibility?.length) root.append(section('Responsibility', responsibility));
    if (n.repository_record) root.append(el('h2', 'Repository development'),
      el('p', n.repository_record.stage + ' · ' + n.repository_record.as_of),
      el('p', n.repository_record.basis, 'caption'));
    const current = el('section', undefined, 'passport-section'); current.append(el('h2', 'Source-reported current scope'));
    if (!d.current_surfaces?.length) current.append(R.missing('Detailed current capability evidence'));
    for (const surface of d.current_surfaces || []) {
      const children = [el('p', surface.maturity, 'notice'), ...((surface.description || []).map(x => el('p', x)))];
      if (surface.evidence) children.push(el('p', 'Source: ' + surface.evidence, 'caption'));
      if (surface.verification_basis) children.push(el('p', surface.verification_basis, 'caption'));
      current.append(disclosure(surface.name, children));
    }
    root.append(current);
    const outputs = el('section', undefined, 'passport-section'); outputs.append(el('h2', 'Expected outputs and acceptance requirements'));
    if (d.acceptance_note) outputs.append(el('p', d.acceptance_note, 'notice'));
    if (!d.expected_outputs?.length) outputs.append(R.missing('Detailed output specification and acceptance criteria'));
    for (const output of d.expected_outputs || []) {
      const box = el('article', undefined, 'output-card'); box.append(el('h3', output.deliverable));
      box.append(el('p', 'Basis: ' + (output.basis || 'Source goal'), 'caption'));
      if (output.acceptance) box.append(el('p', 'Acceptance requirement: ' + output.acceptance));
      if (output.qualification_requirements) box.append(disclosure('Detailed qualification requirements',
        [el('p', output.qualification_requirements, 'preserve-lines')]));
      outputs.append(box);
    }
    root.append(outputs, section('Model and interface inputs', d.inputs), section('Intended result artifacts', d.outputs));
    if (d.inputs_basis) root.append(el('p', d.inputs_basis, 'caption'));
    if (d.outputs_basis) root.append(el('p', d.outputs_basis, 'caption'));
    if (d.programme_tracks?.length) {
      const box = el('section'); box.append(el('h2', 'Programme outputs in progress'));
      for (const track of d.programme_tracks) box.append(el('h3', track.name), el('p', track.scope));
      if (d.programme_basis) box.append(el('p', d.programme_basis, 'caption')); root.append(box);
    }
    root.append(section('Acceptance and next gates', d.acceptance));
    if (d.acceptance_basis) root.append(el('p', d.acceptance_basis, 'caption'));
    for (const [title, value] of [['Evidence state', d.evidence_state], ['Review scope', d.review_state],
      ['Critical modelling boundary', d.critical_boundary], ['Current project scope', n.boundary]]) {
      if (value) root.append(el('h2', title), el('p', value, 'notice'));
    }
    root.append(section('Model and implementation limits', d.limitations), section('Details being completed', d.open_fields));
    const sourceBox = el('section'); sourceBox.append(el('h2', 'Source records'));
    if (n.url && /^https?:\/\//.test(n.url)) sourceBox.append(link('Open project source', n.url));
    const sources = [...new Set([...(n.sources || []), ...(d.public_sources || [])])];
    for (const source of sources) if (/^https?:\/\//.test(source)) {
      const paragraph = el('p'); paragraph.append(link('Read group source', source)); sourceBox.append(paragraph);
    }
    for (const reference of d.references || []) {
      if (/^https?:\/\//.test(reference.url)) sourceBox.append(link(reference.title, reference.url),
        el('p', reference.scope, 'caption'), el('p', reference.source_revision, 'caption'));
    }
    if (d.source_records?.length) sourceBox.append(disclosure('Dated source fingerprints', d.source_records.flatMap(r =>
      [el('p', r.document), el('p', r.sha256, 'fingerprint')])));
    sourceBox.append(el('p', n.source_note, 'caption')); root.append(sourceBox); return root;
  }
  function partnership(n) {
    const root = el('section', undefined, 'passport-section'), d = n.dossier || {};
    root.append(el('h2', 'How a partner can contribute'));
    if (!d.partner_needs?.length && !n.partner_slots?.length) root.append(R.missing('A project-specific partner profile and reciprocal benefit'));
    if (d.partner_needs?.length) root.append(list(d.partner_needs));
    for (const slot of n.partner_slots || []) {
      root.append(disclosure(slot.gap, [el('p', slot.state, 'notice'), facts([
        ['Profile sought', slot.profile], ['Contribution and benefit', slot.brings_gains], ['First proposal', slot.first_step]]),
        el('p', slot.author + ' · ' + slot.as_of, 'caption')]));
    }
    root.append(link('Discuss this project →', 'mailto:protoscience@anulum.li?subject=' + encodeURIComponent('Partnership / ' + n.name)));
    return root;
  }
  function resources(n) {
    const root = el('div'); root.append(el('h2', 'Project-specific resource needs'));
    const rows = R.resources.needs.filter(r => r.project_ids.includes(n.id));
    if (!rows.length) root.append(el('p', 'No project-specific resource row is supplied. Group-wide needs remain separate.', 'missing'));
    for (const row of rows) root.append(disclosure(row.need, [el('p', 'Enables: ' + row.unlocks),
      facts([['Quantity', row.quantity], ['Price', row.price], ['Stage', row.when], ['Partner slot', row.partner_slot],
        ['Own / access', row.own_or_access || 'Choice being agreed']]), el('p', row.today), el('p', row.basis, 'caption'),
      el('p', row.author + ' · ' + row.as_of, 'caption')]));
    const groupRows = R.resources.needs.filter(r => r.group === n.group && !r.project_ids.length);
    root.append(disclosure('Group-wide requirements · ' + groupRows.length, [
      el('p', 'Shared group requirements are not allocated as additional project purchases.'),
      list(groupRows.map(r => r.need)), link('Explore group inventory', 'resources.html#group=' + encodeURIComponent(n.group))]));
    const candidates = R.resources.candidates.filter(c => c.project_ids.includes(n.id));
    root.append(disclosure('Acquisition planning records · ' + candidates.length, [
      el('p', 'Primary-page checks, manager source reports and preliminary proposals retain their verification scope. These are not validated hardware support.'),
      link('Read acquisition records and estimates', 'resources.html#group=' + encodeURIComponent(n.group))]));
    const shared = R.budget.shared.filter(s => s.related_needs?.some(r => r.project_ids.includes(n.id)));
    root.append(el('h2', 'Shared-resource associations'));
    if (!shared.length) root.append(el('p', 'No direct shared-resource association is supplied for this project; group discussions remain separate.', 'missing'));
    for (const item of shared) {
      const paragraph = el('p'); paragraph.append(link(item.name, href({view: 'resources', resource: item.id}))); root.append(paragraph);
    }
    root.append(el('p', 'Source scenarios are preliminary. Shared resources and overlapping uses are not summed as a project or institute budget.', 'notice'),
      link('Read budget and owner feedback', 'budget.html'));
    return root;
  }
  function overview(n) {
    const d = n.dossier || {}, root = el('div', undefined, 'passport-overview');
    const quick = el('div', undefined, 'passport-quick');
    for (const [title, value] of [['Role in the programme', d.purpose || n.function],
      ['Current source scope', d.current_surfaces?.length ? d.current_surfaces.map(s => s.name + ' · ' + s.maturity).join('; ') : null],
      ['Next expected output', d.expected_outputs?.[0]?.deliverable || d.outputs?.[0]],
      ['Acceptance requirement', d.expected_outputs?.[0]?.acceptance || d.acceptance?.[0]]]) {
      const box = el('section', undefined, 'quick-card'); box.append(el('h2', title));
      box.append(value ? el('p', value) : R.missing(title)); quick.append(box);
    }
    root.append(quick, el('p', d.acceptance_note || 'Expected outputs are requirements in progress. The passport does not treat a declared interface or release as physical or scientific acceptance.', 'notice'));
    const actions = el('div', undefined, 'context-links'); actions.append(
      link('Read the owning programme', href({group: n.group})),
      link('Read the partnership brief', href({view: 'support', entry: n.id})),
      link('Locate in the programme map', href({view: 'map', focus: n.id})),
      link('Open in the complete atlas', 'atlas_full.html#project=' + encodeURIComponent(n.id)));
    root.append(actions, R.visualPreview(n), partnership(n));
    const explanation = R.technicalPreview(n); if (explanation) root.append(explanation);
    const boundaries = [n.boundary, d.critical_boundary, ...(d.limitations || [])].filter(Boolean);
    if (boundaries.length) root.append(section('Current boundaries', boundaries));
    const g = R.groups.get(n.group); if (g?.ownership_note) root.append(el('p', g.ownership_note, 'caption'));
    return root;
  }
  function passport(id) {
    const n = R.nodes.get(id); if (!n) return R.unknown();
    const root = R.clear([[R.groupName(n.group), href({group: n.group})], [n.name, null]]);
    const head = el('section', undefined, 'passport-heading'); head.style.setProperty('--group-color', R.groups.get(n.group)?.color);
    head.append(R.badge(), el('p', n.kind, 'eyebrow'), el('h1', n.name), el('p', n.function, 'lede'));
    head.append(facts([['Owning group', n.owning_groups.map(R.groupName).join('; ')], ['Work phase', n.phase],
      ['Reported release', n.release || 'No independently released version stated'], ['Source date', n.as_of], ['Licence', n.licence]]));
    root.append(head);
    for (const limit of n.source_reported_limits || []) root.append(el('p', limit.text + ' ' + limit.state + ' ' + limit.author + ' · ' + limit.as_of, 'notice review-limit'));
    const labels = ['Overview', 'Outputs & evidence', 'Interfaces', 'Resources', 'Dated sources', 'Architecture & visuals'];
    const tablist = el('div', undefined, 'passport-tabs'); tablist.setAttribute('role', 'tablist'); tablist.setAttribute('aria-label', 'Project passport');
    const panels = [overview(n), evidence(n), el('div'), resources(n), R.sourceUpdatePanel(n), R.visualPanel(n)]; let graphRendered = false;
    const tabs = labels.map((label, i) => {
      const tab = el('button', label); tab.type = 'button'; tab.id = 'passport-tab-' + i;
      tab.setAttribute('role', 'tab'); tab.setAttribute('aria-controls', 'passport-panel-' + i);
      panels[i].id = 'passport-panel-' + i; panels[i].setAttribute('role', 'tabpanel');
      panels[i].setAttribute('aria-labelledby', tab.id); panels[i].tabIndex = 0;
      tab.addEventListener('click', () => activate(i)); return tab;
    });
    function activate(index) {
      tabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; panels[i].hidden = i !== index; });
      if (index === 2 && !graphRendered) { R.renderInterfaces(panels[2], n); graphRendered = true; }
    }
    tablist.addEventListener('keydown', event => {
      const current = tabs.indexOf(document.activeElement); if (current < 0) return;
      const next = {ArrowRight: (current + 1) % tabs.length, ArrowLeft: (current + tabs.length - 1) % tabs.length, Home: 0, End: tabs.length - 1}[event.key];
      if (next === undefined) return; event.preventDefault(); activate(next); tabs[next].focus();
    });
    tablist.append(...tabs); root.append(tablist, ...panels); const requestedTab = new URLSearchParams(location.hash.slice(1)).get('tab');
    activate(({outputs: 1, interfaces: 2, resources: 3, sources: 4, visuals: 5})[requestedTab] ?? 0);
  }
  Object.assign(R, {passport});
})();
