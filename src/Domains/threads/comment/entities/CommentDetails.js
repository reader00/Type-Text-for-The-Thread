const ReplyDetails = require('../../reply/entities/ReplyDetails');

class CommentDetails {
    constructor(payload) {
        this._verifyPayload(payload);

        this.id = payload.id;
        this.content = payload.content;
        this.date = payload.date;
        this.username = payload.username;
        this.replies = payload.replies;
    }

    _verifyPayload({ id, content, date, username, replies }) {
        if (!id || !content || !date || !username || !replies) {
            throw new Error('COMMENT_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (
            typeof id !== 'string' ||
            typeof content !== 'string' ||
            typeof date !== 'string' ||
            typeof username !== 'string' ||
            !(replies instanceof Array)
        ) {
            throw new Error('COMMENT_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = CommentDetails;
