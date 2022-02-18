const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ForbiddenError = require('../../../Commons/exceptions/ForbiddenError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddComment = require('../../../Domains/threads/comment/entities/AddComment');
const AddedComment = require('../../../Domains/threads/comment/entities/AddedComment');
const DeleteComment = require('../../../Domains/threads/comment/entities/DeleteComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
    beforeAll(async () => {
        await UsersTableTestHelper.addUser({});
    });

    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await UsersTableTestHelper.cleanTable();
        await pool.end();
    });

    describe('verifyCommentExist function', () => {
        it('should throw NotFoundError when comment is not exist', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool,
                {},
            );

            // Action and Assert
            await expect(
                commentRepositoryPostgres.verifyCommentExist('reply-123'),
            ).rejects.toThrow(NotFoundError);
        });

        it('should not throw NotFoundError when comment is exist', async () => {
            // Arrange
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});
            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool,
                {},
            );

            // Action and Assert
            await expect(
                commentRepositoryPostgres.verifyCommentExist({
                    threadId: 'thread-123',
                    commentId: 'comment-123',
                }),
            ).resolves.not.toThrowError(NotFoundError);
        });
    });

    describe('addComment function', () => {
        beforeEach(async () => {
            await ThreadsTableTestHelper.addThread({});
        });

        it('should persist add comment', async () => {
            // Arrange
            const addComment = new AddComment({
                threadId: 'thread-123',
                content: 'Tentang cerita dulu',
                owner: 'user-123',
            });

            const fakeIdGenerator = () => '123'; // stub
            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool,
                fakeIdGenerator,
            );

            // Action
            await commentRepositoryPostgres.addComment(addComment);

            // Assert
            const comment = await CommentsTableTestHelper.findCommentById(
                'comment-123',
            );
            expect(comment).toHaveLength(1);
            expect(comment[0]).toHaveProperty('id', 'comment-123');
            expect(comment[0]).toHaveProperty('thread_id', 'thread-123');
            expect(comment[0]).toHaveProperty('content', 'Tentang cerita dulu');
            expect(comment[0]).toHaveProperty('owner', 'user-123');
            expect(comment[0]).toHaveProperty('is_deleted', false);
            expect(comment[0]).toHaveProperty('date');
        });

        it('should return added comment correctly', async () => {
            // Arrange
            const addComment = new AddComment({
                threadId: 'thread-123',
                content: 'Hai, apa kabar',
                owner: 'user-123',
            });

            const fageIdGenerator = () => '123'; // stub
            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool,
                fageIdGenerator,
            );

            // Action
            const addedComment = await commentRepositoryPostgres.addComment(
                addComment,
            );

            // Assert
            expect(addedComment).toStrictEqual(
                new AddedComment({
                    id: 'comment-123',
                    content: 'Hai, apa kabar',
                    owner: 'user-123',
                }),
            );
        });
    });

    describe('getCommentsByThreadId', () => {
        beforeEach(async () => {
            await ThreadsTableTestHelper.addThread({});
        });

        it('should return empty comments if there is no comment in the thread', async () => {
            // Arrange

            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool,
                {},
            );

            // Action
            const comments =
                await commentRepositoryPostgres.getCommentsByThreadId({
                    threadId: 'thread-123',
                });

            // Assert
            expect(comments).toHaveLength(0);
        });

        it('should return comments correctly', async () => {
            // Arrange
            await CommentsTableTestHelper.addComment({});

            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool,
                {},
            );

            // Action
            const comments =
                await commentRepositoryPostgres.getCommentsByThreadId({
                    threadId: 'thread-123',
                });

            // Assert
            expect(comments).toHaveLength(1);
            expect(comments[0]).toHaveProperty('id', 'comment-123');
            expect(comments[0]).toHaveProperty('thread_id', 'thread-123');
            expect(comments[0]).toHaveProperty(
                'content',
                'Tentang cerita dulu',
            );
            expect(comments[0]).toHaveProperty('username', 'dicoding');
            expect(comments[0]).toHaveProperty('is_deleted', false);
            expect(comments[0]).toHaveProperty('date');
        });
    });

    describe('deleteCommentById function', () => {
        beforeEach(async () => {
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});
        });

        it('should persist delete comment', async () => {
            // Arrange
            const deleteComment = new DeleteComment({
                threadId: 'thread-123',
                commentId: 'comment-123',
                owner: 'user-123',
            });

            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool,
                {},
            );

            // Action and Assert
            await expect(
                commentRepositoryPostgres.deleteCommentById(deleteComment),
            ).resolves.not.toThrow(ForbiddenError);
            const comment = await CommentsTableTestHelper.findCommentById(
                'comment-123',
            );
            expect(comment).toHaveLength(1);
            expect(comment[0]).toHaveProperty('is_deleted', true);
        });

        it('should throw ForbiddenError when the access user is not the owner', async () => {
            // Arrange
            const deleteComment = new DeleteComment({
                threadId: 'thread-123',
                commentId: 'comment-123',
                owner: 'user-124',
            });

            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool,
                {},
            );

            // Action and Assert
            await expect(
                commentRepositoryPostgres.deleteCommentById(deleteComment),
            ).rejects.toThrow(ForbiddenError);
            const comment = await CommentsTableTestHelper.findCommentById(
                'comment-123',
            );
            expect(comment).toHaveLength(1);
        });
    });
});
