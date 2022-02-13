const ThreadRepository = require('../../Domains/threads/thread/ThreadRepository');
const pool = require('../database/postgres/pool');
const AddedThread = require('../../Domains/threads/thread/entities/AddedThread');
const AddedComment = require('../../Domains/threads/comment/entities/AddedComment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ForbiddenError = require('../../Commons/exceptions/ForbiddenError');
const AddedReply = require('../../Domains/threads/reply/entities/AddedReply');

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addThread(addThread) {
        const { title, body, owner } = addThread;
        const id = `thread-${this._idGenerator()}`;

        const query = {
            text: 'INSERT INTO threads(id, title, body, owner, date) VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
            values: [id, title, body, owner, new Date().toISOString()],
        };

        const result = await pool.query(query);

        return new AddedThread({ ...result.rows[0] });
    }

    async verifyThreadExist(threadId) {
        const query = {
            text: 'SELECT id FROM threads WHERE id = $1',
            values: [threadId],
        };

        const results = await this._pool.query(query);

        if (!results.rowCount) {
            throw new NotFoundError('thread tidak ditemukan');
        }
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

    async addComment(addComment) {
        const { threadId, content, owner } = addComment;
        const id = `comment-${this._idGenerator()}`;

        const query = {
            text: 'INSERT INTO comments(id, thread_id, content, owner, date) VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
            values: [id, threadId, content, owner, new Date().toISOString()],
        };

        const result = await pool.query(query);

        return new AddedComment({ ...result.rows[0] });
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

    async getThreadDetailsById({ threadId }) {
        const query = {
            text: `	SELECT t.id, t.title, t.body, CAST(t.date AS VARCHAR) date, u.username
					FROM threads t
					JOIN users u ON t.owner = u.id
					WHERE t.id = $1`,
            values: [threadId],
        };

        const results = await this._pool.query(query);

        return results.rows[0];
    }

    async getThreadCommentsById({ threadId }) {
        const query = {
            text: `	SELECT
						c.id,
						CAST(c.date AS VARCHAR) date,
						CASE
							when c.is_deleted = 1 then '**komentar telah dihapus**'
						ELSE 
							c.content
						END AS content,
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

    async getCommentRepliesById({ commentId }) {
        const query = {
            text: `	SELECT
						r.id,
						CAST(r.date AS VARCHAR) date,
						CASE
							when r.is_deleted = 1 then '**balasan telah dihapus**'
						ELSE 
							r.content
						END AS content,
						u.username
					FROM replies r
					JOIN users u ON r.owner = u.id
					JOIN comments c ON r.comment_id = c.id
					WHERE r.comment_id = $1
					ORDER BY r.date ASC`,
            values: [commentId],
        };

        const results = await this._pool.query(query);

        return results.rows;
    }

    async deleteCommentById({ commentId, owner }) {
        const query = {
            text: `UPDATE comments SET is_deleted = 1 WHERE id = $1 AND owner = $2 RETURNING id`,
            values: [commentId, owner],
        };

        const results = await this._pool.query(query);
        if (!results.rowCount) {
            throw new ForbiddenError('anda tidak berhak menghapus komentar ini');
        }
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

module.exports = ThreadRepositoryPostgres;
