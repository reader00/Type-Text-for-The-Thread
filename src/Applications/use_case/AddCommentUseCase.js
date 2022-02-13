const AddComment = require('../../Domains/threads/comment/entities/AddComment');

class AddCommentUseCase {
    constructor({ threadRepository }) {
        this._threadRepository = threadRepository;
    }

    async execute(useCasePayload) {
        const addComment = new AddComment(useCasePayload);

        await this._threadRepository.verifyThreadExist(useCasePayload.threadId);

        return this._threadRepository.addComment(addComment);
    }
}

module.exports = AddCommentUseCase;
