/**
 * @jest-environment ./__tests__/__jest__/perTest/WebDriverEnvironment
 */

const { Capabilities } = require('selenium-webdriver');
const { decode } = require('base64-arraybuffer');
const { Options: ChromeOptions } = require('selenium-webdriver/chrome');
const { promisify } = require('util');
const { resolve } = require('path');
const { tmpdir } = require('os');
const fs = require('fs');

const writeFile = promisify(fs.writeFile);

test(`should work 6`, async () => {
  const capabilities = Capabilities.chrome();
  const chromeOptions = new ChromeOptions().windowSize({ height: 480, width: 640 });

  await global.acquireWebDriver({ capabilities, chromeOptions }, async ({ driver }) => {
    await driver.get('https://example.com/');
    await writeFile(resolve(tmpdir(), 'simple6.png'), new Uint8Array(decode(await driver.takeScreenshot())));
  });
});
