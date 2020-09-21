const { Builder, Capabilities } = require('selenium-webdriver');
const { Options: ChromeOptions } = require('selenium-webdriver/chrome');
const qs = require('qs');

const { setup } = require('./resourcePool');

const AUTO_DECOMMISSION_AFTER_MISSES = 4;

async function provision(capabilities, chromeOptions) {
  return await new Builder()
    .withCapabilities(new Capabilities(capabilities))
    .setChromeOptions(new ChromeOptions(chromeOptions))
    .usingServer('http://localhost:4444/wd/hub')
    .build();
}

function removeInline(array, element) {
  const index = array.indexOf(element);

  ~index && array.splice(index, 1);
}

const POOL_CAPACITY = 1;

async function housekeep(pool) {
  while (pool.length > POOL_CAPACITY) {
    const entry = pool.find(({ busy }) => !busy);

    if (!entry) {
      break;
    }

    entry.busy = true;

    await entry.decommission();
  }
}

module.exports = async () => {
  const pool = [];

  global.teardownWebDriverPool = () => Promise.all(pool.map(({ decommission }) => decommission()));

  await setup(async (init, fn) => {
    const key = qs.stringify(init);
    const { capabilities, chromeOptions } = init;
    let entry = pool.find(({ busy, key: target }) => !busy && target === key);

    if (entry) {
      entry.busy = true;
    } else {
      const driver = await provision(capabilities, chromeOptions);
      const sessionId = (await driver.getSession()).getId();

      entry = {
        busy: true,
        capabilities,
        chromeOptions,
        decommission: async () => {
          entry.busy = true;
          removeInline(pool, entry);

          await driver.quit();
        },
        driver,
        key,
        sessionId
      };

      pool.push(entry);

      await housekeep(pool);
    }

    try {
      await fn({
        capabilities: entry.capabilities,
        id: entry.sessionId
      });
    } catch (err) {
      await entry.decommission();
    } finally {
      entry.busy = false;

      await housekeep(pool);
    }
  });
};
