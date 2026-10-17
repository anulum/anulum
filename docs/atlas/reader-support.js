// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Project partnership briefs and detailed text export

(() => {
  'use strict';
  const R = window.AtlasReader;
  const {el, link, href, facts, list, disclosure} = R;

  function section(id, title, missing) {
    const box = el('section', undefined, 'brief-section'); box.id = id; box.append(el('h2', title));
    if (missing) box.append(el('p', missing, 'missing'));
    return box;
  }

  function download(root, id) {
    const lines = [...root.querySelectorAll('h1,h2,h3,h4,p,li,dt,dd,summary')].map(node => node.textContent.trim()).filter(Boolean);
    const url = URL.createObjectURL(new Blob([lines.join('\n\n') + '\n'], {type: 'text/plain;charset=utf-8'}));
    const a = link('', url); a.download = id.replace(/[^A-Za-z0-9._-]/g, '-') + '_partnership_brief.txt'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  function supportBrief(id) {
    const n = R.nodes.get(id); if (!n) return R.unknown();
    const d = n.dossier || {}, rows = R.supportRecords;
    const needs = R.resources.needs.filter(row => row.project_ids.includes(id));
    const candidates = R.resources.candidates.filter(row => row.project_ids.includes(id));
    const estimates = R.resources.planning_estimates.filter(row => row.project_ids.includes(id));
    const slots = n.partner_slots || [], profiles = d.partner_needs || [], outputs = d.expected_outputs || [];
    const root = R.clear([['Partnership brief', href({view: 'partners'})], [n.name, href({project: id})]]);
    const brief = el('article', undefined, 'support-brief'); brief.dataset.brief = id;
    brief.append(el('p', 'Partnership brief · work in progress', 'eyebrow'), R.badge(), el('h1', n.name),
      el('p', d.purpose || n.function, 'lede'), facts([
        ['Owning groups', n.owning_groups.map(R.groupName).join('; ')], ['Project source date', n.as_of],
        ['Resource snapshot date', R.resources.as_of], ['Work phase recorded in source', n.phase],
        ['Reported release', n.release || 'No independently released version stated']]),
      el('p', 'A discussion brief from dated source records. Expected outputs and requested contributions are separate from demonstrated capability, committed partners, owned equipment or allocated funding.', 'notice'));
    const actions = el('div', undefined, 'support-actions');
    actions.append(R.button('Download detailed brief (.txt)', () => download(brief, id)), R.button('Print brief', () => window.print()),
      link('Read project details', href({project: id})), link('Locate in the map', href({view: 'map', focus: id})),
      link('Discuss this project', 'mailto:protoscience@anulum.li?subject=' + encodeURIComponent('Partnership / ' + n.name)));
    brief.append(actions);
    const explanation = R.technicalPreview(n); if (explanation) brief.append(explanation);
    const counts = el('div', undefined, 'brief-counts');
    for (const [count, title] of [[outputs.length, 'expected-output records'], [needs.length, 'project-associated requirements'],
      [candidates.length, 'recorded acquisition options'], [slots.length + profiles.length, 'partner proposals or profiles']]) {
      const card = el('div'); card.append(el('strong', String(count)), el('p', title)); counts.append(card);
    }
    brief.append(counts);
    const outputBox = section('brief-outputs', 'What this project is expected to deliver', outputs.length ? '' :
      'No detailed expected-output record is supplied in this snapshot. The owning group is consolidating specifications; the purpose is not substituted for an accepted deliverable.');
    for (const output of outputs) {
      const box = el('article', undefined, 'brief-record'); box.dataset.output = output.deliverable;
      box.append(el('h3', output.deliverable), el('p', 'Basis: ' + (output.basis || 'Source goal'), 'caption'));
      if (output.acceptance) box.append(el('p', 'Acceptance requirement: ' + output.acceptance));
      if (output.qualification_requirements) box.append(disclosure('Detailed qualification requirements', [el('p', output.qualification_requirements, 'preserve-lines')]));
      outputBox.append(box);
    }
    if (d.acceptance_note) outputBox.append(el('p', d.acceptance_note, 'caption'));
    const partnerBox = section('brief-partners', 'Where a partner can contribute', slots.length || profiles.length ? '' :
      'No project-specific partner proposal is supplied in this snapshot. This brief does not infer a committed consortium or a validated fit.');
    if (profiles.length) partnerBox.append(el('h3', 'Source-reported expertise and access profiles'), list(profiles));
    for (const slot of slots) partnerBox.append(rows.partner(slot));
    const needBox = section('brief-needs', 'Requirements associated with this project', needs.length ? '' :
      'No requirement row explicitly names this project in this snapshot. Programme-wide requirements below remain separate.');
    needBox.append(el('p', 'Associations follow the source project IDs. A shared row is not an additional purchase per project; its stated use does not certify an expected output.', 'caption'));
    needBox.append(...needs.map(rows.need));
    const acquisitionBox = section('brief-acquisitions', 'Recorded acquisition options', candidates.length ? '' :
      'No acquisition-option row explicitly names this project. Programme inventory may contain wider options; none is assigned here by name matching.');
    acquisitionBox.append(el('p', 'These are dated records, with their own page-reading and fit-review state. They are not current quotations, buying recommendations or validated hardware/software support. No candidate-to-requirement join is inferred.', 'notice'),
      ...candidates.map(rows.candidate));
    const estimateBox = section('brief-estimates', 'People and space scenarios associated with this project', estimates.length ? '' :
      'No role or room scenario explicitly names this project in this snapshot. Programme-wide staffing and facilities remain separate.');
    estimateBox.append(el('p', R.resources.people_and_spaces, 'caption'), ...estimates.map(rows.estimate));
    const context = section('brief-context', 'Programme-wide context');
    context.append(el('p', 'The following records belong to the owning programmes. They are not additional project allocations, purchased resources, institute totals or an additive budget.', 'notice'));
    const owners = [...new Set(n.owning_groups)];
    for (const owner of owners) {
      const groupContext = el('section', undefined, 'brief-owner-context'); groupContext.dataset.owner = owner;
      groupContext.append(el('h3', R.groupName(owner)));
      const groupNeeds = R.resources.needs.filter(row => row.group === owner && !row.project_ids.length);
      const groupEstimates = R.resources.planning_estimates.filter(row => row.group === owner && !row.project_ids.length);
      const groupCandidates = R.resources.candidates.filter(row => row.group === owner && !row.project_ids.length);
      const resourceGroup = R.resources.groups.find(group => group.id === owner);
      if (resourceGroup) groupContext.append(el('p', resourceGroup.resource_inventory_state, 'caption'));
      if (resourceGroup?.starting_priorities) groupContext.append(disclosure('Manager’s preliminary starting sequence', [
        list(resourceGroup.starting_priorities.items), el('p', resourceGroup.starting_priorities.state, 'caption'),
        el('p', resourceGroup.starting_priorities.author + ' · ' + resourceGroup.starting_priorities.as_of, 'caption')]));
      groupContext.append(disclosure('Group-wide requirement records · ' + groupNeeds.length, groupNeeds.length ? groupNeeds.map(rows.need) :
        [el('p', 'No group-wide requirement record is supplied to this snapshot.', 'missing')]),
        disclosure('Group-wide role and room scenario records · ' + groupEstimates.length, groupEstimates.length ? groupEstimates.map(rows.estimate) :
          [el('p', 'No group-wide role or room scenario record is supplied.', 'missing')]),
        el('p', groupCandidates.length + ' additional group-wide acquisition options remain in the complete inventory; they are not assigned to this project.', 'caption'),
        link('Read this programme’s equipment, people and space inventory →', 'resources.html#group=' + encodeURIComponent(owner)));
      context.append(groupContext);
    }
    const shared = R.budget.shared.filter(row => row.groups.some(owner => owners.includes(owner)));
    context.append(el('h3', 'Shared-resource proposals involving the owning programmes'));
    if (!shared.length) context.append(el('p', 'No shared-resource family names these programmes in the supplied budget snapshot.', 'missing'));
    for (const item of shared) {
      const paragraph = el('p'); paragraph.dataset.sharedResource = item.id; paragraph.append(link(item.name, href({view: 'resources', resource: item.id})),
        document.createTextNode(' · ' + (item.related_needs.some(row => row.project_ids.includes(id)) ? 'direct project association in source' : 'programme-wide association')));
      context.append(paragraph);
    }
    context.append(el('p', 'Shared families are shown once even when several owning programmes name them. Budget scenarios retain their separate assumptions and overlaps. This brief computes no project or institute total.', 'notice'),
      link('Read separate budget scenarios →', 'budget.html'));
    const gates = section('brief-gates', 'Acceptance requirements and details still being completed');
    if (d.acceptance?.length) gates.append(list(d.acceptance));
    if (d.open_fields?.length) gates.append(el('h3', 'Open source fields'), list(d.open_fields));
    if (d.limitations?.length) gates.append(el('h3', 'Source limits'), list(d.limitations));
    if (!d.acceptance?.length && !d.open_fields?.length && !d.limitations?.length) gates.append(el('p', 'No detailed acceptance or open-field record is supplied in this snapshot.', 'missing'));
    if (d.review_state) gates.append(el('p', 'Dated dossier review state: ' + d.review_state, 'caption'));
    gates.append(el('p', 'Independent review, source admission and publication remain separately governed. This discussion brief does not close those gates.', 'caption'));
    const sourceBox = section('brief-sources', 'Read the project and its source context');
    const links = el('div', undefined, 'context-links'); links.append(
      link('Outputs and evidence in the project passport', href({project: id, tab: 'outputs'})),
      link('Dated source update', href({project: id, tab: 'sources'})),
      link('Project illustrations', href({project: id, tab: 'visuals'})),
      link('Declared interfaces', href({project: id, tab: 'interfaces'})), link('Owning programme', href({group: n.group})), link('Compare supplied source details', href({view: 'coverage', q: id})));
    sourceBox.append(links, R.directSourcePanel(n));
    for (const record of d.source_records || []) sourceBox.append(el('p', record.document, 'caption'), el('p', record.sha256, 'fingerprint'));
    brief.append(outputBox, partnerBox, needBox, acquisitionBox, estimateBox, context, gates, sourceBox);
    root.append(brief);
  }

  Object.assign(R, {supportBrief});
})();
