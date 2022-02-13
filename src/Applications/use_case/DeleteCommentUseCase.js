const DeleteComment = require('../../Domains/threads/comment/entities/DeleteComment');

class DeleteCommentUseCase {
    constructor({ threadRepository }) {
        this._threadRepository = threadRepository;
    }

    async execute(useCasePayload) {
        const deleteComment = new DeleteComment(useCasePayload);

        await this._threadRepository.verifyCommentExist({
            threadId: useCasePayload.threadId,
            commentId: useCasePayload.commentId,
        });

        return this._threadRepository.deleteCommentById(deleteComment);
    }
}

module.exports = DeleteCommentUseCase;
