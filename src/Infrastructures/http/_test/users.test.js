const pool = require('../../database/postgres/pool');
const UserTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/users endpoint', () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await UserTableTestHelper.cleanTable();
    });

    describe('when POST /users', () => {
        it('should response 201 and persisted user', async () => {
            // Arrange
            const requestPayload = {
                username: 'dicoding',
                password: 'asd',
                fullname: 'Dicoding Indonesia',
            };

            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/users',
                payload: requestPayload,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedUser).toBeDefined();
        });

        it('should response 400 when request payload not contain needed property', async () => {
            // Arrange
            const requestPayload = {
                username: 'dicoding',
            };

            const server = await createServer(container);

            // Action

            const response = await server.inject({
                method: 'POST',
                url: '/users',
                payload: requestPayload,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual(
                'tidak dapat membuat user baru karena properti yang dibutuhkan tidak lengkap',
            );
        });

        it('should response 400 when request payload not meet data type specification', async () => {
            // Arrange
            const requestPayload = {
                username: 123,
                password: true,
                fullname: 'abc',
            };

            const server = await createServer(container);

            // Action

            const response = await server.inject({
                method: 'POST',
                url: '/users',
                payload: requestPayload,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual(
                'tidak dapat membuat user baru karena tipe data tidak sesuai',
            );
        });

        it('should response 400 when username more than 50 characters', async () => {
            // Arrange
            const requestPayload = {
                username:
                    'dicodinggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg',
                password: 'asd',
                fullname: 'Dicoding Indonesia',
            };

            const server = await createServer(container);

            // Action

            const response = await server.inject({
                method: 'POST',
                url: '/users',
                payload: requestPayload,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual(
                'tidak dapat membuat user baru karena karakter username melebihi batas',
            );
        });

        it('should response 400 when username contain restricted characters', async () => {
            // Arrange
            const requestPayload = {
                username: 'dico ding',
                password: 'asd',
                fullname: 'Dicoding Indonesia',
            };

            const server = await createServer(container);

            // Action

            const response = await server.inject({
                method: 'POST',
                url: '/users',
                payload: requestPayload,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual(
                'tidak dapat membuat user baru karena username mengandung karakter terlarang',
            );
        });

        it('should response 400 when username unavailable', async () => {
            // Arrange
            await UserTableTestHelper.addUser({ username: 'dicoding' });
            const requestPayload = {
                username: 'dicoding',
                password: 'asd',
                fullname: 'Dicoding Indonesia',
            };

            const server = await createServer(container);

            // Action

            const response = await server.inject({
                method: 'POST',
                url: '/users',
                payload: requestPayload,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('username tidak tersedia');
        });
    });
});
