/* eslint-disable no-tabs */
const CommentRepository = require('../../Domains/threads/comment/CommentRepository');
const AddedComment = require('../../Domains/threads/comment/entities/AddedComment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ForbiddenError = require('../../Commons/exceptions/ForbiddenError');

class CommentRepositoryPostgres extends CommentRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async verifyCommentExist({ threadId, commentId }) {
        const query = {
            text: 'SELECT id FROM comments WHERE id = $1 AND thread_id = $2',
            values: [commentId, threadId],
        };

        const results = await this._pool.query(query);

        if (!results.rowCount) {
            throw new NotFoundError('komentar tidak ditemukan');
        }
    }

    async addComment(addComment) {
        const { threadId, content, owner } = addComment;
        const id = `comment-${this._idGenerator()}`;

        const query = {
            text: 'INSERT INTO comments(id, thread_id, content, owner, date) VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
            values: [id, threadId, content, owner, new Date().toISOString()],
        };

        const result = await this._pool.query(query);

        return new AddedComment({ ...result.rows[0] });
    }

    async getCommentsByThreadId({ threadId }) {
        const query = {
            text: `	SELECT
						c.id,
						c.thread_id,
						c.date,
						c.is_deleted,
						c.content,
						u.username
					FROM comments c
					JOIN users u ON c.owner = u.id
					JOIN threads t ON c.thread_id = t.id
					WHERE c.thread_id = $1
					ORDER BY c.date ASC`,
            values: [threadId],
        };

        const results = await this._pool.query(query);

        return results.rows;
    }

    async deleteCommentById({ commentId, owner }) {
        const query = {
            text: 'UPDATE comments SET is_deleted = true WHERE id = $1 AND owner = $2 RETURNING id',
            values: [commentId, owner],
        };

        const results = await this._pool.query(query);
        if (!results.rowCount) {
            throw new ForbiddenError(
                'anda tidak berhak menghapus komentar ini',
            );
        }
    }
}

module.exports = CommentRepositoryPostgres;
