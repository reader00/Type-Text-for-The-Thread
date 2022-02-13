const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ForbiddenError = require('../../../Commons/exceptions/ForbiddenError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddComment = require('../../../Domains/threads/entities/AddComment');
const AddedComment = require('../../../Domains/threads/entities/AddedComment');
const AddedReply = require('../../../Domains/threads/entities/AddedReply');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const AddReply = require('../../../Domains/threads/entities/AddReply');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const DeleteComment = require('../../../Domains/threads/entities/DeleteComment');
const DeleteReply = require('../../../Domains/threads/entities/DeleteReply');
const GetThreadDetails = require('../../../Domains/threads/entities/GetThreadDetails');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
    beforeAll(async () => {
        await UsersTableTestHelper.addUser({});
    });

    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await RepliesTableTestHelper.cleanTable();
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
            await expect(threadRepositoryPostgres.verifyThreadExist('thread-123')).resolves.not.toThrowError(
                NotFoundError
            );
        });
    });

    describe('verifyCommentExist function', () => {
        it('should throw InvariantError when comment is not exist', async () => {
            // Arrange
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Action and Assert
            await expect(threadRepositoryPostgres.verifyCommentExist('reply-123')).rejects.toThrow(
                NotFoundError
            );
        });

        it('should not throw InvariantError when comment is not exist', async () => {
            // Arrange
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Action and Assert
            await expect(
                threadRepositoryPostgres.verifyCommentExist({
                    threadId: 'thread-123',
                    commentId: 'comment-123',
                })
            ).resolves.not.toThrowError(NotFoundError);
        });
    });

    describe('verifyReplyExist function', () => {
        it('should throw InvariantError when reply is not exist', async () => {
            // Arrange
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Action and Assert
            await expect(threadRepositoryPostgres.verifyReplyExist('reply-123')).rejects.toThrow(
                NotFoundError
            );
        });

        it('should not throw InvariantError when reply is not exist', async () => {
            // Arrange
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});
            await RepliesTableTestHelper.addReply({});
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Action and Assert
            await expect(
                threadRepositoryPostgres.verifyReplyExist({ commentId: 'comment-123', replyId: 'reply-123' })
            ).resolves.not.toThrowError(NotFoundError);
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
            const comment = await CommentsTableTestHelper.findCommentById('comment-123');
            expect(comment).toHaveLength(1);
        });

        it('should return added comment correctly', async () => {
            // Arrange
            await ThreadsTableTestHelper.addThread({});
            const addComment = new AddComment({
                threadId: 'thread-123',
                content: 'Hai, apa kabar',
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
                    content: 'Hai, apa kabar',
                    owner: 'user-123',
                })
            );
        });
    });

    describe('addReply function', () => {
        it('should persist add reply', async () => {
            // Arrange
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});
            const addReply = new AddReply({
                commentId: 'comment-123',
                content: 'Hai, apa kabar',
                owner: 'user-123',
            });

            const fakeIdGenerator = () => '123'; // stub
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await threadRepositoryPostgres.addReply(addReply);

            // Assert
            const reply = await RepliesTableTestHelper.findReplyById('reply-123');
            expect(reply).toHaveLength(1);
        });

        it('should return added reply correctly', async () => {
            // Arrange
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});
            const addReply = new AddReply({
                commentId: 'comment-123',
                content: 'Hai, apa kabar',
                owner: 'user-123',
            });

            const fageIdGenerator = () => '123'; // stub
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fageIdGenerator);

            // Action
            const addedReply = await threadRepositoryPostgres.addReply(addReply);

            // Assert
            expect(addedReply).toStrictEqual(
                new AddedReply({
                    id: 'reply-123',
                    content: 'Hai, apa kabar',
                    owner: 'user-123',
                })
            );
        });
    });

    describe('deleteCommentById function', () => {
        it('should persist delete comment detail', async () => {
            // Arrange
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});

            const deleteComment = new DeleteComment({
                threadId: 'thread-123',
                commentId: 'comment-123',
                owner: 'user-123',
            });

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Action and Assert
            await expect(threadRepositoryPostgres.deleteCommentById(deleteComment)).resolves.not.toThrow(
                ForbiddenError
            );
            const comment = await CommentsTableTestHelper.findCommentById('comment-123');
            expect(comment).toHaveLength(1);
            expect(comment[0]).toHaveProperty('is_deleted', 1);
        });

        it('should throw ForbiddenError when the access user is not the owner', async () => {
            // Arrange
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});

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

    describe('deleteReplyById function', () => {
        it('should persist delete reply detail', async () => {
            // Arrange
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});
            await RepliesTableTestHelper.addReply({});

            const deleteReply = new DeleteReply({
                commentId: 'comment-123',
                replyId: 'reply-123',
                owner: 'user-123',
            });

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Action and Assert
            await expect(threadRepositoryPostgres.deleteReplyById(deleteReply)).resolves.not.toThrow(
                ForbiddenError
            );
            const reply = await RepliesTableTestHelper.findReplyById('reply-123');
            expect(reply).toHaveLength(1);
            expect(reply[0]).toHaveProperty('is_deleted', 1);
        });

        it('should throw ForbiddenError when the access user is not the owner', async () => {
            // Arrange
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});
            await RepliesTableTestHelper.addReply({});

            const deleteReply = new DeleteReply({
                commentId: 'comment-123',
                replyId: 'reply-123',
                owner: 'user-124',
            });

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Action and Assert
            await expect(threadRepositoryPostgres.deleteReplyById(deleteReply)).rejects.toThrow(
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
            await CommentsTableTestHelper.addComment({});

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
            await CommentsTableTestHelper.addComment({});
            await CommentsTableTestHelper.deleteComment({});

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Action
            const comments = await threadRepositoryPostgres.getThreadCommentsById({ threadId });

            // Assert
            expect(comments).toHaveLength(1);
            expect(comments[0]).toHaveProperty('content');
            expect(comments[0].content).toEqual('**komentar telah dihapus**');
        });
    });

    describe('getCommentRepliesById', () => {
        it('should return empty replies', async () => {
            // Arrange
            await ThreadsTableTestHelper.addThread({});
            const commentId = await CommentsTableTestHelper.addComment({});

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Action
            const replies = await threadRepositoryPostgres.getThreadCommentsById({ commentId });

            // Assert
            expect(replies).toHaveLength(0);
        });

        it('should return replies correctly', async () => {
            // Arrange
            await ThreadsTableTestHelper.addThread({});
            const commentId = await CommentsTableTestHelper.addComment({});
            await RepliesTableTestHelper.addReply({});

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Action
            const replies = await threadRepositoryPostgres.getCommentRepliesById({ commentId });

            // Assert
            expect(replies).toHaveLength(1);
            expect(replies[0]).toHaveProperty('content');
            expect(replies[0].content).toBeDefined();
        });

        it('should return "**balasan telah dihapus**" for deleted replies', async () => {
            // Arrange
            await ThreadsTableTestHelper.addThread({});
            const commentId = await CommentsTableTestHelper.addComment({});
            await RepliesTableTestHelper.addReply({});
            await RepliesTableTestHelper.deleteReply({});

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Action
            const replies = await threadRepositoryPostgres.getCommentRepliesById({ commentId });

            // Assert
            expect(replies).toHaveLength(1);
            expect(replies[0]).toHaveProperty('content');
            expect(replies[0].content).toEqual('**balasan telah dihapus**');
        });
    });
});
