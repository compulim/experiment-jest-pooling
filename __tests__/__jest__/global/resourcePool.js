const { parse: parseQuery } = require('qs');
const { parse: parseURL } = require('url');
const { Server } = require('ws');
const getPort = require('get-port');

let server;

async function setup(acquire) {
  const port = await getPort();

  process.env.JEST_RESOURCE_POOL_PORT = port;

  server = new Server({ port });

  server.on('connection', (ws, { url }) =>
    acquire(
      parseQuery(parseURL(url).query),
      resource =>
        new Promise((resolve, reject) => {
          ws.on('message', resolve);
          ws.on('close', () => reject('Closed without ACK, possibly test code crashed.'));
          ws.on('error', () => reject('Errored out, possibly network error.'));

          ws.send(resource);
        })
    )
  );
}

async function teardown() {
  server && server.close();
}

module.exports = {
  setup,
  teardown
};
