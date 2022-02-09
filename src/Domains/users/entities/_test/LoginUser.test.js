const LoginUser = require('../LoginUser');

describe('a LoginUser entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            username: 'abc',
            fullname: '123',
        };

        // Action and Assert
        expect(() => new LoginUser(payload)).toThrowError('LOGIN_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            username: 123,
            password: true,
        };

        // Action and Assert
        expect(() => new LoginUser(payload)).toThrowError('LOGIN_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should return LoginUser object correctly', () => {
        // Arrange
        const payload = {
            username: 'dicoding',
            password: '123',
        };

        // Action
        const { username, password } = new LoginUser(payload);

        // Assert
        expect(username).toBe(payload.username);
        expect(password).toBe(payload.password);
    });
});
