const { Agent } = require('http');
const { Executor, HttpClient } = require('selenium-webdriver/http');
const { Session, WebDriver } = require('selenium-webdriver');
const WebSocket = require('ws');

// const { RESOURCE_POOL_PORT } = require('../constants');

const { JEST_RESOURCE_POOL_PORT } = process.env;

module.exports = async function runOnResource(fn) {
  return new Promise((resolve, reject) => {
    const agent = new Agent({ keepAlive: true });
    const ws = new WebSocket(`ws://localhost:${JEST_RESOURCE_POOL_PORT}`);

    ws.addEventListener('error', ({ code, error }) => {
      reject(error || new Error(`Error while connecting to resource pool, code = ${code}`));
    });

    ws.addEventListener('message', async ({ data }) => {
      const { capabilities, id } = JSON.parse(data);

      const driver = new WebDriver(
        new Session(id, capabilities),
        new Executor(new HttpClient('http://localhost:4444/wd/hub', agent))
      );

      try {
        resolve(await fn({ driver }));
        ws.send('done');
      } catch (err) {
        reject(err);
      } finally {
        ws.close();
        agent.destroy();
      }
    });
  });
};
