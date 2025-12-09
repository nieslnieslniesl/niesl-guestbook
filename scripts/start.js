/* eslint-disable @typescript-eslint/no-var-requires */
const next = require('next');
const http = require('http');

const dev = false;
const app = next({ dev, dir: '.' });
const handle = app.getRequestHandler();

function listenOn(port) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => handle(req, res));
    server.on('error', (err) => reject(err));
    server.listen(port, () => {
      console.log(`🚀 Niesl Hyves server listening on port ${port}`);
      resolve(server);
    });
  });
}

async function start() {
  const primary = Number(process.env.PORT || 80);
  const fallback = 3000;

  await app.prepare();
  try {
    await listenOn(primary);
  } catch (err) {
    if (err.code === 'EADDRINUSE' && primary !== fallback) {
      console.warn(
        `⚠️ Port ${primary} is in use. Falling back to ${fallback}.`
      );
      await listenOn(fallback);
    } else {
      console.error('Failed to start server', err);
      process.exit(1);
    }
  }
}

start();

