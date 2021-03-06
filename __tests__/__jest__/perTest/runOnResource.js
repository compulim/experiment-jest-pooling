const { stringify } = require('qs');
const WebSocket = require('ws');

const { JEST_RESOURCE_POOL_PORT } = process.env;

module.exports = async function runOnResource(init, fn) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(`ws://localhost:${JEST_RESOURCE_POOL_PORT}?${stringify(init)}`);

    ws.addEventListener('error', ({ code, error }) =>
      reject(error || new Error(`Error while connecting to resource pool, code = ${code}`))
    );

    ws.addEventListener('message', async ({ data }) => {
      try {
        resolve(await fn(data));
        ws.send('done');
      } catch (err) {
        reject(err);
      } finally {
        ws.close();
      }
    });
  });
};
