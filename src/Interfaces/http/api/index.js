const users = require('./users');
const authentications = require('./authentications');
const threads = require('./threads');

const plugins = (container) => [
    {
        plugin: users,
        options: {
            container,
        },
    },
    {
        plugin: authentications,
        options: {
            container,
        },
    },
    {
        plugin: threads,
        options: {
            container,
        },
    },
];

module.exports = plugins;
