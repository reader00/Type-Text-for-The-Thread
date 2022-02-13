const AddUserUseCase = require('../../../../Applications/use_case/AddUserUseCase');
const Handler = require('../Handler');

class UsersHandler extends Handler {
    async postUserHandler(request, h) {
        const addUserUseCase = this._container.getInstance(AddUserUseCase.name);
        const addedUser = await addUserUseCase.execute(request.payload);

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
