const AuthenticationError = require('../AuthenticationError');

describe('AuthenticationError', () => {
    it('should create AuthenticationError correctly', () => {
        const authenticationError = new AuthenticationError('an error occurs');

        expect(authenticationError.statusCode).toEqual(401);
        expect(authenticationError.message).toEqual('an error occurs');
        expect(authenticationError.name).toEqual('AuthenticationError');
    });
});
