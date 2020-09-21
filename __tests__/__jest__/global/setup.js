const { Builder, Capabilities } = require('selenium-webdriver');
const { Options: ChromeOptions } = require('selenium-webdriver/chrome');
const { stringify } = require('qs');

const { setup } = require('./resourcePool');

const WEB_DRIVER_URL = 'http://localhost:4444/wd/hub';

async function provision(capabilities, chromeOptions) {
  return await new Builder()
    .withCapabilities(new Capabilities(capabilities))
    .setChromeOptions(new ChromeOptions(chromeOptions))
    .usingServer(WEB_DRIVER_URL)
    .build();
}

function removeInline(array, element) {
  const index = array.indexOf(element);

  ~index && array.splice(index, 1);
}

async function housekeep(pool, capacity) {
  while (pool.length > capacity) {
    const entry = pool.find(({ busy }) => !busy);

    if (!entry) {
      break;
    }

    entry.busy = true;

    await entry.decommission();
  }
}

module.exports = async ({ maxWorkers }) => {
  const pool = [];

  global.teardownWebDriverPool = () => Promise.all(pool.map(({ decommission }) => decommission()));

  await setup(async (init, fn) => {
    const key = stringify(init);
    const { capabilities, chromeOptions } = init;
    let entry = pool.find(({ busy, key: target }) => !busy && target === key);

    if (entry) {
      entry.busy = true;
    } else {
      // This is not a very strict allocation. If none of the resources are available, we will provision one right away.
      // This means we might overallocate in case of race conditions.
      const driver = await provision(capabilities, chromeOptions);
      const sessionId = (await driver.getSession()).getId();

      entry = {
        busy: true,
        decommission: async () => {
          entry.busy = true;
          removeInline(pool, entry);

          try {
            await driver.quit();
          } catch (err) {}
        },
        key,
        sessionId
      };

      pool.push(entry);
    }

    try {
      await fn(JSON.stringify({ sessionId: entry.sessionId, url: WEB_DRIVER_URL }));
    } catch (err) {
      // We always decommission the instance if it was not released properly, for example, test failed.
      await entry.decommission();
    } finally {
      entry.busy = false;

      // Doing housekeep as we might provision more than we need momentarily, due to race condition.
      await housekeep(pool, maxWorkers);
    }
  });
};
