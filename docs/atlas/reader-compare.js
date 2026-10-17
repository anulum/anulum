// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Source-supported system comparison

(() => {
  'use strict';
  const R = window.AtlasReader, {el, link, href} = R;
  const defaults = ['SCPN-TOKAMAK-CORE', 'SCPN-STELLARATOR-CORE', 'SCPN-ICF-LASER-CORE'];
  const sections = [['purpose', 'Purpose'], ['scope', 'Scope of the explanation'], ['implementation', 'Implemented in the current source'], ['inputs', 'What goes in'],
    ['outputs', 'Source-described result artefacts'], ['model_layers', 'Models and what their results mean'],
    ['components', 'Component responsibilities'], ['connections', 'Documented connections and ownership'],
    ['external_roles', 'Separately owned dependency roles'], ['limits', 'Limits when interpreting a result'],
    ['source_notes', 'Where source records differ']];
  function comparisonView(params) {
    const requested = params.has('entries') ? (params.get('entries') ? params.get('entries').split(',') : []) : defaults;
    const root = R.clear([['Compare systems', null]]);
    root.append(el('h1', 'Compare how the systems work'), el('p',
      'Choose two or three systems and read their responsibilities, result artefacts and documented connections alongside each other.', 'lede'),
      el('p', R.technicalData.state, 'notice'), el('p',
        'These are dated source descriptions. Performance, scientific qualification and budgets require their own evidence; this comparison supplies no ranking or combined totals.', 'caption'));
    if (requested.length > 3 || new Set(requested).size !== requested.length || requested.some(id => !R.technicalGuides.has(id))) {
      root.append(el('p', 'This comparison requires distinct project identities with available explanations, and at most three selected systems.', 'missing'),
        link('Choose systems', href({view: 'compare'}))); return;
    }
    const selected = new Set(requested), form = el('form', undefined, 'comparison-picker');
    const fieldset = el('fieldset'), legend = el('legend', 'Select up to three systems'); fieldset.append(legend);
    const choices = el('div', undefined, 'comparison-choices'), inputs = new Map();
    for (const [id] of R.technicalGuides) {
      const node = R.nodes.get(id), label = el('label', undefined, 'comparison-choice'), input = el('input');
      input.type = 'checkbox'; input.name = 'systems'; input.value = id; input.checked = selected.has(id);
      const text = el('span'); text.append(el('strong', node.name), el('span', node.owning_groups.map(R.groupName).join(' · '), 'caption'));
      label.append(input, text); choices.append(label); inputs.set(id, input);
      input.addEventListener('change', () => { if (input.checked) selected.add(id); else selected.delete(id); update(); });
    }
    fieldset.append(choices); form.append(fieldset);
    const count = el('p', undefined, 'caption'); count.setAttribute('role', 'status'); count.id = 'comparison-status'; fieldset.setAttribute('aria-describedby', count.id);
    const clear = R.button('Clear selection', () => { selected.clear(); update(); inputs.values().next().value.focus(); });
    form.append(clear, count);
    const results = el('div', undefined, 'comparison-results'); root.append(form, results);
    function update() {
      for (const [id, input] of inputs) { input.checked = selected.has(id); input.disabled = selected.size === 3 && !input.checked; }
      count.textContent = selected.size + ' of 3 systems selected. ' + (selected.size === 3 ? 'Remove one to choose a different system.' : selected.size === 2 ? 'You can add one more system.' : 'Choose at least two to compare.');
      history.replaceState(null, '', href({view: 'compare', entries: [...selected].join(',')}));
      results.replaceChildren(); results.style.setProperty('--comparison-columns', Math.max(1, selected.size));
      if (selected.size < 2) { results.append(el('p', 'Select two or three systems to show their source descriptions together.', 'missing')); return; }
      const summary = el('section', undefined, 'comparison-summary'); summary.append(el('h2', 'Selected systems'));
      const header = el('div', undefined, 'comparison-grid');
      for (const id of selected) {
        const node = R.nodes.get(id), card = el('article', undefined, 'comparison-project'); card.dataset.compareProject = id;
        const title = el('h3'); title.append(link(node.name, href({view: 'technical', entry: id})));
        card.append(R.badge(), title, el('p', node.owning_groups.map(R.groupName).join(' · '), 'caption'),
          el('p', 'Explanation source update (UTC): ' + R.technicalData.guide_source_captures[id], 'caption'));
        const actions = el('div', undefined, 'context-links'); actions.append(R.projectLink(id, 'Project passport'),
          link('Partnership brief', href({view: 'support', entry: id})), link('Locate in map', href({view: 'map', focus: id})));
        card.append(actions); header.append(card);
      }
      summary.append(header); results.append(summary);
      for (const [key, title] of sections) {
        const section = el('section', undefined, 'comparison-section'); section.dataset.compareSection = key; section.append(el('h2', title));
        const grid = el('div', undefined, 'comparison-grid');
        for (const id of selected) {
          const guide = R.technicalGuides.get(id), cell = el('div', undefined, 'comparison-cell'); cell.dataset.compareProject = id;
          cell.append(el('h3', R.nodes.get(id).name));
          const rows = ['purpose', 'scope'].includes(key) ? [guide[key]] : guide[key] || [];
          if (!rows.length) cell.append(el('p', 'This section has no supplied records in the dated explanation. Its scope and linked sources retain the documented boundary.', 'missing'));
          for (const row of rows) cell.append(R.technicalRecord(row)); grid.append(cell);
        }
        section.append(grid); results.append(section);
      }
    }
    form.addEventListener('submit', event => event.preventDefault()); update();
  }
  Object.assign(R, {comparisonView});
})();
