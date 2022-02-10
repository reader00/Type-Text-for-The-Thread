const InvariantError = require('../../../Commons/exceptions/InvariantError');
const DeleteReply = require('../../../Domains/threads/entities/DeleteReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
    /**
     * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
     */
    it('should orchestrating the delete reply action correctly', async () => {
        // Arrange
        const useCasePayload = {
            commentId: 'comment-123',
            replyId: 'reply-123',
            owner: 'user-123',
        };

        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();

        /** mocking needed function */
        mockThreadRepository.deleteReplyById = jest.fn().mockImplementation(() => Promise.resolve());
        mockThreadRepository.verifyReplyExist = jest.fn().mockImplementation(() => Promise.resolve());

        /** creating use case instance */
        const deleteReplyUseCase = new DeleteReplyUseCase({
            threadRepository: mockThreadRepository,
        });

        // Action and Assert
        await expect(deleteReplyUseCase.execute(useCasePayload)).resolves.not.toThrow(InvariantError);
        expect(mockThreadRepository.deleteReplyById).toBeCalledWith(
            new DeleteReply({
                commentId: 'comment-123',
                replyId: 'reply-123',
                owner: 'user-123',
            })
        );
        expect(mockThreadRepository.verifyReplyExist).toBeCalledWith({
            commentId: 'comment-123',
            replyId: 'reply-123',
        });
    });
});
