const AddReply = require('../../Domains/threads/reply/entities/AddReply');

class AddReplyUseCase {
    constructor({ replyRepository, commentRepository }) {
        this._replyRepository = replyRepository;
        this._commentRepository = commentRepository;
    }

    async execute(useCasePayload) {
        const addReply = new AddReply(useCasePayload);

        await this._commentRepository.verifyCommentExist(useCasePayload);

        return this._replyRepository.addReply(addReply);
    }
}

module.exports = AddReplyUseCase;
