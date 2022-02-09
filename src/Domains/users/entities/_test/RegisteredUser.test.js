const RegisteredUser = require('../RegisteredUser');

describe('a RegisteredUser entities', () => {
    it('should  throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            username: 'dicoding',
            fullname: 'Dicoding Indonesia',
        };

        // Action and Assert
        expect(() => new RegisteredUser(payload)).toThrowError('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type spcification', () => {
        // Arrange
        const payload = {
            id: true,
            username: 123,
            fullname: [],
        };

        // Action and Assert
        expect(() => new RegisteredUser(payload)).toThrowError(
            'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION'
        );
    });

    it('should create registeredUser object correctly', () => {
        // Arrange
        const payload = {
            id: 'user-123',
            username: 'dicoding',
            fullname: 'Dicoding Indonesia',
        };

        // Action
        const registeredUser = new RegisteredUser(payload);

        // Assert
        expect(registeredUser.id).toBe(payload.id);
        expect(registeredUser.username).toBe(payload.username);
        expect(registeredUser.fullname).toBe(payload.fullname);
    });
});
