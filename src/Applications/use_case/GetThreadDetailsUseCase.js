/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
const CommentDetail = require('../../Domains/threads/comment/entities/CommentDetail');
const ReplyDetail = require('../../Domains/threads/reply/entities/ReplyDetail');
const GetThreadDetails = require('../../Domains/threads/thread/entities/GetThreadDetails');
const ThreadDetails = require('../../Domains/threads/thread/entities/ThreadDetails');

class GetThreadDetailsUseCase {
    constructor({
        threadRepository,
        commentRepository,
        replyRepository,
        likeRepository,
    }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._replyRepository = replyRepository;
        this._likeRepository = likeRepository;
    }

    async execute(useCasePayload) {
        const getThreadDetails = new GetThreadDetails(useCasePayload);

        await this._threadRepository.verifyThreadExist(useCasePayload.threadId);

        const threadDetails = await this._threadRepository.getThreadDetailsById(
            getThreadDetails,
        );
        const threadComments =
            await this._commentRepository.getCommentsByThreadId(
                getThreadDetails,
            );
        const threadReplies = await this._replyRepository.getRepliesByThreadId(
            getThreadDetails,
        );
        const likeCounts = await this._likeRepository.getLikeCountsByThreadId(
            getThreadDetails,
        );
        threadDetails.comments = this._getCommentAndReplies(
            threadComments,
            threadReplies,
            likeCounts,
        );

        return new ThreadDetails(threadDetails);
    }

    _getCommentAndReplies(comments, replies, likeCounts) {
        return comments.map((comment) => {
            // eslint-disable-next-line prefer-destructuring
            const like = likeCounts.filter(
                (likeCount) => likeCount.comment_id === comment.id,
            );
            comment.likeCount = like.length > 0 ? like[0].like_count : 0;
            comment.replies = replies
                .filter((reply) => reply.comment_id === comment.id)
                .map(
                    (reply) =>
                        // eslint-disable-next-line implicit-arrow-linebreak
                        new ReplyDetail({
                            ...reply,
                            date: reply.date.toString(),
                        }),
                );

            return new CommentDetail({
                ...comment,
                date: comment.date.toString(),
            });
        });
    }
}

module.exports = GetThreadDetailsUseCase;
