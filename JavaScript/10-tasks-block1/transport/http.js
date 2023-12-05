'use strict';

const URL_PARTS_PARAMS = ['id', 'mask']; // FIXME: Куда правильнее вынести эти параметры ??? 

module.exports = (routing, options) => {
  const { config } = options;
  const { transportOptions, api } = config;
  const { http: httpOptions } = transportOptions;
  const { port } = api;
  const framework = require(`../frameworks/${httpOptions.framework}`);

  framework.createServer(routing, { port, urlPartsParams: URL_PARTS_PARAMS, ...httpOptions });
};
