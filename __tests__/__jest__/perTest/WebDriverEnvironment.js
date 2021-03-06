const { Executor, HttpClient } = require('selenium-webdriver/http');
const { Session, WebDriver } = require('selenium-webdriver');
const NodeEnvironment = require('jest-environment-node');

const runOnResource = require('./runOnResource');

function serialize(capabilities) {
  return capabilities
    ? Array.from(capabilities.keys()).reduce(
        (result, key) => ({
          ...result,
          [key]: capabilities.get(key)
        }),
        {}
      )
    : {};
}

class WebDriverEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);

    this.config = config;
  }

  async setup() {
    await super.setup();

    this.global.acquireWebDriver = ({ capabilities, chromeOptions }, fn) => {
      return runOnResource(
        {
          capabilities: serialize(capabilities),
          chromeOptions: serialize(chromeOptions)
        },
        async data => {
          const { sessionId, url } = JSON.parse(data);

          const driver = new WebDriver(new Session(sessionId), new Executor(new HttpClient(url)));

          return fn({ driver });
        }
      );
    };
  }

  async teardown() {
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
