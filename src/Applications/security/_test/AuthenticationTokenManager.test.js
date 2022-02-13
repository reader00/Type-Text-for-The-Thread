const AuthenticationTokenManager = require('../AuthenticationTokenManager');

describe('AuthenticationTokenManager', () => {
    it('should throw error when invoke unimplemented method', () => {
        // Arrange
        const tokenManager = new AuthenticationTokenManager({});

        // Action and Assert
        expect(tokenManager.createAccessToken('')).rejects.toThrowError(
            'AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED',
        );

        expect(tokenManager.createRefreshToken('')).rejects.toThrowError(
            'AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED',
        );

        expect(tokenManager.verifyRefreshToken('')).rejects.toThrowError(
            'AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED',
        );

        expect(tokenManager.decodePayload('')).rejects.toThrowError(
            'AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED',
        );
    });
});
