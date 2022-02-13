const LoginUserUseCase = require('../../../../Applications/use_case/LoginUserUseCase');
const LogoutUserUseCase = require('../../../../Applications/use_case/LogoutUserUseCase');
const RefreshAuthenticationUseCase = require('../../../../Applications/use_case/RefreshAuthenticationUseCase');
const Handler = require('../Handler');

class AuthenticationsHandler extends Handler {
    async postAuthenticationHandler(request, h) {
        const loginUserUseCase = this._container.getInstance(
            LoginUserUseCase.name,
        );

        const { accessToken, refreshToken } = await loginUserUseCase.execute(
            request.payload,
        );

        const response = h.response({
            status: 'success',
            message: 'berhasil login',
            data: {
                accessToken,
                refreshToken,
            },
        });

        response.code(201);
        return response;
    }

    async putAuthenticationHandler(request, h) {
        const refreshAuthenticationUseCase = this._container.getInstance(
            RefreshAuthenticationUseCase.name,
        );

        const accessToken = await refreshAuthenticationUseCase.execute(
            request.payload,
        );

        const response = h.response({
            status: 'success',
            message: 'berhasil memperbarui access token',
            data: {
                accessToken,
            },
        });

        response.code(200);
        return response;
    }

    async deleteAuthenticationHandler(request, h) {
        const logoutUserUseCase = this._container.getInstance(
            LogoutUserUseCase.name,
        );

        await logoutUserUseCase.execute(request.payload);

        const response = h.response({
            status: 'success',
            message: 'berhasil logout',
        });

        response.code(200);
        return response;
    }
}

module.exports = AuthenticationsHandler;
