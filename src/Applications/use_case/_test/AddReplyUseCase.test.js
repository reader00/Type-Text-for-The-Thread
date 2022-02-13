const AddedReply = require('../../../Domains/threads/reply/entities/AddedReply');
const AddReply = require('../../../Domains/threads/reply/entities/AddReply');
const ReplyRepository = require('../../../Domains/threads/reply/ReplyRepository');
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
        const mockReplyRepository = new ReplyRepository();

        /** mocking needed function */
        mockReplyRepository.addReply = jest
            .fn()
            .mockImplementation(() => Promise.resolve(expectedAddedReply));
        mockReplyRepository.verifyCommentExist = jest.fn().mockImplementation(() => Promise.resolve());

        /** creating use case instance */
        const addReplyUseCase = new AddReplyUseCase({
            replyRepository: mockReplyRepository,
        });

        // Action
        const addedThread = await addReplyUseCase.execute(useCasePayload);

        // Assert
        expect(addedThread).toStrictEqual(expectedAddedReply);
        expect(mockReplyRepository.addReply).toBeCalledWith(
            new AddReply({
                commentId: 'comment-123',
                content: 'Tentang cerita dulu',
                owner: 'user-123',
            })
        );
        expect(mockReplyRepository.verifyCommentExist).toBeCalledWith({
            threadId: 'thread-123',
            commentId: 'comment-123',
        });
    });
});
