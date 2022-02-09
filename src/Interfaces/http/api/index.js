const users = require('./users');
const authentication = require('./authentications');

const plugins = (container) => [
    {
        plugin: users,
        options: {
            container,
        },
    },
    {
        plugin: authentication,
        options: {
            container,
        },
    },
];

module.exports = plugins;
