/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
    async addThread({
        id = 'thread-123',
        title = 'Di atas Awan',
        body = 'Ku ingin terbang',
        owner = 'user-123',
    }) {
        const query = {
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id',
            values: [id, title, body, owner],
        };

        const results = await pool.query(query);
        return results.rows[0].id;
    },

    async addComment({
        id = 'comment-123',
        threadId = 'thread-123',
        content = 'Tentang cerita dulu',
        owner = 'user-123',
    }) {
        const query = {
            text: 'INSERT INTO comments(id, thread_id, content, owner) VALUES($1, $2, $3, $4) RETURNING id',
            values: [id, threadId, content, owner],
        };

        const results = await pool.query(query);
        return results.rows[0].id;
    },

    async deleteComment({ id = 'comment-123', owner = 'user-123' }) {
        const query = {
            text: `UPDATE comments SET is_deleted = 1 WHERE id = $1 AND owner = $2 RETURNING id`,
            values: [id, owner],
        };

        await pool.query(query);
    },

    async findThreadById(id) {
        const query = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows;
    },

    async findCommentById(id) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows;
    },

    async cleanTable() {
        await pool.query('DELETE FROM threads');
        await pool.query('DELETE FROM comments');
    },
};

module.exports = ThreadsTableTestHelper;
