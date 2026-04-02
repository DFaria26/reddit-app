/**
 * End-to-end tests for RedditLite using Selenium WebDriver.
 *
 * Prerequisites:
 *   - Chrome browser installed
 *   - ChromeDriver on PATH (or managed by selenium-webdriver)
 *   - App running locally: npm start (default http://localhost:3000)
 *
 * Run:
 *   node e2e/app.e2e.test.js
 */

const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const APP_URL = process.env.APP_URL || 'http://localhost:3000';
const TIMEOUT = 15000;

let driver;
let passed = 0;
let failed = 0;
const results = [];

async function setup() {
  const options = new chrome.Options();
  options.addArguments('--headless');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--window-size=1280,900');

  driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
}

async function teardown() {
  if (driver) await driver.quit();
}

async function test(name, fn) {
  try {
    await fn();
    passed++;
    results.push(`  PASS: ${name}`);
  } catch (err) {
    failed++;
    results.push(`  FAIL: ${name}\n        ${err.message}`);
  }
}

async function runTests() {
  await setup();

  try {
    // Test 1: Page loads with correct title
    await test('Page loads with correct title', async () => {
      await driver.get(APP_URL);
      await driver.wait(until.titleIs('RedditLite'), TIMEOUT);
      const title = await driver.getTitle();
      if (title !== 'RedditLite') throw new Error(`Expected "RedditLite", got "${title}"`);
    });

    // Test 2: Header renders with logo text
    await test('Header renders with logo text', async () => {
      const header = await driver.wait(
        until.elementLocated(By.css('.header__title')),
        TIMEOUT
      );
      const text = await header.getText();
      if (!text.includes('Reddit')) throw new Error(`Header text missing "Reddit": "${text}"`);
    });

    // Test 3: Search bar is present and functional
    await test('Search bar is present and accepts input', async () => {
      const input = await driver.findElement(By.css('.search-bar__input'));
      await input.clear();
      await input.sendKeys('javascript');
      const value = await input.getAttribute('value');
      if (value !== 'javascript') throw new Error(`Expected "javascript", got "${value}"`);
    });

    // Test 4: Clear button appears when search has text
    await test('Clear button appears when search has text', async () => {
      const clearBtn = await driver.wait(
        until.elementLocated(By.css('.search-bar__clear')),
        TIMEOUT
      );
      if (!clearBtn) throw new Error('Clear button not found');
    });

    // Test 5: Clear button clears the search input
    await test('Clear button clears the search input', async () => {
      const clearBtn = await driver.findElement(By.css('.search-bar__clear'));
      await clearBtn.click();
      const input = await driver.findElement(By.css('.search-bar__input'));
      const value = await input.getAttribute('value');
      if (value !== '') throw new Error(`Expected empty, got "${value}"`);
    });

    // Test 6: Subreddits sidebar toggle is present
    await test('Subreddits sidebar toggle is present', async () => {
      const toggle = await driver.findElement(By.css('.app__sidebar-toggle'));
      const text = await toggle.getText();
      if (!text.includes('Subreddits')) throw new Error(`Toggle text: "${text}"`);
    });

    // Test 7: Main content area exists
    await test('Main content area exists', async () => {
      const main = await driver.findElement(By.css('.app__main'));
      if (!main) throw new Error('Main content area not found');
    });

    // Test 8: Posts or error/loading state is displayed
    await test('Posts, loading, or error state is displayed', async () => {
      await driver.wait(async () => {
        const posts = await driver.findElements(By.css('.post-card'));
        const loading = await driver.findElements(By.css('.post-list__skeleton'));
        const error = await driver.findElements(By.css('.post-list__error'));
        const empty = await driver.findElements(By.css('.post-list__empty'));
        return posts.length > 0 || loading.length > 0 || error.length > 0 || empty.length > 0;
      }, TIMEOUT);
    });

    // Test 9: Error state has a retry button (if in error state)
    await test('Error state has retry button if showing error', async () => {
      const errors = await driver.findElements(By.css('.post-list__error'));
      if (errors.length > 0) {
        const retryBtn = await driver.findElement(By.css('.post-list__retry-btn'));
        const text = await retryBtn.getText();
        if (!text.includes('Try Again')) throw new Error(`Retry button text: "${text}"`);
      }
      // If no error state, test passes (posts loaded successfully)
    });

    // Test 10: Search form submits
    await test('Search form submits on button click', async () => {
      const input = await driver.findElement(By.css('.search-bar__input'));
      await input.clear();
      await input.sendKeys('react');
      const searchBtn = await driver.findElement(By.css('.search-bar__button'));
      await searchBtn.click();
      // Wait for either results, loading, or error
      await driver.wait(async () => {
        const posts = await driver.findElements(By.css('.post-card'));
        const loading = await driver.findElements(By.css('.post-list__skeleton'));
        const error = await driver.findElements(By.css('.post-list__error'));
        return posts.length > 0 || loading.length > 0 || error.length > 0;
      }, TIMEOUT);
    });

    // Test 11: Responsive - resize to mobile
    await test('App responds to mobile viewport', async () => {
      await driver.manage().window().setRect({ width: 375, height: 812 });
      // In mobile, the sidebar toggle should be visible
      const toggle = await driver.findElement(By.css('.app__sidebar-toggle'));
      const displayed = await toggle.isDisplayed();
      if (!displayed) throw new Error('Sidebar toggle should be visible on mobile');
      // Restore desktop size
      await driver.manage().window().setRect({ width: 1280, height: 900 });
    });

    // Test 12: Post card click opens detail modal (if posts loaded)
    await test('Post card click opens detail modal (if posts available)', async () => {
      await driver.get(APP_URL);
      await driver.sleep(3000); // Wait for data
      const posts = await driver.findElements(By.css('.post-card'));
      if (posts.length > 0) {
        await posts[0].click();
        const modal = await driver.wait(
          until.elementLocated(By.css('.post-detail__overlay')),
          TIMEOUT
        );
        if (!modal) throw new Error('Modal did not open');

        // Close modal
        const closeBtn = await driver.findElement(By.css('.post-detail__close'));
        await closeBtn.click();
        await driver.wait(until.stalenessOf(modal), TIMEOUT);
      }
      // If no posts (API unreachable), test passes
    });

  } finally {
    await teardown();
  }

  // Print results
  console.log('\n  End-to-End Test Results');
  console.log('  ======================');
  results.forEach(r => console.log(r));
  console.log(`\n  Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
