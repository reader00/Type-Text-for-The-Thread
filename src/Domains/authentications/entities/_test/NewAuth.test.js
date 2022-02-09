const NewAuth = require('../NewAuth');

describe('NewAuth entity', () => {
    it('should throw error when payload not contain needed property', () => {
        // Arrange
        const authPayload = {
            accessToken: 'asd',
        };

        // Action and Assert
        expect(() => new NewAuth(authPayload)).toThrowError('NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload not meet data type specification', () => {
        // Arrange
        const authPayload = {
            accessToken: 'asd',
            refreshToken: [false],
        };

        // Action and Assert
        expect(() => new NewAuth(authPayload)).toThrowError('NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
});
