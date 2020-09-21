/**
 * @jest-environment ./__tests__/__jest__/perTest/WebDriverEnvironment
 */

const { Capabilities } = require('selenium-webdriver');
const { Options: ChromeOptions } = require('selenium-webdriver/chrome');

test(`should work 6`, async () => {
  const capabilities = Capabilities.chrome();
  const chromeOptions = new ChromeOptions().windowSize({ height: 480, width: 640 });

  await global.acquireWebDriver({ capabilities, chromeOptions }, async ({ driver }) => {
    await driver.get('https://example.com/');
    await expect(driver.takeScreenshot()).resolves.toMatchImageSnapshot();
  });
});
