const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const Handler = require('../Handler');

class ThreadsHandler extends Handler {
    async postThreadHandler(request, h) {
        const { id: owner } = request.auth.credentials;

        const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
        const addedThread = await addThreadUseCase.execute({ ...request.payload, owner });

        const response = h.response({
            status: 'success',
            data: {
                addedThread,
            },
        });

        response.code(201);
        return response;
    }
}

module.exports = ThreadsHandler;
