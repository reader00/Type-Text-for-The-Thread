/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('replies', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        comment_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        content: {
            type: 'VARCHAR(512)',
            notNull: true,
        },
        owner: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        date: {
            type: 'TIMESTAMP',
            notNull: true,
        },
        is_deleted: {
            type: 'INTEGER',
            default: 0,
        },
    });

    pgm.addConstraint(
        'replies',
        'fk_replies.comment_id_comments.id',
        'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE'
    );
    pgm.addConstraint(
        'replies',
        'fk_replies.user_id_users.id',
        'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE'
    );
};

exports.down = (pgm) => {
    pgm.dropTable('replies');
};
