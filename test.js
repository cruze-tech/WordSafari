const fs = require('fs');
const path = require('path');
const http = require('http');
const puppeteer = require('puppeteer-core');

const ROOT = process.cwd();
const PORT = Number(process.env.TEST_PORT || 8787);
const BASE_URL = `http://127.0.0.1:${PORT}`;

function parseArgs() {
  const scenarioArg = process.argv.find((arg) => arg.startsWith('--scenario='));
  return {
    scenario: scenarioArg ? scenarioArg.split('=')[1] : 'smoke'
  };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function contentTypeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.ico': 'image/x-icon'
  };
  return map[ext] || 'application/octet-stream';
}

function startStaticServer() {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    const cleanPath = urlPath === '/' ? '/index.html' : urlPath;
    const fsPath = path.join(ROOT, cleanPath);

    if (!fsPath.startsWith(ROOT)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    fs.readFile(fsPath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not found');
        return;
      }

      res.writeHead(200, {
        'Content-Type': contentTypeFor(fsPath),
        'Cache-Control': 'no-cache'
      });
      res.end(data);
    });
  });

  return new Promise((resolve) => {
    server.listen(PORT, '127.0.0.1', () => resolve(server));
  });
}

function detectChromePath() {
  const envPath = process.env.CHROME_PATH;
  if (envPath && fs.existsSync(envPath)) {
    return envPath;
  }

  const candidates = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  ];

  return candidates.find((candidate) => fs.existsSync(candidate));
}

async function launchBrowser() {
  const executablePath = detectChromePath();
  if (!executablePath) {
    throw new Error('Chrome/Chromium executable not found. Set CHROME_PATH to run tests.');
  }

  return puppeteer.launch({
    executablePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  });
}

async function preparePage(browser, options = {}) {
  const page = await browser.newPage();
  page.on('console', (msg) => {
    const type = msg.type();
    if (type === 'error' || type === 'warning') {
      console.log(`PAGE ${type.toUpperCase()}:`, msg.text());
    }
  });

  if (typeof options.seedStorage === 'function') {
    await page.evaluateOnNewDocument(options.seedStorage);
  }

  return page;
}

async function waitForServiceWorker(page) {
  await page.waitForFunction(async () => {
    if (!('serviceWorker' in navigator)) return false;
    const reg = await navigator.serviceWorker.getRegistration();
    if (!reg) return false;
    await navigator.serviceWorker.ready;
    return Boolean(reg.active);
  }, { timeout: 15000 });
}

async function runSmokeTest(browser) {
  const page = await preparePage(browser);
  await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

  const isStartActive = await page.$eval('#start-screen', (el) => el.classList.contains('active'));
  assert(isStartActive, 'Start screen should be active on initial load.');

  await page.click('#btn-play');
  await page.waitForFunction(() => {
    const start = document.getElementById('start-screen');
    const game = document.getElementById('game-screen');
    return start && game && !start.classList.contains('active') && game.classList.contains('active');
  }, { timeout: 4000 });

  await page.close();
  return 'Smoke test passed';
}

async function runPwaTest(browser) {
  const page = await preparePage(browser);
  await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

  const manifestHref = await page.$eval('link[rel="manifest"]', (el) => el.getAttribute('href'));
  assert(manifestHref === 'manifest.json', 'Manifest link should target manifest.json');

  const swSupported = await page.evaluate(() => 'serviceWorker' in navigator);
  assert(swSupported, 'Service workers should be supported in the test browser.');

  await waitForServiceWorker(page);

  const swState = await page.evaluate(async () => {
    const reg = await navigator.serviceWorker.getRegistration();
    return {
      hasRegistration: Boolean(reg),
      hasActiveWorker: Boolean(reg && reg.active),
      scope: reg ? reg.scope : null
    };
  });

  assert(swState.hasRegistration, 'Service worker should register.');
  assert(swState.hasActiveWorker, 'Service worker should become active.');

  await page.close();
  return `PWA test passed (scope: ${swState.scope})`;
}

async function runOfflineTest(browser) {
  const page = await preparePage(browser);
  await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
  await waitForServiceWorker(page);

  await page.setOfflineMode(true);
  await page.reload({ waitUntil: 'domcontentloaded' });

  const offlineSignal = await page.evaluate(() => {
    const text = document.body.innerText || '';
    const hasAppShell = text.includes('Word Safari') || text.includes('Start Adventure');
    const hasOfflinePage = text.includes('You are offline');
    return { hasAppShell, hasOfflinePage };
  });

  assert(offlineSignal.hasAppShell || offlineSignal.hasOfflinePage, 'Offline reload should render app shell or offline fallback.');

  await page.setOfflineMode(false);
  await page.close();
  return 'Offline test passed';
}

async function runMigrationTest(browser) {
  const page = await preparePage(browser, {
    seedStorage: () => {
      localStorage.setItem('wordSafari_progression', JSON.stringify({
        playerLevel: 4,
        currentXP: 72,
        stats: {
          gamesPlayed: 5,
          highScore: 220,
          animalsDiscovered: 2,
          dayStreak: 3,
          totalXP: 310,
          perfectRounds: 1,
          fastestLevel: 42,
          biomesVisited: 2,
          wordsSpelled: 9,
          dailyQuestsCompleted: 2,
          maxCombo: 4,
          levelsInSession: 1,
          vocabularyLearned: 7,
          factsRead: 3,
          discoveredAnimals: ['lion', 'elephant'],
          lastPlayDate: new Date().toDateString()
        }
      }));
      localStorage.setItem('wordSafari_achievements', JSON.stringify([
        { id: 'safari_starter', unlocked: true }
      ]));
      localStorage.setItem('wordSafari_difficulty', 'hard');
    }
  });

  await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

  const migrationState = await page.evaluate(() => {
    const progression = JSON.parse(localStorage.getItem('wordSafari_progression') || '{}');
    const achievements = JSON.parse(localStorage.getItem('wordSafari_achievements') || '{}');
    const activeDifficulty = document.querySelector('.difficulty-btn.active')?.dataset.difficulty;

    return {
      progressionSchemaVersion: progression.schemaVersion,
      playerLevel: progression.playerLevel,
      discoveredAnimalsLength: progression?.stats?.discoveredAnimals?.length,
      hasLearnedAttributesArray: Array.isArray(progression?.stats?.learnedAttributes),
      currentDifficulty: progression.currentDifficulty,
      activeDifficulty,
      achievementSchemaVersion: achievements.schemaVersion,
      achievementsShapeValid: Array.isArray(achievements.achievements)
    };
  });

  assert(migrationState.progressionSchemaVersion === 2, 'Progression schema should migrate to v2.');
  assert(migrationState.playerLevel === 4, 'Migrated progression should preserve player level.');
  assert(migrationState.discoveredAnimalsLength === 2, 'Migrated progression should preserve discovered animals.');
  assert(migrationState.hasLearnedAttributesArray, 'Migrated progression should include learnedAttributes array.');
  assert(migrationState.currentDifficulty === 'hard', 'Difficulty should persist in migrated progression.');
  assert(migrationState.activeDifficulty === 'hard', 'UI difficulty selection should reflect persisted value.');
  assert(migrationState.achievementSchemaVersion === 2, 'Achievement schema should migrate to v2.');
  assert(migrationState.achievementsShapeValid, 'Achievement storage should use object schema with achievements array.');

  await page.close();
  return 'Migration test passed';
}

async function runScenario(browser, scenario) {
  const scenarios = {
    smoke: runSmokeTest,
    pwa: runPwaTest,
    offline: runOfflineTest,
    migration: runMigrationTest
  };

  if (scenario === 'readiness') {
    const ordered = ['smoke', 'pwa', 'offline', 'migration'];
    const results = [];

    for (const name of ordered) {
      const result = await scenarios[name](browser);
      results.push({ name, result });
    }

    return results;
  }

  const handler = scenarios[scenario];
  if (!handler) {
    throw new Error(`Unknown scenario "${scenario}".`);
  }

  return handler(browser);
}

(async () => {
  const { scenario } = parseArgs();
  const server = await startStaticServer();

  let browser;
  try {
    browser = await launchBrowser();
    const results = await runScenario(browser, scenario);

    if (Array.isArray(results)) {
      console.log('Readiness scenarios complete:');
      results.forEach(({ name, result }) => console.log(`- ${name}: ${result}`));
    } else {
      console.log(results);
    }

    process.exitCode = 0;
  } catch (error) {
    console.error('Test run failed:', error.message);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    server.close();
  }
})();
