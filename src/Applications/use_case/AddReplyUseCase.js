const AddReply = require('../../Domains/threads/reply/entities/AddReply');

class AddReplyUseCase {
    constructor({ threadRepository }) {
        this._threadRepository = threadRepository;
    }

    async execute(useCasePayload) {
        const addReply = new AddReply(useCasePayload);

        await this._threadRepository.verifyCommentExist({
            threadId: useCasePayload.threadId,
            commentId: useCasePayload.commentId,
        });

        return this._threadRepository.addReply(addReply);
    }
}

module.exports = AddReplyUseCase;
