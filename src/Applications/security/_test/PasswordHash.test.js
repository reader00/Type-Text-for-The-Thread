const PasswordHash = require('../PasswordHash');

describe('PasswordHash interface', () => {
    it('should throw error when invoke abstract behavior', async () => {
        // Arrange
        const passwordHash = new PasswordHash();

        // Action and Assert
        await expect(passwordHash.hash('asd')).rejects.toThrowError('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
        await expect(passwordHash.comparePassword('asd')).rejects.toThrowError(
            'PASSWORD_HASH.METHOD_NOT_IMPLEMENTED'
        );
    });
});
