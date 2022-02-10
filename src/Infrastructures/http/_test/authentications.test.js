const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const AuthenticationTokenManager = require('../../../Applications/security/AuthenticationTokenManager');
const AuthenticationTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');

describe('/authentications endpoint', () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await AuthenticationTableTestHelper.cleanTable();
    });

    describe('when POST /authentications', () => {
        it('should response 400 if username not found', async () => {
            // Arrange
            const requestPayload = {
                username: 'dicoding',
                password: 'asd',
            };

            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: requestPayload,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('username tidak ditemukan');
        });

        it('should response 401 if password wrong', async () => {
            // Arrange
            const requestPayload = {
                username: 'dicoding',
                password: 'wrong_password',
            };

            const addUserPayload = {
                username: 'dicoding',
                password: 'valid_password',
                fullname: 'Dicoding Indonesia',
            };

            const server = await createServer(container);

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: addUserPayload,
            });

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: requestPayload,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(responseJson.message).toEqual('kredensial yang anda masukkan salah');
            expect(response.statusCode).toEqual(401);
            expect(responseJson.status).toEqual('fail');
        });

        it('should response 400 if login payload not contain needed property', async () => {
            // Arrange
            const requestPayload = {
                password: 'asd',
            };

            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: requestPayload,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('harus mengirimkan username dan password');
        });

        it('should response 400 if login payload not meet data type', async () => {
            // Arrange
            const requestPayload = {
                username: 123,
                password: [],
            };

            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: requestPayload,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('username dan password harus bertipe data string');
        });

        it('should return 201 and authentication token', async () => {
            // Arrange
            const requestPayload = {
                username: 'dicoding',
                password: 'asd',
            };

            const addUserPayload = {
                username: 'dicoding',
                password: 'asd',
                fullname: 'Dicoding Indonesia',
            };

            const server = await createServer(container);

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: addUserPayload,
            });

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: requestPayload,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(responseJson.message).toEqual('berhasil login');
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.accessToken).toBeDefined();
            expect(responseJson.data.refreshToken).toBeDefined();
        });
    });

    describe('when PUT /authentications', () => {
        it('should response 400 if payload not contain refresh token', async () => {
            // Arrange
            const requestPayload = {};

            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'PUT',
                url: '/authentications',
                payload: requestPayload,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('harus mengirimkan refresh token');
        });

        it('should response 400 if refresh token not string', async () => {
            // Arrange
            const requestPayload = {
                refreshToken: 123,
            };

            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'PUT',
                url: '/authentications',
                payload: requestPayload,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('refresh token harus bertipe data string');
        });

        it('should response 400 if refresh token not valid', async () => {
            // Arrange
            const requestPayload = {
                refreshToken: 'asd',
            };

            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'PUT',
                url: '/authentications',
                payload: requestPayload,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('refresh token tidak valid');
        });

        it('should response 400 if refresh token not registered in database', async () => {
            // Arrange
            const server = await createServer(container);
            const refreshToken = await container
                .getInstance(AuthenticationTokenManager.name)
                .createRefreshToken({
                    id: 'user-123',
                    username: 'dicoding',
                });

            // Action
            const response = await server.inject({
                method: 'PUT',
                url: '/authentications',
                payload: { refreshToken },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('refresh token tidak ditemukan di database');
        });

        it('should return 200 and new acecss token', async () => {
            // Arrange
            const server = await createServer(container);

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'dicoding',
                    password: 'asd',
                    fullname: 'Dicoding Indonesia',
                },
            });

            const loginReponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username: 'dicoding',
                    password: 'asd',
                },
            });

            const { refreshToken } = JSON.parse(loginReponse.payload).data;

            // Action
            const response = await server.inject({
                method: 'PUT',
                url: '/authentications',
                payload: { refreshToken },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.message).toEqual('berhasil memperbarui access token');
            expect(responseJson.data.accessToken).toBeDefined();
        });
    });

    describe('when DELETE /authentications', () => {
        it('should response 400 if payload not contain refresh token', async () => {
            // Arrange
            const requestPayload = {};

            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: '/authentications',
                payload: requestPayload,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('harus mengirimkan refresh token');
        });

        it('should response 400 if refresh token not string', async () => {
            // Arrange
            const requestPayload = {
                refreshToken: 123,
            };

            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: '/authentications',
                payload: requestPayload,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('refresh token harus bertipe data string');
        });

        it('should response 400 if refresh token not registered in database', async () => {
            // Arrange
            const server = await createServer(container);
            const refreshToken = await container
                .getInstance(AuthenticationTokenManager.name)
                .createRefreshToken({
                    id: 'user-123',
                    username: 'dicoding',
                });

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: '/authentications',
                payload: { refreshToken },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('refresh token tidak ditemukan di database');
        });

        it('should return 200 and success message', async () => {
            // Arrange
            const server = await createServer(container);

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'dicoding',
                    password: 'asd',
                    fullname: 'Dicoding Indonesia',
                },
            });

            const loginReponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username: 'dicoding',
                    password: 'asd',
                },
            });

            const { refreshToken } = JSON.parse(loginReponse.payload).data;

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: '/authentications',
                payload: { refreshToken },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.message).toEqual('berhasil logout');
        });
    });
});
