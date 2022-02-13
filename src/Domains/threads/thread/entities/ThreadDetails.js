class ThreadDetails {
    constructor(payload) {
        this._verifyPayload(payload);

        this.id = payload.id;
        this.title = payload.title;
        this.body = payload.body;
        this.date = payload.date;
        this.username = payload.username;
    }

    _verifyPayload({ id, title, body, date, username }) {
        if (!id || !title || !body || !date || !username) {
            throw new Error('THREAD_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (
            typeof id !== 'string' ||
            typeof title !== 'string' ||
            typeof body !== 'string' ||
            typeof date !== 'string' ||
            typeof username !== 'string'
        ) {
            throw new Error('THREAD_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = ThreadDetails;
