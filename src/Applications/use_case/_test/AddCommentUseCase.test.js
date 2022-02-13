const AddedComment = require('../../../Domains/threads/comment/entities/AddedComment');
const AddComment = require('../../../Domains/threads/comment/entities/AddComment');
const CommentRepository = require('../../../Domains/threads/comment/CommentRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
    /**
     * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
     */
    it('should orchestrating the add comment action correctly', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
            content: 'Tentang cerita dulu',
            owner: 'user-123',
        };

        const expectedAddedThread = new AddedComment({
            id: 'comment-123',
            content: 'Tentang cerita dulu',
            owner: 'user-123',
        });

        /** creating dependency of use case */
        const mockCommentRepository = new CommentRepository();

        /** mocking needed function */
        mockCommentRepository.addComment = jest
            .fn()
            .mockImplementation(() => Promise.resolve(expectedAddedThread));
        mockCommentRepository.verifyThreadExist = jest.fn().mockImplementation(() => Promise.resolve());

        /** creating use case instance */
        const addCommentUseCase = new AddCommentUseCase({
            commentRepository: mockCommentRepository,
        });

        // Action
        const addedThread = await addCommentUseCase.execute(useCasePayload);

        // Assert
        expect(addedThread).toStrictEqual(expectedAddedThread);
        expect(mockCommentRepository.addComment).toBeCalledWith(
            new AddComment({
                threadId: 'thread-123',
                content: 'Tentang cerita dulu',
                owner: 'user-123',
            })
        );
        expect(mockCommentRepository.verifyThreadExist).toBeCalledWith('thread-123');
    });
});
