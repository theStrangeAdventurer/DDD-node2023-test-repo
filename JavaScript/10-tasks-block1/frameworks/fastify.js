const Fastify = require('fastify'); 

const createServer = (routing, options) => {
    const { headers, port, urlPartsParams } = options;
    const fastify = Fastify();

    fastify.post('/*', async (req, res) => {
        const { url, body } = req;
        const [name, method, id] = req.url.substring(1).split('/');
        const entity = routing[name];
        const handler = entity?.[method];

        res.headers(headers);
  
        if (!entity || !handler) {
            res.status(404);
            return res.send('Not found');
        }

        const src = handler.toString();
        const signature = src.substring(0, src.indexOf(')'));
        const args = [];
        const urlParams = urlPartsParams.map(p => `(${p}`);
        if (urlParams.some(p => signature.includes(p))) args.push(id);
        
        if (signature.includes('{')) {
            try {
                args.push(JSON.parse(body));
            } catch (err) {
                res.status(400);
                return res.send({ message: "Bad request" });
            }
        }
        
        console.log(`${req.ip} ${method} ${url}, args: ${JSON.stringify(args, null, 2)}`);
        const result = await handler(...args);
        res.send(result.rows);
    });

    fastify.listen({ port }, (err) => {
        console.log(`Fastify API on port ${options.port}`);
    });
};

module.exports = {
    createServer
}