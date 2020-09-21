/**
 * @jest-environment ./__tests__/__jest__/perTest/WebDriverEnvironment
 */

const { Capabilities } = require('selenium-webdriver');

test(`should work 3`, async () => {
  expect(() =>
    global.acquireWebDriver({ capabilities: Capabilities.chrome() }, async ({ driver }) => {
      throw new Error('artificial error');
    })
  ).rejects.toThrow('artificial error');
});
