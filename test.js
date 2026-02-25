const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new'
  });
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  await page.goto('http://localhost:8000', { waitUntil: 'networkidle0' });
  console.log('Page loaded');

  try {
    const isStartActiveBefore = await page.$eval('#start-screen', el => el.classList.contains('active'));
    console.log('Start screen active before:', isStartActiveBefore);

    await page.click('#btn-play');
    console.log('Clicked #btn-play successfully');

    // Wait a bit for transition
    await new Promise(r => setTimeout(r, 500));

    const isStartActiveAfter = await page.$eval('#start-screen', el => el.classList.contains('active'));
    const isGameActiveAfter = await page.$eval('#game-screen', el => el.classList.contains('active'));
    console.log('Start screen active after:', isStartActiveAfter);
    console.log('Game screen active after:', isGameActiveAfter);

  } catch (e) {
    console.log('Click error:', e.message);
  }

  await browser.close();
})();
