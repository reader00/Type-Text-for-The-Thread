const ReplyRepository = require('../../Domains/threads/reply/ReplyRepository');
const pool = require('../database/postgres/pool');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ForbiddenError = require('../../Commons/exceptions/ForbiddenError');
const AddedReply = require('../../Domains/threads/reply/entities/AddedReply');

class ReplyRepositoryPostgres extends ReplyRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async verifyReplyExist({ commentId, replyId }) {
        const query = {
            text: 'SELECT id FROM replies WHERE id = $1 AND comment_id = $2',
            values: [replyId, commentId],
        };

        const results = await this._pool.query(query);

        if (!results.rowCount) {
            throw new NotFoundError('balasan tidak ditemukan');
        }
    }

    async addReply(addReply) {
        const { commentId, content, owner } = addReply;
        const id = `reply-${this._idGenerator()}`;

        const query = {
            text: 'INSERT INTO replies(id, comment_id, content, owner, date) VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
            values: [id, commentId, content, owner, new Date().toISOString()],
        };

        const result = await pool.query(query);

        return new AddedReply({ ...result.rows[0] });
    }

    async getRepliesByThreadId({ threadId }) {
        const query = {
            text: `	SELECT
						r.id,
						r.comment_id,
						r.date,
						r.is_deleted,
						r.content,
						u.username
					FROM replies r
					JOIN users u ON r.owner = u.id
					JOIN comments c ON r.comment_id = c.id
					WHERE c.thread_id = $1
					ORDER BY r.date ASC`,
            values: [threadId],
        };

        const results = await this._pool.query(query);

        return results.rows;
    }

    async deleteReplyById({ replyId, owner }) {
        const query = {
            text: `UPDATE replies SET is_deleted = 1 WHERE id = $1 AND owner = $2 RETURNING id`,
            values: [replyId, owner],
        };

        const results = await this._pool.query(query);
        if (!results.rowCount) {
            throw new ForbiddenError('anda tidak berhak menghapus balasan ini');
        }
    }
}

module.exports = ReplyRepositoryPostgres;
