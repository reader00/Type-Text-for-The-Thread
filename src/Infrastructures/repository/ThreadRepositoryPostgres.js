const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const pool = require('../database/postgres/pool');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const AddedComment = require('../../Domains/threads/entities/AddedComment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadDetails = require('../../Domains/threads/entities/ThreadDetails');

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
            text: 'INSERT INTO threads(id, title, body, owner) VALUES($1, $2, $3, $4) RETURNING id, title, owner',
            values: [id, title, body, owner],
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

    async addComment(addComment) {
        const { threadId, content, owner } = addComment;
        const id = `comment-${this._idGenerator()}`;

        const query = {
            text: 'INSERT INTO comments(id, thread_id, content, owner) VALUES($1, $2, $3, $4) RETURNING id, content, owner',
            values: [id, threadId, content, owner],
        };

        const result = await pool.query(query);

        return new AddedComment({ ...result.rows[0] });
    }

    async getThreadDetails({ threadId }) {
        const threadQuery = {
            text: `	SELECT t.id, t.title, t.body, CAST(t.date AS VARCHAR) date, u.username
					FROM threads t
					JOIN users u ON t.owner = u.id
					WHERE t.id = $1`,
            values: [threadId],
        };

        const commentsQuery = {
            text: `	SELECT c.id, c.date, c.content, u.username
					FROM comments c
					JOIN users u ON c.owner = u.id
					JOIN threads t ON c.thread_id = t.id
					WHERE c.thread_id = $1`,
            values: [threadId],
        };

        const thread = await this._pool.query(threadQuery);
        const comments = await this._pool.query(commentsQuery);

        const result = { ...thread.rows[0], comments: comments.rows };

        return new ThreadDetails(result);
    }
}

module.exports = ThreadRepositoryPostgres;
