const Hapi = require('@hapi/hapi');
const plugins = require('../../Interfaces/http/api');
const extensions = require('../../Interfaces/http/extensions');

const createServer = async (container) => {
    const server = Hapi.server({
        host: process.env.HOST,
        port: process.env.PORT,
    });

    await server.register(plugins(container));

    server.ext('onPreResponse', extensions.onPreResponse);

    return server;
};

module.exports = createServer;
