const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ForbiddenError = require('../../../Commons/exceptions/ForbiddenError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddComment = require('../../../Domains/threads/entities/AddComment');
const AddedComment = require('../../../Domains/threads/entities/AddedComment');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const AddThread = require('../../../Domains/threads/entities/addThread');
const DeleteComment = require('../../../Domains/threads/entities/DeleteComment');
const GetThreadDetails = require('../../../Domains/threads/entities/GetThreadDetails');
const ThreadDetails = require('../../../Domains/threads/entities/ThreadDetails');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
    beforeAll(async () => {
        await UsersTableTestHelper.addUser({});
    });

    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await UsersTableTestHelper.cleanTable();
        await pool.end();
    });

    describe('addThread function', () => {
        it('should persist add thread and return added thread correctly', async () => {
            // Arrange
            const addThread = new AddThread({
                title: 'Di atas Awan',
                body: 'Ku ingin terbang',
                owner: 'user-123',
            });

            const fakeIdGenerator = () => '123'; // stub!
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await threadRepositoryPostgres.addThread(addThread);

            // Assert
            const users = await ThreadsTableTestHelper.findThreadById('thread-123');
            expect(users).toHaveLength(1);
        });

        it('should return added thread correctly', async () => {
            // Arrange
            const addThread = new AddThread({
                title: 'Di atas Awan',
                body: 'Ku ingin terbang',
                owner: 'user-123',
            });

            const fakeIdGenerator = () => '123'; // stub!
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const addedThread = await threadRepositoryPostgres.addThread(addThread);

            // Assert
            expect(addedThread).toStrictEqual(
                new AddedThread({
                    id: 'thread-123',
                    title: 'Di atas Awan',
                    owner: 'user-123',
                })
            );
        });
    });

    describe('verifyThreadExist function', () => {
        it('should throw InvariantError when thread is not exist', async () => {
            // Arrange
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Action and Assert
            await expect(threadRepositoryPostgres.verifyThreadExist('thread-123')).rejects.toThrow(
                NotFoundError
            );
        });

        it('should not throw InvariantError when thread is not exist', async () => {
            // Arrange
            await ThreadsTableTestHelper.addThread({});
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Action and Assert
            expect(threadRepositoryPostgres.verifyThreadExist('thread-123')).resolves.not.toThrowError(
                NotFoundError
            );
        });
    });

    describe('addComment function', () => {
        it('should persist add comment', async () => {
            // Arrange
            await ThreadsTableTestHelper.addThread({});
            const addComment = new AddComment({
                threadId: 'thread-123',
                content: 'Tentang cerita dulu',
                owner: 'user-123',
            });

            const fakeIdGenerator = () => '123'; // stub
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await threadRepositoryPostgres.addComment(addComment);

            // Assert
            const comment = await ThreadsTableTestHelper.findCommentById('comment-123');
            expect(comment).toHaveLength(1);
        });

        it('should return added comment correctly', async () => {
            // Arrange
            await ThreadsTableTestHelper.addThread({});
            const addComment = new AddComment({
                threadId: 'thread-123',
                content: 'Tentang cerita dulu',
                owner: 'user-123',
            });

            const fageIdGenerator = () => '123'; // stub
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fageIdGenerator);

            // Action
            const addedComment = await threadRepositoryPostgres.addComment(addComment);

            // Assert
            expect(addedComment).toStrictEqual(
                new AddedComment({
                    id: 'comment-123',
                    content: 'Tentang cerita dulu',
                    owner: 'user-123',
                })
            );
        });
    });

    describe('deleteCommentById function', () => {
        it('should persist delete comment detail', async () => {
            // Arrange
            await ThreadsTableTestHelper.addThread({});
            await ThreadsTableTestHelper.addComment({});

            const getThreadDetails = new DeleteComment({
                threadId: 'thread-123',
                commentId: 'comment-123',
                owner: 'user-123',
            });

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Action and Assert
            await expect(
                threadRepositoryPostgres.getThreadDetailsById(getThreadDetails)
            ).resolves.not.toThrow(ForbiddenError);
        });

        it('should throw ForbiddenError when the access user is not the owner', async () => {
            // Arrange
            await ThreadsTableTestHelper.addThread({});
            await ThreadsTableTestHelper.addComment({});

            const deleteComment = new DeleteComment({
                threadId: 'thread-123',
                commentId: 'comment-123',
                owner: 'user-124',
            });

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Action and Assert
            await expect(threadRepositoryPostgres.deleteCommentById(deleteComment)).rejects.toThrow(
                ForbiddenError
            );
        });
    });

    describe('getThreadDetailsById function', () => {
        it('should return thread details correctly', async () => {
            // Arrange
            await ThreadsTableTestHelper.addThread({});
            const getThreadDetails = new GetThreadDetails({
                threadId: 'thread-123',
            });

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Action
            const threadDetails = await threadRepositoryPostgres.getThreadDetailsById(getThreadDetails);

            // Assert
            expect(threadDetails).toHaveProperty('id');
            expect(threadDetails).toHaveProperty('title');
            expect(threadDetails).toHaveProperty('body');
            expect(threadDetails).toHaveProperty('date');
            expect(threadDetails).toHaveProperty('username');
        });
    });

    describe('getThreadCommentsById', () => {
        it('should return empty comments', async () => {
            // Arrange
            const threadId = await ThreadsTableTestHelper.addThread({});

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Action
            const comments = await threadRepositoryPostgres.getThreadCommentsById({ threadId });

            // Assert
            expect(comments).toHaveLength(0);
        });

        it('should return comments correctly', async () => {
            // Arrange
            const threadId = await ThreadsTableTestHelper.addThread({});
            await ThreadsTableTestHelper.addComment({});

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Action
            const comments = await threadRepositoryPostgres.getThreadCommentsById({ threadId });

            // Assert
            expect(comments).toHaveLength(1);
            expect(comments[0]).toHaveProperty('content');
            expect(comments[0].content).toBeDefined();
        });

        it('should return "**komentar telah dihapus**" for deleted comments', async () => {
            // Arrange
            const threadId = await ThreadsTableTestHelper.addThread({});
            await ThreadsTableTestHelper.addComment({});
            await ThreadsTableTestHelper.deleteComment({});

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Action
            const comments = await threadRepositoryPostgres.getThreadCommentsById({ threadId });

            // Assert
            expect(comments).toHaveLength(1);
            expect(comments[0]).toHaveProperty('content');
            expect(comments[0].content).toEqual('**komentar telah dihapus**');
        });
    });
});
