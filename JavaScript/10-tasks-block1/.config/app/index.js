const STATIC_PORT = 8000;
const API_PORT = 8001;

module.exports = {
    /**
     * @type {'ws' | 'http'}
     */
    transport: 'http',
    /**
     * @type {'custom' | 'pino'}
     */
    logger: 'pino',
    transportOptions: {
        http: {
            headers: {
                'Access-Control-Allow-Origin': [
                    `http://localhost:${STATIC_PORT}`
                ].join(', '),
                'Access-Control-Allow-Headers': [
                    'Content-Type'
                ].join(', ')
            },
            /**
             * @type {'native' | 'fastify'}
             */
            framework: 'fastify', 
        }
    },
    api: {
        port: API_PORT,
    },
    static: {
        port: STATIC_PORT,
    },
    hash: {
        bytesLen: 16, 
        keyLen: 64, 
    },
}