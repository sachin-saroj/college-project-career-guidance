import { chromium } from 'playwright';

async function testLaunch() {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('http://localhost:5173');
    console.log('Title:', await page.title());
    await browser.close();
    console.log('Playwright launch successful!');
  } catch (err) {
    console.error('Playwright launch failed:', err.message);
  }
}

testLaunch();
