const { teardown } = require('./resourcePool');

module.exports = () => Promise.all([teardown(), global.teardownWebDriverPool()]);
