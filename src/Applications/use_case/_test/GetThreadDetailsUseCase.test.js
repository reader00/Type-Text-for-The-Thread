const GetThreadDetails = require('../../../Domains/threads/entities/GetThreadDetails');
const ThreadDetails = require('../../../Domains/threads/entities/ThreadDetails');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadDetailsUseCase = require('../GetThreadDetailsUseCase');

describe('GetThreadDetailsUseCase', () => {
    /**
     * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
     */
    it('should orchestrating the get thread details action correctly', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
        };

        const expectedAddedThread = new ThreadDetails({
            id: 'thread-123',
            title: 'Di atas Awan',
            body: 'Ku ingin terbang',
            date: '2021-08-08T07:19:09.775Z',
            username: 'dicoding',
            comments: [],
        });

        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();

        /** mocking needed function */
        mockThreadRepository.getThreadDetailsById = jest
            .fn()
            .mockImplementation(() => Promise.resolve(expectedAddedThread));
        mockThreadRepository.getThreadCommentsById = jest.fn().mockImplementation(() => Promise.resolve([]));
        mockThreadRepository.verifyThreadExist = jest.fn().mockImplementation(() => Promise.resolve());

        /** creating use case instance */
        const getThreadUseCase = new GetThreadDetailsUseCase({
            threadRepository: mockThreadRepository,
        });

        // Action
        const threadDetails = await getThreadUseCase.execute(useCasePayload);

        // Assert
        expect(threadDetails).toStrictEqual(expectedAddedThread);
        expect(mockThreadRepository.getThreadDetailsById).toBeCalledWith(
            new GetThreadDetails({
                threadId: 'thread-123',
            })
        );
        expect(mockThreadRepository.getThreadCommentsById).toBeCalledWith(
            new GetThreadDetails({
                threadId: 'thread-123',
            })
        );
        expect(mockThreadRepository.verifyThreadExist).toBeCalledWith('thread-123');
    });
});
