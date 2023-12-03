const http = require('node:http');

const receiveArgs = async (req) => {
    const buffers = [];
    for await (const chunk of req) buffers.push(chunk);
    const data = Buffer.concat(buffers).toString();
    return JSON.parse(data);
};

const createServer = (routing, options) => {
    http.createServer(async (req, res) => {
      // Set headers
      Object.keys(options.headers).forEach((header) => {
        res.setHeader(header, options.headers[header]);
      });
  
      const { url, socket } = req;
      const [name, method, id] = url.substring(1).split('/');
      const entity = routing[name];
  
      if (!entity) return void res.end('Not found');
      const handler = entity[method];
      if (!handler) return void res.end('Not found');
      const src = handler.toString();
      const signature = src.substring(0, src.indexOf(')'));
      const args = [];
      const urlParams = options.urlPartsParams.map(p => `(${p}`);
      if (urlParams.some(p => signature.includes(p))) args.push(id);
      if (signature.includes('{')) args.push(await receiveArgs(req));
      console.log(`${socket.remoteAddress} ${method} ${url}, args: ${JSON.stringify(args, null, 2)}`);
      const result = await handler(...args);
      res.end(JSON.stringify(result.rows));
    }).listen(options.port);
  
    console.log(`API on port ${options.port}`);
};

module.exports = {
    createServer,
};