/**
 * @jest-environment ./__tests__/__jest__/perTest/WebDriverEnvironment
 */

test(`should work 3`, async () => {
  expect(
    () => global.acquireWebDriver(async ({ driver }) => {
      throw new Error('artificial error');
    })
  ).rejects.toThrow('artificial error');
});
