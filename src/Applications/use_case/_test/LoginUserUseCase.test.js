const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const NewAuth = require('../../../Domains/authentications/entities/NewAuth');
const UserRepository = require('../../../Domains/users/UserRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const PasswordHash = require('../../security/PasswordHash');
const LoginUserUseCase = require('../LoginUserUseCase');

describe('LoginUserUseCase', () => {
    it('should orchestrating login user action correctly', async () => {
        // Arrange
        const useCasePayload = {
            username: 'dicoding',
            password: 'asdasd',
        };

        const expectedAuthentication = new NewAuth({
            accessToken: 'access_token',
            refreshToken: 'refresh_token',
        });

        // create mock object
        const mockUserRepository = new UserRepository();
        const mockAuthenticationRepository = new AuthenticationRepository();
        const mockAuthenticationTokenManager = new AuthenticationTokenManager();
        const mockPasswordHash = new PasswordHash();

        // mock method
        mockUserRepository.getPasswordByUsername = jest.fn(() => {
            return Promise.resolve('encrypted_password');
        });
        mockPasswordHash.comparePassword = jest.fn(() => {
            return Promise.resolve();
        });
        mockAuthenticationTokenManager.createAccessToken = jest.fn(() => {
            return Promise.resolve('access_token');
        });
        mockAuthenticationTokenManager.createRefreshToken = jest.fn(() => {
            return Promise.resolve('refresh_token');
        });
        mockAuthenticationRepository.addToken = jest.fn(() => {
            return Promise.resolve();
        });
        mockUserRepository.getIdByUsername = jest.fn(() => {
            return Promise.resolve('user-123');
        });

        // use case instance
        const loginUserUseCase = new LoginUserUseCase({
            userRepository: mockUserRepository,
            authenticationRepository: mockAuthenticationRepository,
            authenticationTokenManager: mockAuthenticationTokenManager,
            passwordHash: mockPasswordHash,
        });

        // Action
        const actualAuthentication = await loginUserUseCase.execute(useCasePayload);

        // Assert
        expect(actualAuthentication).toStrictEqual(expectedAuthentication);
        expect(mockUserRepository.getPasswordByUsername).toHaveBeenCalledWith('dicoding');
        expect(mockPasswordHash.comparePassword).toHaveBeenCalledWith('asdasd', 'encrypted_password');
        expect(mockAuthenticationTokenManager.createAccessToken).toHaveBeenCalledWith({
            username: 'dicoding',
            id: 'user-123',
        });
        expect(mockAuthenticationTokenManager.createRefreshToken).toHaveBeenCalledWith({
            username: 'dicoding',
            id: 'user-123',
        });
        expect(mockAuthenticationRepository.addToken).toHaveBeenCalledWith(
            expectedAuthentication.refreshToken
        );
    });
});
