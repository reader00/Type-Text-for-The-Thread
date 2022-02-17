const GetThreadDetail = require('../GetThreadDetail');

describe('a GetThreadDetail entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Action and Assert
        expect(() => new GetThreadDetail({})).toThrowError(
            'GET_THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY',
        );
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            threadId: 123,
        };

        // Action and Assert
        expect(() => new GetThreadDetail(payload)).toThrowError(
            'GET_THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION',
        );
    });

    it('should create GetThreadDetail object correctly', () => {
        // Arrange
        const payload = {
            threadId: 'thread-123',
        };

        // Action
        const { threadId } = new GetThreadDetail(payload);

        // Assert
        expect(threadId).toEqual(payload.threadId);
    });
});
