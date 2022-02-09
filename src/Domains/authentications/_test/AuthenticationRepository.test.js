const AuthenticationRepository = require('../AuthenticationRepository');

describe('UserRepository Interface', () => {
    it('should throw error when invoke abstract behavior', async () => {
        // Arrange
        const userRepository = new AuthenticationRepository({});

        // Action and Assert
        await expect(userRepository.addToken({})).rejects.toThrowError(
            'AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED'
        );

        await expect(userRepository.checkAvailabilityToken('')).rejects.toThrowError(
            'AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED'
        );

        await expect(userRepository.deleteToken('')).rejects.toThrowError(
            'AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED'
        );
    });
});
