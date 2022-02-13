const RegisterUser = require('../RegisterUser');

describe('a RegisterUser entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            username: 'abc',
            password: '123',
        };

        // Action and Assert
        expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            username: 123,
            password: true,
            fullname: 'abc',
        };

        // Action and Assert
        expect(() => new RegisterUser(payload)).toThrowError(
            'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION',
        );
    });

    it('should throw error when username contains more than 50 characters', () => {
        // Arrange
        const payload = {
            username: 'asjdjnasdbasudbasubdoasbdosabdoabdoiabdodoasdiosadoasdoasbdoasbdouboabdobdo',
            password: 'asd',
            fullname: 'asd',
        };

        // Action and Assert
        expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.USERNAME_LIMIT_CHAR');
    });

    it('should throw error when username contains restricted character', () => {
        // Arrange
        const payload = {
            username: 'dico ding',
            password: 'asd',
            fullname: 'asd',
        };

        // Action and Assert
        expect(() => new RegisterUser(payload)).toThrowError(
            'REGISTER_USER.USERNAME_CONTAINS_RESTRICTED_CHARACTER',
        );
    });

    it('should create registerUser object correctly', () => {
        // Arrange
        const payload = {
            username: 'dicoding',
            password: '123',
            fullname: 'Dicoding Indonesia',
        };

        // Action
        const { username, fullname, password } = new RegisterUser(payload);

        // Assert
        expect(username).toBe(payload.username);
        expect(fullname).toBe(payload.fullname);
        expect(password).toBe(payload.password);
    });
});
