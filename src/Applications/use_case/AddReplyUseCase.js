const AddReply = require('../../Domains/threads/reply/entities/AddReply');

class AddReplyUseCase {
    constructor({ replyRepository }) {
        this._replyRepository = replyRepository;
    }

    async execute(useCasePayload) {
        const addReply = new AddReply(useCasePayload);

        await this._replyRepository.verifyCommentExist({
            threadId: useCasePayload.threadId,
            commentId: useCasePayload.commentId,
        });

        return this._replyRepository.addReply(addReply);
    }
}

module.exports = AddReplyUseCase;
