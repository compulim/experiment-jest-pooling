/**
 * @jest-environment ./__tests__/__jest__/perTest/WebDriverEnvironment
 */

const { decode } = require('base64-arraybuffer');
const { promisify } = require('util');
const fs = require('fs');

const writeFile = promisify(fs.writeFile);

test(`should work 3`, async () => {
  await global.acquireWebDriver(async ({ driver }) => {
    throw new Error('artificial error');
  });
});
