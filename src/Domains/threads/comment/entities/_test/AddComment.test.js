const AddComment = require('../AddComment');

describe('an AddComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            content: 'Tentang cerita dulu',
            owner: 'user-123',
        };

        // Action and Assert
        expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            threadId: ['thread-123'],
            content: 123,
            owner: 'user-123',
        };

        // Action and Assert
        expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create addComment object correctly', () => {
        // Arrange
        const payload = {
            threadId: 'thread-123',
            content: 'Tentang cerita dulu',
            owner: 'user-123',
        };

        // Action
        const { content } = new AddComment(payload);

        // Assert
        expect(content).toEqual(payload.content);
    });
});
