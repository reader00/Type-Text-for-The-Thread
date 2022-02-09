const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const RefreshAuthenticationUseCase = require('../RefreshAuthenticationUseCase');

describe('RefreshAuthenticationUseCase', () => {
    it('should throw error if use case payload not contain refresh token', async () => {
        // Arrange
        const useCasePayload = {};
        const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({});

        // Action and Assert
        await expect(refreshAuthenticationUseCase.execute(useCasePayload)).rejects.toThrowError(
            'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN'
        );
    });

    it('should throw error if refresh token not string', async () => {
        // Arrange
        const useCasePayload = {
            refreshToken: [],
        };
        const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({});

        // Action and Assert
        await expect(refreshAuthenticationUseCase.execute(useCasePayload)).rejects.toThrowError(
            'REFRESH_AUTHENTICATION_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION'
        );
    });

    it('should orchestrating refresh authentication action correctly', async () => {
        // Arrange
        const useCasePayload = {
            refreshToken: 'refresh_token',
        };
        const mockAuthenticationRepository = new AuthenticationRepository();
        const mockAuthenticationTokenManager = new AuthenticationTokenManager();

        mockAuthenticationRepository.checkAvailabilityToken = jest
            .fn()
            .mockImplementation(() => Promise.resolve());
        mockAuthenticationTokenManager.verifyRefreshToken = jest
            .fn()
            .mockImplementation(() => Promise.resolve());
        mockAuthenticationTokenManager.decodePayload = jest.fn().mockImplementation(() =>
            Promise.resolve({
                id: 'user-123',
                username: 'dicoding',
            })
        );
        mockAuthenticationTokenManager.createAccessToken = jest
            .fn()
            .mockImplementation(() => Promise.resolve('access_token'));

        const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({
            authenticationRepository: mockAuthenticationRepository,
            authenticationTokenManager: mockAuthenticationTokenManager,
        });

        // Action
        const accessToken = await refreshAuthenticationUseCase.execute(useCasePayload);

        // Assert
        expect(mockAuthenticationTokenManager.verifyRefreshToken).toBeCalledWith(useCasePayload.refreshToken);
        expect(mockAuthenticationRepository.checkAvailabilityToken).toBeCalledWith(
            useCasePayload.refreshToken
        );
        expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(useCasePayload.refreshToken);
        expect(mockAuthenticationTokenManager.createAccessToken).toBeCalledWith({
            id: 'user-123',
            username: 'dicoding',
        });
        expect(accessToken).toEqual('access_token');
    });
});
