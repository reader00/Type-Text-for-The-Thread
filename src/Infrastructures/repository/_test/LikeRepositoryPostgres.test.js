const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');
const Like = require('../../../Domains/threads/like/entities/Like');
const pool = require('../../database/postgres/pool');

describe('LikeRepositoryPostgres', () => {
    beforeAll(async () => {
        await UsersTableTestHelper.addUser({});
    });

    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await LikesTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await UsersTableTestHelper.cleanTable();
        await pool.end();
    });

    describe('checkLiked function', () => {
        it('should return an empty array when a comment is not liked yet', async () => {
            // Arrange
            await ThreadsTableTestHelper.addThread({});
            const commentId = await CommentsTableTestHelper.addComment({});

            const like = new Like({
                commentId,
                owner: 'user-123',
            });
            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

            // Action
            const liked = await likeRepositoryPostgres.checkLiked(like);

            //Assert
            expect(liked).toHaveLength(0);
        });

        it('should return non empty array when a comment is liked', async () => {
            // Arrange
            await ThreadsTableTestHelper.addThread({});
            const commentId = await CommentsTableTestHelper.addComment({});
            await LikesTableTestHelper.addLike({});

            const like = new Like({
                commentId,
                owner: 'user-123',
            });

            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

            // Action
            const liked = await likeRepositoryPostgres.checkLiked(like);

            //Assert
            expect(liked).toHaveLength(1);
        });
    });

    describe('addLike function', () => {
        it('should persist add like', async () => {
            // Arrange
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});
            const like = new Like({
                commentId: 'comment-123',
                owner: 'user-123',
            });

            const fakeIdGenerator = () => '123'; // stub
            const likeRepositoryPostgres = new LikeRepositoryPostgres(
                pool,
                fakeIdGenerator,
            );

            // Action
            await likeRepositoryPostgres.addLike(like);

            // Assert
            const result = await LikesTableTestHelper.findLikeById('like-123');
            expect(result).toHaveLength(1);
            expect(result[0]).toHaveProperty('id', 'like-123');
            expect(result[0]).toHaveProperty('comment_id', 'comment-123');
            expect(result[0]).toHaveProperty('owner', 'user-123');
            expect(result[0].date).toBeDefined();
        });
    });

    describe('deleteLike function', () => {
        it('should persist delete like', async () => {
            // Arrange
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.addComment({});
            await LikesTableTestHelper.addLike({});
            const like = new Like({
                commentId: 'comment-123',
                owner: 'user-123',
            });

            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

            // Action
            await likeRepositoryPostgres.deleteLike(like);

            // Assert
            const result = await LikesTableTestHelper.findLikeById('like-123');
            expect(result).toHaveLength(0);
        });
    });

    describe('getLikeCountByCommentId', () => {
        it('should return 0 if there is no like in the comment', async () => {
            // Arrange
            await ThreadsTableTestHelper.addThread({});
            const commentId = await CommentsTableTestHelper.addComment({});

            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

            // Action
            const likeCount =
                await likeRepositoryPostgres.getLikeCountByCommentId({
                    commentId,
                    owser: 'user-123',
                });

            // Assert
            expect(parseInt(likeCount)).toEqual(0);
        });

        it('should return 1 if there is a like in the comment', async () => {
            // Arrange
            await ThreadsTableTestHelper.addThread({});
            const commentId = await CommentsTableTestHelper.addComment({});
            await LikesTableTestHelper.addLike({});

            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

            // Action
            const likeCount =
                await likeRepositoryPostgres.getLikeCountByCommentId({
                    commentId,
                    owser: 'user-123',
                });

            // Assert
            expect(parseInt(likeCount)).toEqual(1);
        });
    });
});