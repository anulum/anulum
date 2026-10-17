// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Explorer routing and page focus

(() => {
  'use strict';
  const R = window.AtlasReader;
  document.querySelector('.skip-link').addEventListener('click', event => {
    event.preventDefault();
    const main = document.getElementById('main');
    main.focus({preventScroll: true}); main.scrollIntoView({block: 'start'});
  });
  function render(initial = false) {
    if (R.cleanupMap) { R.cleanupMap(); R.cleanupMap = null; }
    const params = new URLSearchParams(location.hash.slice(1));
    const view = params.get('view') || 'overview';
    document.body.classList.toggle('support-view', view === 'support');
    if (view === 'map') R.semanticMap(params);
    else if (view === 'coverage') R.coverageView(params);
    else if (view === 'documents') R.documentsView(params);
    else if (view === 'compare') R.comparisonView(params);
    else if (view === 'technical') R.technicalView(params);
    else if (view === 'technical-source') R.technicalSourceView(params);
    else if (view === 'support') R.supportBrief(params.get('entry') || '');
    else if (params.has('project')) R.passport(params.get('project'));
    else if (params.has('group')) R.group(params.get('group'));
    else if (view === 'overview') R.overview();
    else if (view === 'guides') R.guidedPaths();
    else if (view === 'partners' || view === 'search') R.searchView(view === 'partners', params.get('scope') || '', params.get('q') || '');
    else if (view === 'resources') R.resourceView(params.get('resource') || '');
    else if (view === 'history') R.history();
    else if (view === 'source-updates') R.sourceUpdateIndex();
    else if (view === 'visuals') R.visualIndex(params);
    else R.unknown();
    for (const item of document.querySelectorAll('[data-view]')) {
      if ((view === 'map' || (!params.has('project') && !params.has('group'))) && item.dataset.view === view) item.setAttribute('aria-current', 'page');
      else item.removeAttribute('aria-current');
    }
    const title = document.querySelector('#content h1')?.textContent || 'Research programme';
    document.title = title + ' · ANULUM';
    if (!initial) { document.getElementById('main').focus({preventScroll: true}); window.scrollTo(0, 0); }
    if (params.get('section') === 'figures') requestAnimationFrame(() => document.getElementById('figures')?.scrollIntoView({block: 'start'}));
  }
  window.addEventListener('hashchange', () => render(false));
  render(true);
})();
