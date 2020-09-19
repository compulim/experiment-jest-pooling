const { Server } = require('ws');
const AbortController = require('abort-controller');

let server;

async function setup({ port }, acquire) {
  server = new Server({ port });

  server.on('connection', async ws => {
    await acquire(
      resource =>
        new Promise((resolve, reject) => {
          ws.on('message', resolve);
          ws.on('close', () => reject('Closed without ACK, possibly test code crashed.'));
          ws.on('error', () => reject('Errored out, possibly network error.'));

          ws.send(JSON.stringify(resource));
        })
    );
  });

  console.log(`Resource pool is up on port ${port}.`);
}

async function teardown() {
  server && server.close();

  console.log(`Shutting down resource pool.`);
}

module.exports = {
  setup,
  teardown
};
