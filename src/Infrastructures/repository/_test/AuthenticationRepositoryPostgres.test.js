const AuthenticationTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const pool = require('../../database/postgres/pool');
const AuthenticationRepositoryPostgres = require('../AuthenticationRepositoryPostgres');

describe('AuthenticationRepositoryPostgres', () => {
    afterEach(async () => {
        await AuthenticationTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('addToken function', () => {
        it('should add token to database', async () => {
            // Arrange
            const token = 'refresh_token';
            const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool);

            // Action
            await authenticationRepositoryPostgres.addToken(token);

            // Assert
            const expectedTokens = await AuthenticationTableTestHelper.findToken(token);

            expect(expectedTokens).toHaveLength(1);
            expect(expectedTokens[0].token).toEqual(token);
        });
    });

    describe('checkAvailabilityToken function', () => {
        it('should throw error when token not available', async () => {
            // Arrange
            const token = 'refresh_token';
            const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool);

            // Action and Assert
            await expect(authenticationRepositoryPostgres.checkAvailabilityToken(token)).rejects.toThrow(
                InvariantError,
            );
        });

        it('should not throw error when token available', async () => {
            // Arrange
            const token = 'refresh_token';
            const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool);

            await AuthenticationTableTestHelper.addToken(token);

            // Action and Assert
            await expect(authenticationRepositoryPostgres.checkAvailabilityToken(token)).resolves.not.toThrow(
                InvariantError,
            );
        });
    });

    describe('deleteToken function', () => {
        it('should delete token from database', async () => {
            // Arrange
            const token = 'refresh_token';
            const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool);

            await AuthenticationTableTestHelper.addToken(token);

            // Action
            await authenticationRepositoryPostgres.deleteToken(token);

            // Assert
            const expectedTokens = await AuthenticationTableTestHelper.findToken(token);

            expect(expectedTokens).toHaveLength(0);
        });
    });
});
