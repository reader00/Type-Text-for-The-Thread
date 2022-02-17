/* eslint-disable no-tabs */
const LikeRepository = require('../../Domains/threads/like/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async checkLiked({ commentId, owner }) {
        const query = {
            text: 'SELECT id FROM likes WHERE comment_id = $1 AND owner = $2',
            values: [commentId, owner],
        };

        const results = await this._pool.query(query);

        return results.rows;
    }

    async addLike({ commentId, owner }) {
        const id = `like-${this._idGenerator()}`;

        const query = {
            text: 'INSERT INTO likes(id, comment_id, owner) VALUES($1, $2, $3)',
            values: [id, commentId, owner],
        };

        await this._pool.query(query);
    }

    async getLikeCountByCommentId({ commentId }) {
        const query = {
            text: 'SELECT COUNT(*) AS like_count FROM likes WHERE comment_id = $1',
            values: [commentId],
        };

        const results = await this._pool.query(query);

        return results.rows[0].like_count;
    }

    async deleteLike({ commentId, owner }) {
        const query = {
            text: 'DELETE FROM likes WHERE comment_id = $1 AND owner = $2',
            values: [commentId, owner],
        };

        await this._pool.query(query);
    }
}

module.exports = LikeRepositoryPostgres;
