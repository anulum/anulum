// SPDX-License-Identifier: AGPL-3.0-or-later
// Commercial license available
// © Concepts 1996–2026 Miroslav Šotek. All rights reserved.
// © Code 2020–2026 Miroslav Šotek. All rights reserved.
// ORCID: 0009-0009-3560-0851
// Contact: www.anulum.li | protoscience@anulum.li
// ANULUM — Resource coverage through real map and inventory routes

/**
 * Compare the coverage display with actual inventory navigation and rendered source records.
 * @param {object} page Real Playwright Page in a fresh caller-owned context.
 * @param {{baseUrl: string}} options Local atlas URL.
 * @returns {Promise<object>} Actual route, group, pending-field and mobile observations.
 */
export default async function checkResourceCoverage(page, {baseUrl}) {
  const base = baseUrl.replace(/\/$/, '') + '/';
  async function checkAssetVersions() {
    return page.evaluate(async () => {
      const assets = [...document.querySelectorAll('script[src],link[rel="stylesheet"]')]
        .map(node => node.src || node.href)
        .filter(url => /\/(?:resource-coverage\.(?:js|css)|reader-resources\.js|resource-explorer\.js)(?:\?|$)/.test(url));
      if (assets.length !== 3) throw new Error('Missing content-bound resource entrypoints');
      for (const url of assets) {
        const response = await fetch(url, {cache:'no-store'});
        if (!response.ok) throw new Error('Unavailable resource asset');
        const digest = await crypto.subtle.digest('SHA-256', await response.arrayBuffer());
        const hex = [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2,'0')).join('');
        if (new URL(url).searchParams.get('v') !== hex) throw new Error('Resource asset version differs from served bytes');
      }
      return assets.length;
    });
  }

  const check = (ok, message) => { if (!ok) throw new Error(message); };
  const errors = [], httpFailures = [], report = {groups: [], mobile: []};
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => {
    if (response.url().startsWith(base) && response.status() >= 400) httpFailures.push(response.url());
  });
  await page.goto(base + 'index.html#view=resources');
  const coverage = page.getByRole('region', {name: 'Resource inventory coverage and open quantities'});
  await coverage.waitFor();
  await checkAssetVersions();
  const mainText = await coverage.innerText();
  check(mainText.includes('before filters') && mainText.includes('Source snapshot: 2026-10-13'), 'Snapshot scope and source date');
  check(mainText.includes('does not mean that the group has no resource needs'), 'Missing source is not zero need');
  check(mainText.includes('not equipment counts, hires, floor-area totals'), 'No additive procurement or institute totals');
  await coverage.locator('summary').click();
  const discovery = coverage.locator('[data-coverage-group="SCIENTIFIC-DISCOVERY-AND-EXPERIMENTATION"]');
  await discovery.waitFor();
  await discovery.getByRole('link', {name: 'Needs', exact: true}).click();
  await page.waitForURL(url => url.pathname.endsWith('/resources.html'));
  await page.locator('#counter').filter({hasText: 'matching'}).waitFor();
  await checkAssetVersions();
  check(await page.locator('#results article').count() === 0, 'Actual absent discovery population');
  check(await page.locator('#download-selection').isDisabled(), 'Missing source cannot download invented rows');
  const data = await page.locator('#resource-data').evaluate(node => JSON.parse(node.textContent));
  const explorer = page.getByRole('region', {name: 'Resource inventory coverage and open quantities'});
  check(await explorer.innerText() === mainText, 'Same full-population coverage on map and filtered explorer');
  await explorer.locator('summary').click();
  for (const group of data.groups) {
    const row = explorer.locator('[data-coverage-group="' + group.id + '"]');
    const label = await row.innerText();
    await page.locator('#group').selectOption(group.id);
    for (const [view, noun] of [['needs', 'needs'], ['candidates', 'acquisition alternatives']]) {
      await page.locator('#' + view + '-tab').click();
      const count = await page.locator('#results article').count();
      check(label.includes(count + ' ' + noun), 'Coverage matches actual selected ' + group.id + '/' + view);
      report.groups.push({group: group.id, view, count});
    }
  }
  await page.locator('#reset-selection').click();
  await page.locator('#needs-tab').click();
  const unresolved = await page.locator('#results article').filter({hasText: 'Unknown; derivation pending'}).count();
  check((await explorer.locator('[data-coverage-metric="pending-needs"] strong').innerText()) === String(unresolved), 'Pending count matches actual displayed source fields');
  await page.locator('#candidates-tab').click();
  await page.locator('#group').selectOption('SCPN-SYSTEMS-INTEGRATION-AND-CONTROL');
  await page.locator('#verification').selectOption('independent');
  await page.locator('#search').fill('SSAT');
  check(await page.locator('#results article').count() === 1, 'Existing filtered acquisition search retained');
  check((await explorer.innerText()).includes('694 acquisition alternatives'), 'Portfolio coverage survives selection filters');
  await page.setViewportSize({width:390,height:844});
  for (const [name, route] of [['map', 'index.html#view=resources'], ['inventory', 'resources.html']]) {
    await page.goto(base + route);
    const panel = page.getByRole('region', {name: 'Resource inventory coverage and open quantities'});
    await panel.waitFor(); await panel.locator('summary').click();
    const size = await page.evaluate(() => ({viewport:innerWidth,client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
    check(size.viewport === 390 && size.scroll <= size.client, 'Mobile overflow ' + name);
    check(await panel.locator('a').count() === data.groups.length * 4, 'Every group and view remains linked');
    report.mobile.push({name,...size});
  }
  check(!errors.length && !httpFailures.length, 'Page errors or failed assets: ' + JSON.stringify({errors,httpFailures}));
  report.pendingNeeds = unresolved; report.errors = errors; report.httpFailures = httpFailures;
  return report;
}
