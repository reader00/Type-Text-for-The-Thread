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
            text: 'INSERT INTO threads(id, title, body, owner, date) VALUES($1, $2, $3, $4, $5) RETURNING id',
            values: [id, title, body, owner, new Date().toISOString()],
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
            text: 'INSERT INTO comments(id, thread_id, content, owner, date) VALUES($1, $2, $3, $4, $5) RETURNING id',
            values: [id, threadId, content, owner, new Date().toISOString()],
        };

        const results = await pool.query(query);
        return results.rows[0].id;
    },

    async addReply({
        id = 'reply-123',
        commentId = 'comment-123',
        content = 'Hai, apa kabar',
        owner = 'user-123',
    }) {
        const query = {
            text: 'INSERT INTO replies(id, comment_id, content, owner, date) VALUES($1, $2, $3, $4, $5) RETURNING id',
            values: [id, commentId, content, owner, new Date().toISOString()],
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

    async deleteReply({ id = 'reply-123', owner = 'user-123' }) {
        const query = {
            text: `UPDATE replies SET is_deleted = 1 WHERE id = $1 AND owner = $2 RETURNING id`,
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

    async findReplyById(id) {
        const query = {
            text: 'SELECT * FROM replies WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows;
    },

    async cleanTable() {
        await pool.query('DELETE FROM threads');
        await pool.query('DELETE FROM comments');
        await pool.query('DELETE FROM replies');
    },
};

module.exports = ThreadsTableTestHelper;
