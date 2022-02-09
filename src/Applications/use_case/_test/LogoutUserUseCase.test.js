const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const LogoutUserUseCase = require('../LogoutUserUseCase');

describe('LogoutUserUseCase', () => {
    it('should throw error if use case payload not contain refresh token', async () => {
        // Arrange
        const useCasePayload = {};
        const logoutUserUseCase = new LogoutUserUseCase({});

        // Action and Assert
        await expect(logoutUserUseCase.execute(useCasePayload)).rejects.toThrowError(
            'LOGOUT_USER_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN'
        );
    });

    it('should throw error if refresh token not string', async () => {
        // Arrange
        const useCasePayload = {
            refreshToken: [],
        };
        const logoutUserUseCase = new LogoutUserUseCase({});

        // Action and Assert
        await expect(logoutUserUseCase.execute(useCasePayload)).rejects.toThrowError(
            'LOGOUT_USER_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION'
        );
    });

    it('should orchestrating logout user action correctly', async () => {
        // Arrange
        const useCasePayload = {
            refreshToken: 'refresh_token',
        };
        const mockAuthenticationRepository = new AuthenticationRepository();

        mockAuthenticationRepository.checkAvailabilityToken = jest
            .fn()
            .mockImplementation(() => Promise.resolve());

        mockAuthenticationRepository.deleteToken = jest.fn().mockImplementation(() => Promise.resolve());

        const logoutUserUseCase = new LogoutUserUseCase(mockAuthenticationRepository);

        // Action
        await logoutUserUseCase.execute(useCasePayload);

        // Assert
        expect(mockAuthenticationRepository.checkAvailabilityToken).toBeCalledWith('refresh_token');
        expect(mockAuthenticationRepository.deleteToken).toBeCalledWith('refresh_token');
    });
});
