/* eslint-disable camelcase */
class CommentDetail {
    constructor(payload) {
        this._verifyPayload(payload);

        const { id, content, date, username, is_deleted, replies, likeCount } =
            payload;

        this.id = id;
        this.content = is_deleted ? '**komentar telah dihapus**' : content;
        this.date = date;
        this.username = username;
        this.replies = replies;
        this.likeCount = likeCount;
    }

    _verifyPayload({
        id,
        content,
        date,
        username,
        is_deleted,
        replies,
        likeCount,
    }) {
        if (
            !id ||
            !content ||
            !date ||
            !username ||
            !replies ||
            likeCount === undefined ||
            likeCount === null
        ) {
            throw new Error('COMMENT_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (
            typeof id !== 'string' ||
            typeof content !== 'string' ||
            typeof date !== 'string' ||
            typeof username !== 'string' ||
            typeof is_deleted !== 'boolean' ||
            typeof likeCount !== 'number' ||
            !(replies instanceof Array)
        ) {
            throw new Error('COMMENT_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = CommentDetail;
