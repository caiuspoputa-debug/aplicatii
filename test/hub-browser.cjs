/* Local static-hub QA. No authentication, public downloads, or app data used. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { createHash } = require('node:crypto');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const expected = {
  'salon-android': ["1.0.23", "https://github.com/caiuspoputa-debug/agenda-salon/releases/download/v1.0.23/Agenda-Salon-1.0.23.apk"],
  'frizerie-android': ['5.0.14', 'https://github.com/caiuspoputa-debug/tool-upload-iphone/releases/download/v5.0.14/Agenda-Frizerie-5.0.14.apk'],
  'frizerie-iphone': ['5.0.14', 'https://caiuspoputa-debug.github.io/tool-upload-iphone/'],
  'trust-android': ['1.27', 'https://caiuspoputa-debug.github.io/trust-mc-apps/descarca/?platform=android'],
  'trust-iphone': ['1.27.0', 'https://caiuspoputa-debug.github.io/trust-mc-apps/descarca/?platform=iphone'],
  'geometrie-roti-android': ['0.3.3', 'https://github.com/caiuspoputa-debug/geometrie-roti/releases/download/v0.3.3/Geometrie-Roti-Test-0.3.3.apk']
};
const productFiles = ['index.html', 'styles.css', 'catalog.json', 'assets/mark.svg'].map(name => path.join(root, name));
for (const name of ['sw.js', 'app.js', 'manifest.webmanifest', 'pwa-storage.js']) {
  const file = path.resolve(root, '../tool-upload-iphone/docs', name);
  if (fs.existsSync(file)) productFiles.push(file);
}
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const fingerprints = productFiles.map(file => [file, hash(file)]);

(async () => {
  let server, browser;
  const errors = [], external = [];
  try {
    const catalog = JSON.parse(fs.readFileSync(path.join(root, 'catalog.json'), 'utf8'));
    assert.equal(catalog.apps.length, 4);
    for (const app of catalog.apps) for (const platform of ['android', 'iphone']) {
      if (['salon', 'geometrie-roti'].includes(app.id) && platform === 'iphone') { assert.equal(app[platform], null); continue; }
      const [version, url] = expected[app.id + '-' + platform];
      assert.equal(app[platform].version, version); assert.equal(app[platform].url, url);
      if (['trust', 'geometrie-roti'].includes(app.id)) assert.equal(app[platform].passwordProtected, true);
    }
    server = http.createServer((request, response) => {
      const url = new URL(request.url, 'http://local');
      if (url.pathname === '/fixture-empty') { response.writeHead(200, { 'Content-Type': 'text/html' }); response.end('<!doctype html><title>Isolated storage fixture</title>'); return; }
      const file = path.resolve(root, url.pathname.replace(/^\/aplicatii\//, '') || 'index.html');
      if (!file.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
      fs.readFile(file, (error, body) => { response.writeHead(error ? 404 : 200, { 'Content-Type': ({ '.html': 'text/html', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json' })[path.extname(file)] || 'text/plain' }); response.end(error ? 'missing' : body); });
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = 'http://127.0.0.1:' + server.address().port, url = origin + '/aplicatii/';
    browser = await chromium.launch({ headless: true, ...(process.platform === 'win32' ? { executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' } : {}) });
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await context.route('**/*', route => {
      const target = new URL(route.request().url());
      if (target.origin === origin) return route.continue();
      external.push(target.href); return route.abort();
    });
    const page = await context.newPage(); page.on('pageerror', error => errors.push(error.message));
    await page.goto(origin + '/fixture-empty');
    await page.evaluate(async () => {
      localStorage.setItem('agenda-fixture', JSON.stringify({ clients: [{ name: 'Synthetic client' }], marker: 'unchanged' }));
      const db = await new Promise((resolve, reject) => { const request = indexedDB.open('hub-data-guard', 1); request.onupgradeneeded = () => request.result.createObjectStore('state'); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
      await new Promise((resolve, reject) => { const transaction = db.transaction('state', 'readwrite'); transaction.objectStore('state').put({ marker: 'untouched' }, 'current'); transaction.oncomplete = resolve; transaction.onerror = () => reject(transaction.error); }); db.close();
    });
    const storage = () => page.evaluate(async () => {
      const db = await new Promise((resolve, reject) => { const request = indexedDB.open('hub-data-guard', 1); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
      const data = await new Promise((resolve, reject) => { const request = db.transaction('state').objectStore('state').get('current'); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); }); db.close();
      return { local: { ...localStorage }, indexed: data, databases: (await indexedDB.databases()).map(value => value.name).sort(), workers: (await navigator.serviceWorker.getRegistrations()).length };
    });
    const before = await storage(); await page.goto(url);
    const actions = await page.locator('[data-download]').evaluateAll(nodes => nodes.map(node => ({ id: node.dataset.download, url: node.href, version: node.closest('.platform').querySelector('.version').textContent, platform: node.closest('.platform').querySelector('.platform-name').textContent, accessible: node.getAttribute('aria-label'), target: node.target, rel: node.rel, download: node.hasAttribute('download') })));
    assert.equal(actions.length, 6); assert.deepEqual(actions.map(value => value.id), Object.keys(expected));
    for (const action of actions) {
      assert.equal(action.url, expected[action.id][1]); assert.equal(action.version, expected[action.id][0]);
      assert(action.accessible && action.accessible.includes(action.version));
      assert.equal(action.platform, action.id.endsWith('iphone') ? 'iPhone' : 'Android');
      if (action.id.endsWith('iphone') || action.id.startsWith('trust-')) assert.equal(action.download, false);
      if (action.target === '_blank') assert.match(action.rel, /(?:^|\s)noopener(?:\s|$)/);
    }
    assert.equal(await page.locator('[data-app="salon"] .platform').count(), 1);
    assert.equal(await page.locator('[data-app="salon"] .iphone,[data-download="salon-iphone"]').count(), 0);
    assert.equal(await page.locator('[data-app="trust"] a[href$=".apk"],[data-app="trust"] a[href*="releases/download"],[data-app="trust"] a[href*=".enc"]').count(), 0);
    console.log('PASS exactly five current-version actions, Salon Android only, exact Trust password-gate URLs and original Frizerie PWA origin');

    const pageContract = await page.evaluate(() => ({ scripts: document.scripts.length, frames: document.querySelectorAll('iframe,object,embed').length, forms: document.forms.length, csp: document.querySelector('meta[http-equiv="Content-Security-Policy"]')?.content, resources: [...document.querySelectorAll('[src],link[href]')].map(node => node.src || node.href) }));
    assert.equal(pageContract.scripts, 0); assert.equal(pageContract.frames, 0); assert.equal(pageContract.forms, 0);
    assert.match(pageContract.csp, /default-src 'none'/); assert.match(pageContract.csp, /form-action 'none'/);
    assert(pageContract.resources.every(resource => new URL(resource).origin === origin));
    assert.deepEqual(await storage(), before);
    console.log('PASS static page has no scripts, embeds, forms or external resources and leaves synthetic localStorage/IndexedDB/SW state untouched');

    fs.mkdirSync(path.join(root, 'test-results'), { recursive: true });
    for (const width of [320, 390, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      const geometry = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth + 1, actions: [...document.querySelectorAll('[data-download]')].map(node => { const bounds = node.getBoundingClientRect(); return { width: bounds.width, height: bounds.height, inside: bounds.left >= -1 && bounds.right <= innerWidth + 1, overflow: node.scrollWidth > node.clientWidth + 1 }; }) }));
      assert.equal(geometry.overflow, false, width + 'px page overflow');
      for (const action of geometry.actions) { assert(action.inside && action.width > 40 && action.height >= 44); assert.equal(action.overflow, false); }
      await page.goto(url);
      const expectedTabs = await page.locator('a[href]').count(), visited = [];
      for (let index = 0; index < expectedTabs; index++) {
        await page.keyboard.press('Tab');
        const focused = await page.evaluate(() => { const node = document.activeElement, style = getComputedStyle(node); return { tag: node.tagName, href: node.getAttribute('href'), outline: style.outlineStyle, width: parseFloat(style.outlineWidth) }; });
        assert.equal(focused.tag, 'A'); assert.equal(focused.outline, 'solid'); assert(focused.width >= 2); visited.push(focused.href);
      }
      assert.equal(new Set(visited).size, expectedTabs, width + 'px keyboard must reach every link once');
      if (width === 390 || width === 1280) await page.screenshot({ path: path.join(root, 'test-results', 'hub-' + width + '.png'), fullPage: true });
      console.log('PASS ' + width + 'px layout, 44px actions, no horizontal overflow and visible keyboard focus on all links');
    }
    await page.goto(url); await page.keyboard.press('Tab'); await page.keyboard.press('Enter');
    assert.equal(new URL(page.url()).hash, '#aplicatii');
    assert.deepEqual(await storage(), before); assert.deepEqual(errors, []); assert.deepEqual(external, []);
    for (const [file, fingerprint] of fingerprints) assert.equal(hash(file), fingerprint, 'Product source changed during read-only hub QA: ' + file);
    console.log('PASS skip link, no JavaScript errors/external calls, and original product files unchanged');
  } finally {
    if (browser) await browser.close();
    if (server) await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
