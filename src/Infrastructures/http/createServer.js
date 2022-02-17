const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

const plugins = require('../../Interfaces/http/api');
const extensions = require('../../Interfaces/http/extensions');
const { jwtStrategy } = require('../../Interfaces/http/strategy');

const createServer = async (container) => {
    const server = Hapi.server({
        host: process.env.HOST,
        port: process.env.PORT,
    });

    // Register JWT plugin
    await server.register([
        {
            plugin: Jwt,
        },
    ]);

    // JWT strategy
    server.auth.strategy('forumapi_jwt', 'jwt', jwtStrategy);

    await server.register(plugins(container));

    // hi route
    server.route({
        method: 'GET',
        path: '/',
        handler: () => 'Selamat datang di aplikasi forum API.',
    });

    // Set onPreResponse for error handler
    server.ext('onPreResponse', extensions.onPreResponse);

    return server;
};

module.exports = createServer;
