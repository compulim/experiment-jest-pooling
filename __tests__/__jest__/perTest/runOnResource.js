const { Session, WebDriver } = require('selenium-webdriver');
const { Executor, HttpClient } = require('selenium-webdriver/http');
const WebSocket = require('ws');

// const { RESOURCE_POOL_PORT } = require('../constants');

const { JEST_RESOURCE_POOL_PORT } = process.env;

module.exports = async function runOnResource(fn) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(`ws://localhost:${JEST_RESOURCE_POOL_PORT}`);

    ws.addEventListener('error', ({ code, error }) => {
      reject(error || new Error(`Error while connecting to resource pool, code = ${code}`));
    });

    ws.addEventListener('message', async ({ data }) => {
      const { capabilities, id } = JSON.parse(data);

      const driver = new WebDriver(
        new Session(id, capabilities),
        new Executor(new HttpClient('http://localhost:4444/wd/hub'))
      );

      try {
        resolve(await fn({ driver }));
        ws.send('done');
      } catch (err) {
        reject(err);
      } finally {
        ws.close();
      }
    });
  });
};
