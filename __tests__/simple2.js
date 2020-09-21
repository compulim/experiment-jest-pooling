/**
 * @jest-environment ./__tests__/__jest__/perTest/WebDriverEnvironment
 */

const { Capabilities } = require('selenium-webdriver');

test(`should work 2`, async () => {
  await global.acquireWebDriver({ capabilities: Capabilities.chrome() }, async ({ driver }) => {
    await driver.get('https://example.com/');
    await expect(driver.takeScreenshot()).resolves.toMatchImageSnapshot();
  });
});
