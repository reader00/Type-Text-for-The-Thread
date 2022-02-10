const pool = require('../../database/postgres/pool');
const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');

describe('/threads endpoint', () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadTableTestHelper.cleanTable();
    });

    describe('when POST /threads', () => {
        it('should response 400 when request payload not contain needed property', async () => {
            // Arrange
            const requestPayload = {
                title: 'Di atas Awan',
            };
            const accessToken = await ServerTestHelper.getAccessToken();

            const server = await createServer(container);

            // Action

            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual(
                'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak lengkap'
            );
        });

        it('should response 400 when request payload not meet data type specification', async () => {
            // Arrange
            const requestPayload = {
                title: 123,
                body: true,
            };
            const accessToken = await ServerTestHelper.getAccessToken();

            const server = await createServer(container);

            // Action

            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual(
                'tidak dapat membuat thread baru karena tipe data tidak sesuai'
            );
        });

        it('should response 401 when no access token given', async () => {
            // Arrange
            const requestPayload = {
                title: 'Di atas Awan',
                body: 'Ku ingin terbang',
            };

            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(401);
            expect(responseJson.error).toEqual('Unauthorized');
        });

        it('should response 201 and persisted user', async () => {
            // Arrange
            const requestPayload = {
                title: 'Di atas Awan',
                body: 'Ku ingin terbang',
            };
            const accessToken = await ServerTestHelper.getAccessToken();

            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedThread).toBeDefined();
            expect(responseJson.data.addedThread).toHaveProperty('id');
            expect(responseJson.data.addedThread).toHaveProperty('title');
            expect(responseJson.data.addedThread).toHaveProperty('owner');
        });
    });

    describe('when POST /threads/{threadId}/comments', () => {
        it('should response 201 and persisted comment', async () => {
            // Arrange
            const requestPayload = {
                content: 'Tentang cerita dulu',
            };
            const accessToken = await ServerTestHelper.getAccessToken();
            const threadId = await ThreadTableTestHelper.addThread({});

            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedComment).toBeDefined();
            expect(responseJson.data.addedComment).toHaveProperty('id');
            expect(responseJson.data.addedComment).toHaveProperty('content');
            expect(responseJson.data.addedComment).toHaveProperty('owner');
        });

        it('should response 400 when request payload not contain needed property', async () => {
            // Arrange
            const requestPayload = {};
            const accessToken = await ServerTestHelper.getAccessToken();
            const threadId = await ThreadTableTestHelper.addThread({});

            const server = await createServer(container);

            // Action

            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual(
                'tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak lengkap'
            );
        });

        it('should response 400 when request payload not meet data type specification', async () => {
            // Arrange
            const requestPayload = {
                content: 123,
            };
            const accessToken = await ServerTestHelper.getAccessToken();
            const threadId = await ThreadTableTestHelper.addThread({});

            const server = await createServer(container);

            // Action

            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual(
                'tidak dapat membuat komentar baru karena tipe data tidak sesuai'
            );
        });

        it('should response 404 when thread is not exist', async () => {
            // Arrange
            const requestPayload = {
                content: 'Tentang cerita dulu',
            };
            const accessToken = await ServerTestHelper.getAccessToken();

            const server = await createServer(container);

            // Action

            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('thread tidak ditemukan');
        });
    });

    describe('when GET /threads/{threadId}', () => {
        it('should response 200 and persisted thread details', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({});
            const threadId = await ThreadTableTestHelper.addThread({});

            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'GET',
                url: `/threads/${threadId}`,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.thread).toBeDefined();
            expect(responseJson.data.thread).toHaveProperty('id');
            expect(responseJson.data.thread).toHaveProperty('title');
            expect(responseJson.data.thread).toHaveProperty('body');
            expect(responseJson.data.thread).toHaveProperty('date');
            expect(responseJson.data.thread).toHaveProperty('username');
            expect(responseJson.data.thread).toHaveProperty('comments');
        });

        it('should response 404 when thread is not exist', async () => {
            // Arrange

            const server = await createServer(container);

            // Action

            const response = await server.inject({
                method: 'GET',
                url: '/threads/thread-123',
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('thread tidak ditemukan');
        });
    });

    describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
        it('should response 200 and persisted delete comment', async () => {
            // Arrange
            const accessToken = await ServerTestHelper.getAccessToken();
            const threadId = await ThreadTableTestHelper.addThread({});
            const commentId = await ThreadTableTestHelper.addComment({});

            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.message).toEqual('berhasil menghapus komentar');
        });

        it('should response 404 when thread is not exist', async () => {
            // Arrange
            const accessToken = await ServerTestHelper.getAccessToken();
            const threadId = await ThreadTableTestHelper.addThread({});

            const server = await createServer(container);

            // Action

            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/comment-123`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('komentar tidak ditemukan');
        });
    });
});
