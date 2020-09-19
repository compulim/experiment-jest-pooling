/**
 * @jest-environment ./__tests__/__jest__/perTest/WebDriverEnvironment
 */

const { decode } = require('base64-arraybuffer');
const fs = require('fs');
const { promisify } = require('util');

const writeFile = promisify(fs.writeFile);

// docker run -d -p 4444:4444 --shm-size 2g selenium/standalone-chrome:86
describe.each(new Array(10).fill().map((_, index) => index + 1))('Load a page', index => {
  test(`should work (${index})`, async () => {
    await global.acquireWebDriver(async ({ driver }) => {
      if (index === 3) {
        throw new Error('artificial error');
      }

      const base64 = await driver.takeScreenshot();

      await writeFile(`./__tests__/__temp__/simple${index}.png`, new Uint8Array(decode(base64)));
    });
  });
});
