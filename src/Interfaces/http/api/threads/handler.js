const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const Handler = require('../Handler');
const GetThreadDetailsUseCase = require('../../../../Applications/use_case/GetThreadDetailsUseCase');

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

    async postCommentHandler(request, h) {
        const { content } = request.payload;
        const { id: owner } = request.auth.credentials;
        const { threadId } = request.params;

        const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
        const addedComment = await addCommentUseCase.execute({ content, owner, threadId });

        const response = h.response({
            status: 'success',
            data: {
                addedComment,
            },
        });

        response.code(201);
        return response;
    }

    async getThreadByIdHandler(requet, h) {
        const { threadId } = requet.params;
        const getThreadDetailsUseCase = this._container.getInstance(GetThreadDetailsUseCase.name);
        const thread = await getThreadDetailsUseCase.execute({ threadId });

        const response = h.response({
            status: 'success',
            data: {
                thread,
            },
        });

        response.code(201);
        return response;
    }
}

module.exports = ThreadsHandler;
