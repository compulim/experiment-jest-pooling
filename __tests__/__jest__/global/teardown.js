const { teardown } = require('./resourcePool');

module.exports = async () => {
  await teardown();

  await Promise.all(global.webDriverPool.map(driver => driver.quit()));
};
