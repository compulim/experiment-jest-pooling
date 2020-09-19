/**
 * @jest-environment ./__tests__/__jest__/perTest/WebDriverEnvironment
 */

const { decode } = require('base64-arraybuffer');
const { promisify } = require('util');
const fs = require('fs');

const writeFile = promisify(fs.writeFile);

test(`should work 8`, async () => {
  await global.acquireWebDriver(async ({ driver }) => {
    await driver.get('https://example.com/');
    await writeFile(`./__tests__/__temp__/simple8.png`, new Uint8Array(decode(await driver.takeScreenshot())));
  });
});
