'use strict';

const fsp = require('node:fs').promises;
const path = require('node:path');
const staticServer = require('./static.js');
const db = require('./db.js');
const hash = require('./hash.js');
const config = require('./.config/app/index.js');

/**
 * Configurable
 */
const logger = require(`./logger/${config.logger}`);
const server = require(`./transport/${config.transport}`);

const apiPath = path.join(process.cwd(), './api');
const routing = {};

(async () => {
  const files = await fsp.readdir(apiPath);
  for (const fileName of files) {
    if (!fileName.endsWith('.js')) continue;
    const filePath = path.join(apiPath, fileName);
    const serviceName = path.basename(fileName, '.js');

    routing[serviceName] = require(filePath)({
      console: Object.freeze(logger),
      db: Object.freeze(db),
      common: { hash },
    });
  }

  staticServer('./static', config.static.port);
  server(routing, config.api.port);
})();
