const AddUserUseCase = require('../../../../Applications/use_case/AdduserUseCase');
const Handler = require('../Handler');

class UsersHandler extends Handler {
    async postUserHandler(request, h) {
        const adduserUseCase = this._container.getInstance(AddUserUseCase.name);
        const addedUser = await adduserUseCase.execute(request.payload);

        const response = h.response({
            status: 'success',
            data: {
                addedUser,
            },
        });

        response.code(201);
        return response;
    }
}

module.exports = UsersHandler;
