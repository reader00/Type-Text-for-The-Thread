const AddReply = require('../AddReply');

describe('an AddReply entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            content: 'Hai, apa kabar',
            owner: 'user-123',
        };

        // Action and Assert
        expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            commentId: ['comment-123'],
            content: 123,
            owner: 'user-123',
        };

        // Action and Assert
        expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create addReply object correctly', () => {
        // Arrange
        const payload = {
            commentId: 'reply-123',
            content: 'Hai, apa kabar',
            owner: 'user-123',
        };

        // Action
        const { content } = new AddReply(payload);

        // Assert
        expect(content).toEqual(payload.content);
    });
});
