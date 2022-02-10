const InvariantError = require('../../../Commons/exceptions/InvariantError');
const DeleteComment = require('../../../Domains/threads/entities/DeleteComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
    /**
     * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
     */
    it('should orchestrating the delete comment action correctly', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            owner: 'user-123',
        };

        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();

        /** mocking needed function */
        mockThreadRepository.deleteCommentById = jest.fn().mockImplementation(() => Promise.resolve());
        mockThreadRepository.verifyCommentExist = jest.fn().mockImplementation(() => Promise.resolve());

        /** creating use case instance */
        const deleteCommentUseCase = new DeleteCommentUseCase({
            threadRepository: mockThreadRepository,
        });

        // Action and Assert
        await expect(deleteCommentUseCase.execute(useCasePayload)).resolves.not.toThrow(InvariantError);
        expect(mockThreadRepository.deleteCommentById).toBeCalledWith(
            new DeleteComment({
                threadId: 'thread-123',
                commentId: 'comment-123',
                owner: 'user-123',
            })
        );
        expect(mockThreadRepository.verifyCommentExist).toBeCalledWith({
            threadId: 'thread-123',
            commentId: 'comment-123',
        });
    });
});
