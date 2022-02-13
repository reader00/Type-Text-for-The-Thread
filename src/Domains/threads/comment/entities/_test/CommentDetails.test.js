const CommentDetails = require('../CommentDetails');

describe('a CommentDetails entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            id: 'comment-123',
        };

        // Action and Assert
        expect(() => new CommentDetails(payload)).toThrowError('COMMENT_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 123,
            content: 'Tentang cerita dulu',
            date: '2021-08-08T07:19:09.775Z',
            username: [],
            is_deleted: '',
            replies: {},
        };

        // Action and Assert
        expect(() => new CommentDetails(payload)).toThrowError(
            'COMMENT_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION'
        );
    });

    it('should create CommentDetails object correctly', () => {
        // Arrange
        const payload = {
            id: 'comment-123',
            content: 'Tentang cerita dulu',
            date: '2021-08-08T07:19:09.775Z',
            username: 'dicoding',
            is_deleted: 0,
            replies: [],
        };

        // Action
        const { id, content, date, username, replies } = new CommentDetails(payload);

        // Assert
        expect(id).toEqual('reply-123');
        expect(content).toEqual('Tentang cerita dulu');
        expect(date).toEqual('2021-08-08T07:19:09.775Z');
        expect(username).toEqual('dicoding');
        expect(replies).toStrictEqual([]);
    });

    it('should create CommentDetails object when the content is deleted correctly', () => {
        // Arrange
        const payload = {
            id: 'comment-123',
            content: 'Tentang cerita dulu',
            date: '2021-08-08T07:19:09.775Z',
            username: 'dicoding',
            is_deleted: 1,
            replies: [],
        };

        // Action
        const { id, content, date, username, replies } = new CommentDetails(payload);

        // Assert
        expect(id).toEqual('comment-123');
        expect(content).toEqual('**komentar telah dihapus**');
        expect(date).toEqual(payload.date);
        expect(username).toEqual(payload.username);
        expect(replies).toStrictEqual(payload.replies);
    });
});
