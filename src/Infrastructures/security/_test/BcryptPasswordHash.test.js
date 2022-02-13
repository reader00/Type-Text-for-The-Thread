const bcrypt = require('bcrypt');
const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError');
const BcryptPasswordHash = require('../BcryptPasswordHash');

describe('BcyptPasswordHash', () => {
    describe('hash function', () => {
        it('should encrypt password correctly', async () => {
            // Arrange
            const spyHash = jest.spyOn(bcrypt, 'hash');
            const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

            // Action
            const encryptedPassword = await bcryptPasswordHash.hash('plain_password');

            // Assert
            expect(typeof encryptedPassword).toEqual('string');
            expect(encryptedPassword).not.toEqual('plain_password');
            expect(spyHash).toBeCalledWith('plain_password', 10);
        });
    });

    describe('comparePassword function', () => {
        it('should return AuthenticationError if password not valid', async () => {
            // Arrange
            const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

            const encryptedPassword = await bcryptPasswordHash.hash('plain_password');

            // Action and Assert
            await expect(
                bcryptPasswordHash.comparePassword('wrong_password', encryptedPassword),
            ).rejects.toThrow(AuthenticationError);
        });

        it('should not return AuthenticationError if password valid', async () => {
            // Arrange
            const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

            const encryptedPassword = await bcryptPasswordHash.hash('plain_password');

            // Action and Assert
            await expect(
                bcryptPasswordHash.comparePassword('plain_password', encryptedPassword),
            ).resolves.not.toThrow(AuthenticationError);
        });
    });
});
