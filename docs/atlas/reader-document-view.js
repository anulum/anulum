// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Chapter navigation and line-addressable document reading

(() => {
  'use strict';
  const R = window.AtlasReader, {el, link, facts, disclosure} = R;
  function documentView(params, data, projects, documentHref = R.documentHref, catalogueTitle = 'Repository documents') {
    const entry = params.get('entry') || '', label = params.get('document') || '', node = R.nodes.get(entry);
    const doc = projects.get(entry)?.documents.find(row => row.label === label);
    const root = R.clear([[catalogueTitle, documentHref('')], ...(node ? [[node.name, documentHref(entry)]] : [])]);
    if (!node || !doc) {
      root.append(el('h1', 'Document unavailable'), el('p', 'This exact project and document pair is not present in the dated source capture.', 'missing')); return;
    }
    const sourceCapture = doc.captured_at_utc || data.captured_at_utc;
    root.dataset.documentEntry = entry; root.dataset.documentLabel = label;
    root.append(R.badge(), el('h1', node.name), el('p', label, 'document-file-title'),
      el('p', 'Source capture (UTC): ' + sourceCapture, 'caption'),
      el('p', 'Read this dated source alongside the project’s current scope. Private reference omissions are marked in the text.', 'notice'));
    const requested = params.get('line'), validLine = requested === null || (/^[1-9]\d*$/.test(requested) && Number.isSafeInteger(Number(requested)) && Number(requested) <= doc.lines.length);
    if (!validLine) root.append(el('p', 'The requested line is outside this captured document. The full dated document is shown below.', 'missing'));
    root.append(disclosure('Source and reading-view fingerprints', [
      el('p', data.scope), facts([['Source capture (UTC)', sourceCapture], ['Original source file', doc.source_label || label],
        ...(doc.source_state ? [['Source state', doc.source_state]] : []),
        ['Document text', doc.lines.length + ' lines · ' + doc.chapters.length + (doc.chapters.length === 1 ? ' chapter heading' : ' chapter headings')],
        ['Private references withheld', String(doc.private_references_withheld)]]),
      el('p', 'Whole original source · ' + doc.source_bytes + ' bytes'), el('p', doc.source_sha256, 'fingerprint'),
      el('p', 'Projected UTF-8 text · CRLF normalised and private references withheld'), el('p', doc.projection_sha256, 'fingerprint')]));
    const actions = el('div', undefined, 'context-links');
    actions.append(link('Project passport', R.href({project: entry})), link('Dated source context', R.href({project: entry, tab: 'sources'})),
      link('Other documents for this project', documentHref(entry)));
    const download = R.button('Download this reading view', () => {
      const url = URL.createObjectURL(new Blob([doc.lines.join('\n')], {type: 'text/plain;charset=utf-8'}));
      const anchor = el('a'); anchor.href = url; anchor.download = entry + '_' + label.replaceAll('/', '_') + '.txt';
      document.body.append(anchor); anchor.click(); anchor.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    }); actions.append(download); root.append(actions);
    const form = el('form', undefined, 'document-find'), input = el('input'); input.id = 'document-find'; input.type = 'search'; input.value = params.get('find') || '';
    const queryLabel = el('label', 'Find text in this document'); queryLabel.htmlFor = input.id;
    const status = el('p', undefined, 'caption'); status.setAttribute('role', 'status');
    let matches = [], current = -1;
    const previous = R.button('Previous match', () => go(-1)), next = R.button('Next match', () => go(1));
    form.append(queryLabel, input, previous, next, status); root.append(form);
    const layout = el('div', undefined, 'document-layout'), contents = el('nav', undefined, 'document-chapters'); contents.setAttribute('aria-label', 'Document chapters');
    contents.append(el('h2', 'Chapters'));
    for (const chapter of doc.chapters) {
      const target = link(chapter.title, documentHref(entry, label, chapter.line)); target.dataset.chapterLine = String(chapter.line);
      target.style.setProperty('--chapter-level', chapter.level); contents.append(target);
    }
    if (!doc.chapters.length) contents.append(el('p', 'No Markdown chapter headings occur outside fenced code or comments. Use search or line links.', 'caption'));
    const text = el('section', undefined, 'document-text'); text.setAttribute('aria-label', 'Dated source text');
    const chapterLines = new Set(doc.chapters.map(chapter => chapter.line));
    const spans = doc.lines.map((line, i) => {
      const row = el('div', undefined, 'document-line'); row.id = 'source-line-' + (i + 1); row.dataset.sourceLine = String(i + 1); row.tabIndex = -1;
      if (chapterLines.has(i + 1)) row.classList.add('document-heading-line');
      const number = link(String(i + 1), documentHref(entry, label, i + 1), 'document-line-link'); number.setAttribute('aria-label', 'Link to line ' + (i + 1));
      const span = el('span', line, 'document-line-text'); row.append(number, span); text.append(row); return span;
    });
    function find() {
      const query = input.value; matches = []; current = -1;
      const pattern = query ? new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'giu') : null;
      spans.forEach((span, index) => {
        span.replaceChildren(); const line = doc.lines[index]; let end = 0;
        if (pattern) for (const match of line.matchAll(pattern)) {
          span.append(document.createTextNode(line.slice(end, match.index)), el('mark', match[0])); end = match.index + match[0].length;
          matches.push({line: index + 1, mark: span.lastChild});
        }
        span.append(document.createTextNode(line.slice(end)));
      });
      previous.disabled = next.disabled = !matches.length;
      status.textContent = query ? matches.length + ' literal text matches.' : 'Search within the dated document.';
      const address = new URLSearchParams(location.hash.slice(1)); if (query) address.set('find', query); else address.delete('find');
      history.replaceState(null, '', '#' + address.toString());
    }
    function go(direction) {
      if (!matches.length) return;
      current = current < 0 ? (direction > 0 ? 0 : matches.length - 1) : (current + direction + matches.length) % matches.length;
      for (const match of matches) match.mark.classList.remove('current-match');
      const match = matches[current]; match.mark.classList.add('current-match'); match.mark.scrollIntoView({block: 'center'});
      status.textContent = 'Match ' + (current + 1) + ' of ' + matches.length + ' · line ' + match.line;
      const address = new URLSearchParams(location.hash.slice(1)); address.set('line', String(match.line));
      history.replaceState(null, '', '#' + address.toString());
    }
    form.addEventListener('submit', event => { event.preventDefault(); go(1); }); input.addEventListener('input', find);
    layout.append(contents, text); root.append(layout); find();
    if (requested !== null && validLine) requestAnimationFrame(() => {
      const row = document.getElementById('source-line-' + requested); row.classList.add('selected-source-line'); row.focus({preventScroll: true}); row.scrollIntoView({block: 'center'});
    });
  }
  Object.assign(R, {documentView});
})();
