/* eslint-disable no-tabs */
const ThreadRepository = require('../../Domains/threads/thread/ThreadRepository');
const AddedThread = require('../../Domains/threads/thread/entities/AddedThread');
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

        const result = await this._pool.query(query);

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

    async getThreadDetailById({ threadId }) {
        const query = {
            text: `	SELECT t.id, t.title, t.body, t.date, u.username
					FROM threads t
					JOIN users u ON t.owner = u.id
					WHERE t.id = $1`,
            values: [threadId],
        };

        const results = await this._pool.query(query);

        return results.rows[0];
    }
}

module.exports = ThreadRepositoryPostgres;
