const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');

describe('/threads endpoint', () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await RepliesTableTestHelper.cleanTable();
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
                'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak lengkap',
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
                'tidak dapat membuat thread baru karena tipe data tidak sesuai',
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
            expect(responseJson.data.addedThread).toHaveProperty(
                'title',
                'Di atas Awan',
            );
            expect(responseJson.data.addedThread.id).toBeDefined();
            expect(responseJson.data.addedThread.owner).toBeDefined();
        });
    });

    describe('when POST /threads/{threadId}/comments', () => {
        it('should response 201 and persisted comment', async () => {
            // Arrange
            const requestPayload = {
                content: 'Tentang cerita dulu',
            };
            const accessToken = await ServerTestHelper.getAccessToken();
            const threadId = await ThreadsTableTestHelper.addThread({});

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
            expect(responseJson.data.addedComment).toHaveProperty(
                'content',
                'Tentang cerita dulu',
            );
            expect(responseJson.data.addedComment.id).toBeDefined();
            expect(responseJson.data.addedComment.owner).toBeDefined();
        });

        it('should response 400 when request payload not contain needed property', async () => {
            // Arrange
            const requestPayload = {};
            const accessToken = await ServerTestHelper.getAccessToken();
            const threadId = await ThreadsTableTestHelper.addThread({});

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
                'tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak lengkap',
            );
        });

        it('should response 400 when request payload not meet data type specification', async () => {
            // Arrange
            const requestPayload = {
                content: 123,
            };
            const accessToken = await ServerTestHelper.getAccessToken();
            const threadId = await ThreadsTableTestHelper.addThread({});

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
                'tidak dapat membuat komentar baru karena tipe data tidak sesuai',
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

    describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
        it('should response 200 and persisted delete comment', async () => {
            // Arrange
            const accessToken = await ServerTestHelper.getAccessToken();
            const threadId = await ThreadsTableTestHelper.addThread({});
            const commentId = await CommentsTableTestHelper.addComment({});

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

        it('should response 404 when comment is not exist', async () => {
            // Arrange
            const accessToken = await ServerTestHelper.getAccessToken();
            const threadId = await ThreadsTableTestHelper.addThread({});

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

    describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
        it('should response 201 and persisted reply', async () => {
            // Arrange
            const requestPayload = {
                content: 'Hai, apa kabar',
            };
            const accessToken = await ServerTestHelper.getAccessToken();
            const threadId = await ThreadsTableTestHelper.addThread({});
            const commentId = await CommentsTableTestHelper.addComment({});

            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments/${commentId}/replies`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedReply).toBeDefined();
            expect(responseJson.data.addedReply).toHaveProperty(
                'content',
                'Hai, apa kabar',
            );
            expect(responseJson.data.addedReply.id).toBeDefined();
            expect(responseJson.data.addedReply.content).toBeDefined();
        });

        it('should response 400 when request payload not contain needed property', async () => {
            // Arrange
            const requestPayload = {};
            const accessToken = await ServerTestHelper.getAccessToken();
            const threadId = await ThreadsTableTestHelper.addThread({});
            const commentId = await CommentsTableTestHelper.addComment({});

            const server = await createServer(container);

            // Action

            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments/${commentId}/replies`,
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
                'tidak dapat membuat balasan baru karena properti yang dibutuhkan tidak lengkap',
            );
        });

        it('should response 400 when request payload not meet data type specification', async () => {
            // Arrange
            const requestPayload = {
                content: 123,
            };
            const accessToken = await ServerTestHelper.getAccessToken();
            const threadId = await ThreadsTableTestHelper.addThread({});
            const commentId = await CommentsTableTestHelper.addComment({});

            const server = await createServer(container);

            // Action

            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments/${commentId}/replies`,
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
                'tidak dapat membuat balasan baru karena tipe data tidak sesuai',
            );
        });

        it('should response 404 when comment is not exist', async () => {
            // Arrange
            const requestPayload = {
                content: 'Hai, apa kabar',
            };
            const accessToken = await ServerTestHelper.getAccessToken();

            const server = await createServer(container);

            // Action

            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments/comment-123/replies',
                payload: requestPayload,
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

    describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
        it('should response 200 and persisted delete reply', async () => {
            // Arrange
            const accessToken = await ServerTestHelper.getAccessToken();
            const threadId = await ThreadsTableTestHelper.addThread({});
            const commentId = await CommentsTableTestHelper.addComment({});
            const replyId = await RepliesTableTestHelper.addReply({});

            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.message).toEqual('berhasil menghapus balasan');
        });

        it('should response 404 when reply is not exist', async () => {
            // Arrange
            const accessToken = await ServerTestHelper.getAccessToken();
            const threadId = await ThreadsTableTestHelper.addThread({});
            const commentId = await CommentsTableTestHelper.addComment({});

            const server = await createServer(container);

            // Action

            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}/replies/reply-123`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('balasan tidak ditemukan');
        });
    });

    describe('when GET /threads/{threadId}', () => {
        it('should response 200 and persisted thread details without comments', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({});
            const threadId = await ThreadsTableTestHelper.addThread({});

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
            expect(responseJson.data.thread).toHaveProperty('id', 'thread-123');
            expect(responseJson.data.thread).toHaveProperty(
                'title',
                'Di atas Awan',
            );
            expect(responseJson.data.thread).toHaveProperty(
                'body',
                'Ku ingin terbang',
            );
            expect(responseJson.data.thread.date).toBeDefined();
            expect(responseJson.data.thread).toHaveProperty(
                'username',
                'dicoding',
            );
            expect(responseJson.data.thread.comments).toBeDefined();
            expect(responseJson.data.thread.comments).toHaveLength(0);
        });

        it('should response 200 and persisted thread details with comments', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({});
            const threadId = await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});

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
            expect(responseJson.data.thread).toHaveProperty('id', 'thread-123');
            expect(responseJson.data.thread).toHaveProperty(
                'title',
                'Di atas Awan',
            );
            expect(responseJson.data.thread).toHaveProperty(
                'body',
                'Ku ingin terbang',
            );
            expect(responseJson.data.thread.date).toBeDefined();
            expect(responseJson.data.thread).toHaveProperty(
                'username',
                'dicoding',
            );
            expect(responseJson.data.thread.comments).toBeDefined();
            expect(responseJson.data.thread.comments).toHaveLength(1);
            expect(responseJson.data.thread.comments[0]).toHaveProperty(
                'id',
                'comment-123',
            );
            expect(responseJson.data.thread.comments[0]).toHaveProperty(
                'content',
                'Tentang cerita dulu',
            );
            expect(responseJson.data.thread.comments[0].date).toBeDefined();
            expect(responseJson.data.thread.comments[0]).toHaveProperty(
                'username',
                'dicoding',
            );
            expect(responseJson.data.thread.comments[0].replies).toBeDefined();
            expect(responseJson.data.thread.comments[0].replies).toHaveLength(
                0,
            );
        });

        it('should response 200 and persisted thread details with comments and replies', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({});
            const threadId = await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});
            await RepliesTableTestHelper.addReply({});

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
            expect(responseJson.data.thread).toHaveProperty('id', 'thread-123');
            expect(responseJson.data.thread).toHaveProperty(
                'title',
                'Di atas Awan',
            );
            expect(responseJson.data.thread).toHaveProperty(
                'body',
                'Ku ingin terbang',
            );
            expect(responseJson.data.thread.date).toBeDefined();
            expect(responseJson.data.thread).toHaveProperty(
                'username',
                'dicoding',
            );
            expect(responseJson.data.thread.comments).toBeDefined();
            expect(responseJson.data.thread.comments).toHaveLength(1);
            expect(responseJson.data.thread.comments[0]).toHaveProperty(
                'id',
                'comment-123',
            );
            expect(responseJson.data.thread.comments[0]).toHaveProperty(
                'content',
                'Tentang cerita dulu',
            );
            expect(responseJson.data.thread.comments[0].date).toBeDefined();
            expect(responseJson.data.thread.comments[0]).toHaveProperty(
                'username',
                'dicoding',
            );
            expect(responseJson.data.thread.comments[0].replies).toBeDefined();
            expect(responseJson.data.thread.comments[0].replies).toHaveLength(
                1,
            );
            expect(
                responseJson.data.thread.comments[0].replies[0],
            ).toHaveProperty('id', 'reply-123');
            expect(
                responseJson.data.thread.comments[0].replies[0],
            ).toHaveProperty('content', 'Hai, apa kabar');
            expect(
                responseJson.data.thread.comments[0].replies[0],
            ).toHaveProperty('date');
            expect(
                responseJson.data.thread.comments[0].replies[0],
            ).toHaveProperty('username', 'dicoding');
        });

        it('should response 200 and persisted thread details with deleted comments and exist replies', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({});
            const threadId = await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});
            await RepliesTableTestHelper.addReply({});
            await CommentsTableTestHelper.deleteComment({});

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
            expect(responseJson.data.thread).toHaveProperty('id', 'thread-123');
            expect(responseJson.data.thread).toHaveProperty(
                'title',
                'Di atas Awan',
            );
            expect(responseJson.data.thread).toHaveProperty(
                'body',
                'Ku ingin terbang',
            );
            expect(responseJson.data.thread.date).toBeDefined();
            expect(responseJson.data.thread).toHaveProperty(
                'username',
                'dicoding',
            );
            expect(responseJson.data.thread.comments).toBeDefined();
            expect(responseJson.data.thread.comments).toHaveLength(1);
            expect(responseJson.data.thread.comments[0]).toHaveProperty(
                'id',
                'comment-123',
            );
            expect(responseJson.data.thread.comments[0]).toHaveProperty(
                'content',
                '**komentar telah dihapus**',
            );
            expect(responseJson.data.thread.comments[0].date).toBeDefined();
            expect(responseJson.data.thread.comments[0]).toHaveProperty(
                'username',
                'dicoding',
            );
            expect(responseJson.data.thread.comments[0].replies).toBeDefined();
            expect(responseJson.data.thread.comments[0].replies).toHaveLength(
                1,
            );
            expect(
                responseJson.data.thread.comments[0].replies[0],
            ).toHaveProperty('id', 'reply-123');
            expect(
                responseJson.data.thread.comments[0].replies[0],
            ).toHaveProperty('content', 'Hai, apa kabar');
            expect(
                responseJson.data.thread.comments[0].replies[0].date,
            ).toBeDefined();
            expect(
                responseJson.data.thread.comments[0].replies[0],
            ).toHaveProperty('username', 'dicoding');
        });

        it('should response 200 and persisted thread details with exist comments and deleted replies', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({});
            const threadId = await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});
            await RepliesTableTestHelper.addReply({});
            await RepliesTableTestHelper.deleteReply({});

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
            expect(responseJson.data.thread).toHaveProperty('id', 'thread-123');
            expect(responseJson.data.thread).toHaveProperty(
                'title',
                'Di atas Awan',
            );
            expect(responseJson.data.thread).toHaveProperty(
                'body',
                'Ku ingin terbang',
            );
            expect(responseJson.data.thread.date).toBeDefined();
            expect(responseJson.data.thread).toHaveProperty(
                'username',
                'dicoding',
            );
            expect(responseJson.data.thread.comments).toBeDefined();
            expect(responseJson.data.thread.comments).toHaveLength(1);
            expect(responseJson.data.thread.comments[0]).toHaveProperty(
                'id',
                'comment-123',
            );
            expect(responseJson.data.thread.comments[0]).toHaveProperty(
                'content',
                'Tentang cerita dulu',
            );
            expect(responseJson.data.thread.comments[0].date).toBeDefined();
            expect(responseJson.data.thread.comments[0]).toHaveProperty(
                'username',
                'dicoding',
            );
            expect(responseJson.data.thread.comments[0].replies).toBeDefined();
            expect(responseJson.data.thread.comments[0].replies).toHaveLength(
                1,
            );
            expect(
                responseJson.data.thread.comments[0].replies[0],
            ).toHaveProperty('id', 'reply-123');
            expect(
                responseJson.data.thread.comments[0].replies[0],
            ).toHaveProperty('content', '**balasan telah dihapus**');
            expect(
                responseJson.data.thread.comments[0].replies[0].date,
            ).toBeDefined();
            expect(
                responseJson.data.thread.comments[0].replies[0],
            ).toHaveProperty('username', 'dicoding');
        });

        it('should response 200 and persisted thread details with deleted comments and deleted replies', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({});
            const threadId = await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});
            await RepliesTableTestHelper.addReply({});
            await CommentsTableTestHelper.deleteComment({});
            await RepliesTableTestHelper.deleteReply({});

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
            expect(responseJson.data.thread).toHaveProperty('id', 'thread-123');
            expect(responseJson.data.thread).toHaveProperty(
                'title',
                'Di atas Awan',
            );
            expect(responseJson.data.thread).toHaveProperty(
                'body',
                'Ku ingin terbang',
            );
            expect(responseJson.data.thread.date).toBeDefined();
            expect(responseJson.data.thread).toHaveProperty(
                'username',
                'dicoding',
            );
            expect(responseJson.data.thread.comments).toBeDefined();
            expect(responseJson.data.thread.comments).toHaveLength(1);
            expect(responseJson.data.thread.comments[0]).toHaveProperty(
                'id',
                'comment-123',
            );
            expect(responseJson.data.thread.comments[0]).toHaveProperty(
                'content',
                '**komentar telah dihapus**',
            );
            expect(responseJson.data.thread.comments[0].date).toBeDefined();
            expect(responseJson.data.thread.comments[0]).toHaveProperty(
                'username',
                'dicoding',
            );
            expect(responseJson.data.thread.comments[0].replies).toBeDefined();
            expect(responseJson.data.thread.comments[0].replies).toHaveLength(
                1,
            );
            expect(
                responseJson.data.thread.comments[0].replies[0],
            ).toHaveProperty('id', 'reply-123');
            expect(
                responseJson.data.thread.comments[0].replies[0],
            ).toHaveProperty('content', '**balasan telah dihapus**');
            expect(
                responseJson.data.thread.comments[0].replies[0].date,
            ).toBeDefined();
            expect(
                responseJson.data.thread.comments[0].replies[0],
            ).toHaveProperty('username', 'dicoding');
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

    describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
        it('should response 200 and persisted like comment', async () => {
            // Arrange
            const accessToken = await ServerTestHelper.getAccessToken();
            const threadId = await ThreadsTableTestHelper.addThread({});
            const commentId = await CommentsTableTestHelper.addComment({});

            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'PUT',
                url: `/threads/${threadId}/comments/${commentId}/likes`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');

            const likes = await LikesTableTestHelper.getLikesByCommentId({});
            expect(likes).toHaveLength(1);
        });

        it('should response 404 when reply is not exist', async () => {
            // Arrange
            const accessToken = await ServerTestHelper.getAccessToken();
            const threadId = await ThreadsTableTestHelper.addThread({});
            const commentId = await CommentsTableTestHelper.addComment({});
            await LikesTableTestHelper.addLike({});

            const server = await createServer(container);

            // Action

            const response = await server.inject({
                method: 'PUT',
                url: `/threads/${threadId}/comments/${commentId}/likes`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');

            const likes = await LikesTableTestHelper.getLikesByCommentId({});
            expect(likes).toHaveLength(0);
        });
    });
});
