const CommentDetails = require('../../Domains/threads/comment/entities/CommentDetails');
const GetThreadDetails = require('../../Domains/threads/thread/entities/GetThreadDetails');
const ThreadDetails = require('../../Domains/threads/thread/entities/ThreadDetails');

class GetThreadDetailsUseCase {
    constructor({ threadRepository }) {
        this._threadRepository = threadRepository;
    }

    async execute(useCasePayload) {
        const getThreadDetails = new GetThreadDetails(useCasePayload);

        await this._threadRepository.verifyThreadExist(useCasePayload.threadId);

        const thread = await this._threadRepository.getThreadDetailsById(getThreadDetails);
        const threadComments = await this._threadRepository.getThreadCommentsById(getThreadDetails);

        for (let i = 0; i < threadComments.length; i++) {
            const commentReplies = await this._threadRepository.getCommentRepliesById({
                commentId: threadComments[i].id,
            });
            threadComments[i].replies = commentReplies;

            const comment = threadComments[i];
            new CommentDetails(comment);
        }

        return new ThreadDetails({
            ...thread,
            comments: threadComments,
        });
    }
}

module.exports = GetThreadDetailsUseCase;
