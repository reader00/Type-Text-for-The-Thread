const AddedReply = require('../../../Domains/threads/entities/AddedReply');
const AddReply = require('../../../Domains/threads/entities/AddReply');
const ThreadRepository = require('../../../Domains/threads/thread/ThreadRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
    /**
     * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
     */
    it('should orchestrating the add reply action correctly', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            content: 'Tentang cerita dulu',
            owner: 'user-123',
        };

        const expectedAddedReply = new AddedReply({
            id: 'reply-123',
            content: 'Tentang cerita dulu',
            owner: 'user-123',
        });

        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();

        /** mocking needed function */
        mockThreadRepository.addReply = jest
            .fn()
            .mockImplementation(() => Promise.resolve(expectedAddedReply));
        mockThreadRepository.verifyCommentExist = jest.fn().mockImplementation(() => Promise.resolve());

        /** creating use case instance */
        const addReplyUseCase = new AddReplyUseCase({
            threadRepository: mockThreadRepository,
        });

        // Action
        const addedThread = await addReplyUseCase.execute(useCasePayload);

        // Assert
        expect(addedThread).toStrictEqual(expectedAddedReply);
        expect(mockThreadRepository.addReply).toBeCalledWith(
            new AddReply({
                commentId: 'comment-123',
                content: 'Tentang cerita dulu',
                owner: 'user-123',
            })
        );
        expect(mockThreadRepository.verifyCommentExist).toBeCalledWith({
            threadId: 'thread-123',
            commentId: 'comment-123',
        });
    });
});
