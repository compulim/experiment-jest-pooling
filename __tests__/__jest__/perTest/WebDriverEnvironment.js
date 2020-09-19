const NodeEnvironment = require('jest-environment-node');

const runOnResource = require('./runOnResource');

class WebDriverEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);

    this.config = config;
  }

  async setup() {
    await super.setup();

    console.log('WebDriverEnvironment: setup');

    this.global.acquireWebDriver = runOnResource;
  }

  async teardown() {
    console.log('WebDriverEnvironment: teardown');

    // Hack: Add 100ms wait for Jest to flush the console.log.
    // Repro:
    // 1. console.log('abc');
    // 2. await sleep(1000);
    // 3. console.log('xyz');
    // Expected: "abc", "xyz", then test result
    // Actual: "abc", test test result, then "xyz"
    await new Promise(resolve => setTimeout(resolve, 100));

    await super.teardown();
  }
}

module.exports = WebDriverEnvironment;
