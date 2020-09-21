/**
 * @jest-environment ./__tests__/__jest__/perTest/WebDriverEnvironment
 */

const { Capabilities } = require('selenium-webdriver');
const { decode } = require('base64-arraybuffer');
const { promisify } = require('util');
const { resolve } = require('path');
const { tmpdir } = require('os');
const fs = require('fs');

const writeFile = promisify(fs.writeFile);

test(`should work 2`, async () => {
  await global.acquireWebDriver({ capabilities: Capabilities.chrome() }, async ({ driver }) => {
    await driver.get('https://example.com/');
    await writeFile(resolve(tmpdir(), 'simple2.png'), new Uint8Array(decode(await driver.takeScreenshot())));
  });
});
