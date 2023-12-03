'use strict';

const pino = require('pino');

class PinoLogger {
  constructor() {
    /**
     * @type {import('pino').BaseLogger}
     */
    this.logger = pino();
  }

  close() {
    throw new Error('Close method not implemented');
  }

  write(type = 'info', s) {
    logger[type](s);
  }

  log(...args) {
    logger.info(...args);
  }

  dir(...args) {
    logger.info(...args);
  }

  debug(...args) {
    logger.debug(...args);
  }

  error(...args) {
    logger.error(...args);
  }

  system(...args) {
    throw new Error('System method not implemented');
  }

  access(...args) {
    throw new Error('Access method not implemented');
  }
}

module.exports = new PinoLogger();
