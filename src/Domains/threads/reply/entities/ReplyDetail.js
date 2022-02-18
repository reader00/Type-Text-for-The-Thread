class ReplyDetail {
    constructor(payload) {
        this._verifyPayload(payload);

        const { id, content, date, username, is_deleted: isDeleted } = payload;

        this.id = id;
        this.content = isDeleted ? '**balasan telah dihapus**' : content;
        this.date = date.toISOString();
        this.username = username;
    }

    _verifyPayload({ id, content, date, username, is_deleted: isDeleted }) {
        if (!id || !content || !date || !username) {
            throw new Error('REPLY_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (
            typeof id !== 'string' ||
            typeof content !== 'string' ||
            !(date instanceof Date) ||
            typeof username !== 'string' ||
            typeof isDeleted !== 'boolean'
        ) {
            throw new Error('REPLY_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = ReplyDetail;
