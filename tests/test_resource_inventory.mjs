// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Resource inventory public API and CSV consumer tests

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {readSelection, selectionHash, selectedRecords, selectionCsv, selectionFilename}
  from '../docs/atlas/resource-inventory.js';

const data = JSON.parse(await readFile(new URL('../docs/atlas/public_resources_data.json', import.meta.url), 'utf8'));

function parseCsv(csv) {
  const result = spawnSync('python3', ['-c',
    "import csv,io,json,sys; print(json.dumps(list(csv.DictReader(io.StringIO(sys.stdin.read().lstrip(chr(65279)), newline=''))),ensure_ascii=False))"],
    {input: csv, encoding: 'utf8', maxBuffer: Math.max(1_048_576, Buffer.byteLength(csv, 'utf8') * 4)});
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}

test('each view selects its complete, unchanged dated source population', () => {
  for (const [view, expected] of [
    ['needs', data.needs], ['candidates', data.candidates],
    ['people', data.planning_estimates.filter(row => row.kind === 'people')],
    ['spaces', data.planning_estimates.filter(row => row.kind === 'space')]
  ]) {
    assert.deepEqual(selectedRecords(data, readSelection('#view=' + view, data)), expected);
  }
});

test('every group and scope filters actual source records across all four views', () => {
  for (const group of data.groups) {
    for (const view of ['needs', 'candidates', 'people', 'spaces']) {
      for (const scope of ['project', 'group-wide']) {
        const selection = readSelection(new URLSearchParams({view, group: group.id, scope}).toString(), data);
        const rows = selectedRecords(data, selection);
        const all = selectedRecords(data, readSelection('#view=' + view, data));
        assert.deepEqual(rows, all.filter(row => row.group === group.id &&
          (scope === 'group-wide' ? row.project_ids.length === 0 : row.project_ids.length > 0)));
      }
    }
  }
});

test('verification classes keep independent pages, group reports and unchecked names separate', () => {
  for (const [verification, expected] of [
    ['independent', data.candidates.filter(row => row.source_read === true)],
    ['source-reported', data.candidates.filter(row => row.verification_state === 'source-reported')],
    ['preliminary-memory', data.candidates.filter(row => row.verification_state === 'preliminary-memory')]
  ]) {
    const rows = selectedRecords(data, readSelection('#view=candidates&verification=' + verification, data));
    assert.deepEqual(rows, expected);
    assert.ok(rows.length > 0);
  }
});

test('all active filters survive an encoded Unicode share-link round trip', () => {
  const selection = readSelection(new URLSearchParams({
    view: 'candidates', group: data.groups[0].id, scope: 'project',
    verification: 'source-reported', q: 'Žilina + "data", room\n温度'
  }).toString(), data);
  assert.deepEqual(readSelection(selectionHash(selection), data), selection);
  const need = readSelection('#kind=' + encodeURIComponent(data.needs[0].kind.split(';')[0]), data);
  assert.equal(readSelection(selectionHash(need), data).kind, need.kind);
  assert.ok(selectedRecords(data, need).length);
});

test('invalid or inactive URL filters cannot silently hide rows', () => {
  const invalid = readSelection('#view=bogus&group=bogus&scope=bogus&kind=bogus&verification=bogus', data);
  assert.equal(selectionHash(invalid), '');
  assert.deepEqual(selectedRecords(data, invalid), data.needs);
  const candidate = readSelection('#view=candidates&kind=' + encodeURIComponent(data.needs[0].kind), data);
  assert.equal(candidate.kind, '');
  assert.equal(selectedRecords(data, candidate).length, data.candidates.length);
  const people = readSelection('#view=people&verification=independent&kind=vendor-usage', data);
  assert.equal(people.verification, '');
  assert.equal(people.kind, '');
});

test('search handles case, spaces and a no-result selection', () => {
  const id = data.candidates[0].id;
  const found = selectedRecords(data, readSelection('#view=candidates&q=' + encodeURIComponent('  ' + id.toUpperCase() + '  '), data));
  assert.ok(found.some(row => row.id === id));
  assert.equal(selectedRecords(data, readSelection('#q=NO_RECORD_MATCH_7a2b86c1', data)).length, 0);
});

test('a standard CSV consumer recovers all source fields for every inventory view', () => {
  for (const view of ['needs', 'candidates', 'people', 'spaces']) {
    const selection = readSelection('#view=' + view, data);
    const originals = selectedRecords(data, selection);
    const url = 'https://example.invalid/atlas/resources.html' + selectionHash(selection);
    const csv = selectionCsv(data, selection, url);
    assert.ok(csv.startsWith('\uFEFF'));
    const rows = parseCsv(csv);
    assert.equal(rows.length, originals.length);
    for (const [index, row] of rows.entries()) {
      const original = originals[index];
      assert.deepEqual(JSON.parse(row.source_record_json), original);
      assert.equal(row.record_id, original.id);
      assert.equal(row.record_type, view);
      assert.equal(row.source_date, original.as_of);
      assert.equal(row.source_sha256, original.source_sha256 || '');
      assert.equal(row.source_url, original.source || '');
      assert.equal(row.snapshot_as_of, data.as_of);
      assert.equal(row.selection_url, url);
      assert.deepEqual(JSON.parse(row.planning_values), original.values || {});
    }
  }
});

test('CSV escaping protects formula-like source text and keeps its untouched original', () => {
  for (const text of ['=SUM(1,2)', '+1+2', '-1+2', '@SUM(A1)', '  =2+3', '\t=2+3', '\r=2+3', '\n=2+3']) {
    const original = {...data.needs[0], need: text};
    const fixture = {...data, needs: [original]};
    const rows = parseCsv(selectionCsv(fixture, readSelection('', fixture), 'https://example.invalid/'));
    assert.equal(rows[0].title, "'" + text);
    assert.deepEqual(JSON.parse(rows[0].source_record_json), original);
  }
});

test('CSV preserves commas, quotes, newlines and Unicode in the actual export path', () => {
  const original = {...data.needs[0], need: 'Žilina, "research"\r\n温度\nMünchen'};
  const fixture = {...data, needs: [original]};
  const rows = parseCsv(selectionCsv(fixture, readSelection('', fixture), 'https://example.invalid/'));
  assert.equal(rows[0].title, original.need);
  assert.deepEqual(JSON.parse(rows[0].source_record_json), original);
});

test('filtered CSV rows equal the selected view rather than the whole source inventory', () => {
  const selection = readSelection('#view=candidates&verification=independent', data);
  const rows = parseCsv(selectionCsv(data, selection, 'https://example.invalid/'));
  assert.deepEqual(rows.map(row => row.record_id), data.candidates.filter(row => row.source_read).map(row => row.id));
});

test('download filenames carry the source snapshot date and selected view', () => {
  for (const view of ['needs', 'candidates', 'people', 'spaces']) {
    const selection = readSelection('#view=' + view + '&group=' + data.groups[0].id, data);
    assert.equal(selectionFilename(data, selection),
      'anulum-' + data.groups[0].id.toLowerCase() + '-' + view + '-' + data.as_of.slice(0, 10) + '.csv');
  }
});

test('an empty selection produces only the documented CSV header', () => {
  const selection = readSelection('#q=NO_RECORD_MATCH_7a2b86c1', data);
  assert.equal(parseCsv(selectionCsv(data, selection, 'https://example.invalid/')).length, 0);
});
