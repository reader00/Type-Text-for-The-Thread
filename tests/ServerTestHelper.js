/* istanbul ignore file */

const Jwt = require('@hapi/jwt');

const UsersTableTestHelper = require('./UsersTableTestHelper');

const ServerTestHelper = {
    async getAccessToken() {
        const adduserPayload = {
            id: 'user-123',
            username: 'dicoding',
            password: 'asd',
            fullname: 'Dicoding Indonesia',
        };

        await UsersTableTestHelper.addUser(adduserPayload);
        return Jwt.token.generate(adduserPayload, process.env.ACCESS_TOKEN_KEY);
    },
};

module.exports = ServerTestHelper;
