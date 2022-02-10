const AddedComment = require('../../../Domains/threads/entities/AddedComment');
const AddComment = require('../../../Domains/threads/entities/AddComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
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
        const mockThreadRepository = new ThreadRepository();

        /** mocking needed function */
        mockThreadRepository.addComment = jest
            .fn()
            .mockImplementation(() => Promise.resolve(expectedAddedThread));
        mockThreadRepository.verifyThreadExist = jest.fn().mockImplementation(() => Promise.resolve());

        /** creating use case instance */
        const getCommentUseCase = new AddCommentUseCase({
            threadRepository: mockThreadRepository,
        });

        // Action
        const addedThread = await getCommentUseCase.execute(useCasePayload);

        // Assert
        expect(addedThread).toStrictEqual(expectedAddedThread);
        expect(mockThreadRepository.addComment).toBeCalledWith(
            new AddComment({
                threadId: 'thread-123',
                content: 'Tentang cerita dulu',
                owner: 'user-123',
            })
        );
    });
});
