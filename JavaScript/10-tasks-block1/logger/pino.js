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
    this.logger[type](s);
  }

  log(...args) {
    this.logger.info(...args);
  }

  dir(...args) {
    this.logger.info(...args);
  }

  debug(...args) {
    this.logger.debug(...args);
  }

  error(...args) {
    this.logger.error(...args);
  }

  system(...args) {
    throw new Error('System method not implemented');
  }

  access(...args) {
    throw new Error('Access method not implemented');
  }
}

module.exports = new PinoLogger();
