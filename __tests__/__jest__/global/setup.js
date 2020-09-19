const { Builder } = require('selenium-webdriver');
const Symbols = require('selenium-webdriver/lib/symbols');

const { setup } = require('./resourcePool');

async function provision() {
  return await new Builder().forBrowser('chrome').usingServer('http://localhost:4444/wd/hub').build();
}

module.exports = async () => {
  const pool = [];

  global.teardownWebDriverPool = () => Promise.all(pool.map(driver => driver.quit()));

  await setup(async fn => {
    const driver = pool.pop() || await provision();
    let success;

    try {
      const capabilities = (await driver.getCapabilities())[Symbols.serialize]();

      await fn({
        capabilities,
        driver,
        id: (await driver.getSession()).getId()
      });

      success = true;
    } catch (err) {}

    success && pool.push(driver);
  });
};
