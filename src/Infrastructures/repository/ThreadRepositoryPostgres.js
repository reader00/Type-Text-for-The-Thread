const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const pool = require('../database/postgres/pool');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const AddedComment = require('../../Domains/threads/entities/AddedComment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

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
}

module.exports = ThreadRepositoryPostgres;
