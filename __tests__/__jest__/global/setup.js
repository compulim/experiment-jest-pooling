const { Builder } = require('selenium-webdriver');
const Symbols = require('selenium-webdriver/lib/symbols');
const { RESOURCE_POOL_PORT } = require('../constants');

const { setup } = require('./resourcePool');

async function provision() {
  const driver = await new Builder().forBrowser('chrome').usingServer('http://localhost:4444/wd/hub').build();

  await driver.get('https://example.com/');

  return driver;
}

module.exports = async () => {
  const pool = (global.webDriverPool = []);

  await setup(
    {
      port: RESOURCE_POOL_PORT
    },
    async fn => {
      let driver;

      driver = pool.pop();

      if (!driver) {
        driver = await provision();

        const id = (await driver.getSession()).getId();

        console.log(`${id}: Provisioned`);
      }

      const id = (await driver.getSession()).getId();

      console.log(`${id}: Acquired`);

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

      if (success) {
        pool.push(driver);

        console.log(`${id}: Recycled`);
      } else {
        console.log(`${id}: Decommissioned`);
      }
    }
  );
};
