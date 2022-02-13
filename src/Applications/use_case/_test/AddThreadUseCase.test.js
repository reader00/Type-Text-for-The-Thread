const AddedThread = require('../../../Domains/threads/thread/entities/AddedThread');
const AddThread = require('../../../Domains/threads/thread/entities/AddThread');
const ThreadRepository = require('../../../Domains/threads/thread/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
    /**
     * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
     */
    it('should orchestrating the add thread action correctly', async () => {
        // Arrange
        const useCasePayload = {
            title: 'Di atas Awan',
            body: 'Ku ingin terbang',
            owner: 'user-123',
        };

        const expectedAddedThread = new AddedThread({
            id: 'thread-123',
            title: 'Di atas Awan',
            owner: 'user-123',
        });

        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();

        /** mocking needed function */
        mockThreadRepository.addThread = jest
            .fn()
            .mockImplementation(() => Promise.resolve(expectedAddedThread));

        /** creating use case instance */
        const getThreadUseCase = new AddThreadUseCase({
            threadRepository: mockThreadRepository,
        });

        // Action
        const addedThread = await getThreadUseCase.execute(useCasePayload);

        // Assert
        expect(addedThread).toStrictEqual(expectedAddedThread);
        expect(mockThreadRepository.addThread).toBeCalledWith(
            new AddThread({
                title: 'Di atas Awan',
                body: 'Ku ingin terbang',
                owner: 'user-123',
            })
        );
    });
});
