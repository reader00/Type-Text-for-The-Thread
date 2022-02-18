class CommentDetail {
    constructor(payload) {
        this._verifyPayload(payload);

        const {
            id,
            content,
            date,
            username,
            is_deleted: isDeleted,
            replies,
            likeCount,
        } = payload;

        this.id = id;
        this.content = isDeleted ? '**komentar telah dihapus**' : content;
        this.date = date.toISOString();
        this.username = username;
        this.replies = replies;
        this.likeCount = parseInt(likeCount, 10);
    }

    _verifyPayload({
        id,
        content,
        date,
        username,
        is_deleted: isDeleted,
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
            throw new Error('COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (
            typeof id !== 'string' ||
            typeof content !== 'string' ||
            !(date instanceof Date) ||
            typeof username !== 'string' ||
            typeof isDeleted !== 'boolean' ||
            Number.isNaN(likeCount) ||
            !(replies instanceof Array)
        ) {
            throw new Error('COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = CommentDetail;
