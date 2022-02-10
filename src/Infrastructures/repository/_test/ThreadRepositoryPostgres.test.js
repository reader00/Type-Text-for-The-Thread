const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddComment = require('../../../Domains/threads/entities/AddComment');
const AddedComment = require('../../../Domains/threads/entities/AddedComment');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const AddThread = require('../../../Domains/threads/entities/addThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
    beforeAll(async () => {
        await UsersTableTestHelper.addUser({
            id: 'user-123',
            username: 'dicoding',
            password: 'secret',
            fullname: 'Dicoding Indonesia',
        });
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
});
