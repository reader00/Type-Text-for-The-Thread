const CommentRepository = require('../../../Domains/threads/comment/CommentRepository');
const CommentDetails = require('../../../Domains/threads/comment/entities/CommentDetails');
const ReplyDetails = require('../../../Domains/threads/reply/entities/ReplyDetails');
const ReplyRepository = require('../../../Domains/threads/reply/ReplyRepository');
const GetThreadDetails = require('../../../Domains/threads/thread/entities/GetThreadDetails');
const ThreadDetails = require('../../../Domains/threads/thread/entities/ThreadDetails');
const ThreadRepository = require('../../../Domains/threads/thread/ThreadRepository');
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

        const expectedThreadDetails = new ThreadDetails({
            id: 'thread-123',
            title: 'Di atas Awan',
            body: 'Ku ingin terbang',
            date: '2021-08-08T07:19:09.775Z',
            username: 'dicoding',
            comments: [
                new CommentDetails({
                    id: 'comment-123',
                    content: 'Tentang cerita dulu',
                    date: '2021-08-08T07:19:09.775Z',
                    username: 'dicoding',
                    is_deleted: 0,
                    replies: [
                        new ReplyDetails({
                            id: 'reply-123',
                            content: 'Hai, apa kabar',
                            date: '2021-08-08T07:19:09.775Z',
                            username: 'dicoding',
                            is_deleted: 1,
                        }),
                    ],
                }),
                new CommentDetails({
                    id: 'comment-124',
                    content: 'Tentang cerita dulu',
                    date: '2021-08-08T07:19:09.775Z',
                    username: 'dicoding',
                    is_deleted: 1,
                    replies: [
                        new ReplyDetails({
                            id: 'reply-124',
                            content: 'Hai, apa kabar',
                            date: '2021-08-08T07:19:09.775Z',
                            username: 'dicoding',
                            is_deleted: 0,
                        }),
                    ],
                }),
            ],
        });

        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();

        /** mocking needed function */
        mockThreadRepository.getThreadDetailsById = jest.fn().mockImplementation(() =>
            Promise.resolve({
                id: 'thread-123',
                title: 'Di atas Awan',
                body: 'Ku ingin terbang',
                date: '2021-08-08T07:19:09.775Z',
                username: 'dicoding',
            })
        );
        mockThreadRepository.verifyThreadExist = jest.fn().mockImplementation(() => Promise.resolve());

        mockCommentRepository.getCommentsByThreadId = jest.fn().mockImplementation(() =>
            Promise.resolve([
                {
                    id: 'comment-123',
                    thread_id: 'thread-123',
                    content: 'Tentang cerita dulu',
                    date: '2021-08-08T07:19:09.775Z',
                    username: 'dicoding',
                    is_deleted: 0,
                },
                {
                    id: 'comment-124',
                    thread_id: 'thread-123',
                    content: 'Tentang cerita dulu',
                    date: '2021-08-08T07:19:09.775Z',
                    username: 'dicoding',
                    is_deleted: 1,
                },
            ])
        );

        mockReplyRepository.getRepliesByThreadId = jest.fn().mockImplementation(() =>
            Promise.resolve([
                {
                    id: 'reply-123',
                    comment_id: 'comment-123',
                    content: 'Hai, apa kabar',
                    date: '2021-08-08T07:19:09.775Z',
                    username: 'dicoding',
                    is_deleted: 1,
                },
                {
                    id: 'reply-124',
                    comment_id: 'comment-124',
                    content: 'Hai, apa kabar',
                    date: '2021-08-08T07:19:09.775Z',
                    username: 'dicoding',
                    is_deleted: 0,
                },
            ])
        );

        /** creating use case instance */
        const getThreadUseCase = new GetThreadDetailsUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository,
        });

        // Action
        const threadDetails = await getThreadUseCase.execute(useCasePayload);

        // Assert
        expect(threadDetails).toStrictEqual(expectedThreadDetails);
        expect(mockThreadRepository.getThreadDetailsById).toBeCalledWith(
            new GetThreadDetails({
                threadId: 'thread-123',
            })
        );
        expect(mockThreadRepository.verifyThreadExist).toBeCalledWith('thread-123');
        expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
            new GetThreadDetails({
                threadId: 'thread-123',
            })
        );
        expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(
            new GetThreadDetails({
                threadId: 'thread-123',
            })
        );
    });
});
