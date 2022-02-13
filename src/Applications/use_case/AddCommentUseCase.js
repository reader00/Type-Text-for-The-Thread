const AddComment = require('../../Domains/threads/comment/entities/AddComment');

class AddCommentUseCase {
    constructor({ commentRepository }) {
        this._commentRepository = commentRepository;
    }

    async execute(useCasePayload) {
        const addComment = new AddComment(useCasePayload);

        await this._commentRepository.verifyThreadExist(useCasePayload.threadId);

        return this._commentRepository.addComment(addComment);
    }
}

module.exports = AddCommentUseCase;
