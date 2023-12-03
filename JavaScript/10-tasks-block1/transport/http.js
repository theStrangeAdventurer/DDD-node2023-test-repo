'use strict';
const { transportOptions } = require('../.config/app');
const { http: httpOptions } = transportOptions;
const framework = require(`../frameworks/${httpOptions.framework}`);

const URL_PARTS_PARAMS = ['id', 'mask']; // FIXME: Куда правильнее вынести эти параметры ??? 

module.exports = (routing, port) => {
  framework.createServer(routing, { port, urlPartsParams: URL_PARTS_PARAMS, ...httpOptions });
};
