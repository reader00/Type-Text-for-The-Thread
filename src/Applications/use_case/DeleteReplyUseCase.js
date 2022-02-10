const DeleteReply = require('../../Domains/threads/entities/DeleteReply');

class DeleteReplyUseCase {
    constructor({ threadRepository }) {
        this._threadRepository = threadRepository;
    }

    async execute(useCasePayload) {
        const deleteReply = new DeleteReply(useCasePayload);

        await this._threadRepository.verifyReplyExist({
            commentId: useCasePayload.commentId,
            replyId: useCasePayload.replyId,
        });

        return this._threadRepository.deleteReplyById(deleteReply);
    }
}

module.exports = DeleteReplyUseCase;
