const LikeRepository = require('../../../Domains/threads/like/LikeRepository');
const CommentRepository = require('../../../Domains/threads/comment/CommentRepository');
const CommentDetail = require('../../../Domains/threads/comment/entities/CommentDetail');
const ReplyDetail = require('../../../Domains/threads/reply/entities/ReplyDetail');
const ReplyRepository = require('../../../Domains/threads/reply/ReplyRepository');
const GetThreadDetails = require('../../../Domains/threads/thread/entities/GetThreadDetail');
const ThreadDetail = require('../../../Domains/threads/thread/entities/ThreadDetail');
const ThreadRepository = require('../../../Domains/threads/thread/ThreadRepository');
const GetThreadDetailsUseCase = require('../GetThreadDetailUseCase');

describe('GetThreadDetailsUseCase', () => {
    /**
     * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
     */
    it('should orchestrating the get thread details action correctly', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
        };

        const expectedThreadDetails = new ThreadDetail({
            id: 'thread-123',
            title: 'Di atas Awan',
            body: 'Ku ingin terbang',
            date: new Date('2021-08-08T07:19:09.775Z'),
            username: 'dicoding',
            comments: [
                new CommentDetail({
                    id: 'comment-123',
                    content: 'Tentang cerita dulu',
                    date: new Date('2021-08-08T07:19:09.775Z'),
                    username: 'dicoding',
                    likeCount: 1,
                    is_deleted: false,
                    replies: [
                        new ReplyDetail({
                            id: 'reply-123',
                            content: 'Hai, apa kabar',
                            date: new Date('2021-08-08T07:19:09.775Z'),
                            username: 'dicoding',
                            is_deleted: true,
                        }),
                    ],
                }),
                new CommentDetail({
                    id: 'comment-124',
                    content: 'Tentang cerita dulu',
                    date: new Date('2021-08-08T07:19:09.775Z'),
                    username: 'dicoding',
                    likeCount: 0,
                    is_deleted: true,
                    replies: [
                        new ReplyDetail({
                            id: 'reply-124',
                            content: 'Hai, apa kabar',
                            date: new Date('2021-08-08T07:19:09.775Z'),
                            username: 'dicoding',
                            is_deleted: false,
                        }),
                    ],
                }),
            ],
        });

        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();
        const mockLikeRepository = new LikeRepository();

        /** mocking needed function */
        mockThreadRepository.getThreadDetailById = jest.fn(() =>
            Promise.resolve({
                id: 'thread-123',
                title: 'Di atas Awan',
                body: 'Ku ingin terbang',
                date: new Date('2021-08-08T07:19:09.775Z'),
                username: 'dicoding',
            }),
        );
        mockThreadRepository.verifyThreadExist = jest.fn(() =>
            Promise.resolve(),
        );

        mockCommentRepository.getCommentsByThreadId = jest.fn(() =>
            Promise.resolve([
                {
                    id: 'comment-123',
                    thread_id: 'thread-123',
                    content: 'Tentang cerita dulu',
                    date: new Date('2021-08-08T07:19:09.775Z'),
                    username: 'dicoding',
                    is_deleted: false,
                },
                {
                    id: 'comment-124',
                    thread_id: 'thread-123',
                    content: 'Tentang cerita dulu',
                    date: new Date('2021-08-08T07:19:09.775Z'),
                    username: 'dicoding',
                    is_deleted: true,
                },
            ]),
        );

        mockReplyRepository.getRepliesByThreadId = jest.fn(() =>
            Promise.resolve([
                {
                    id: 'reply-123',
                    comment_id: 'comment-123',
                    content: 'Hai, apa kabar',
                    date: new Date('2021-08-08T07:19:09.775Z'),
                    username: 'dicoding',
                    is_deleted: true,
                },
                {
                    id: 'reply-124',
                    comment_id: 'comment-124',
                    content: 'Hai, apa kabar',
                    date: new Date('2021-08-08T07:19:09.775Z'),
                    username: 'dicoding',
                    is_deleted: false,
                },
            ]),
        );

        mockLikeRepository.getLikeCountsByThreadId = jest.fn(() =>
            Promise.resolve([
                {
                    comment_id: 'comment-123',
                    like_count: 1,
                },
            ]),
        );

        /** creating use case instance */
        const getThreadUseCase = new GetThreadDetailsUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository,
            likeRepository: mockLikeRepository,
        });

        // Action
        const threadDetails = await getThreadUseCase.execute(useCasePayload);

        // Assert
        expect(threadDetails).toStrictEqual(expectedThreadDetails);
        expect(mockThreadRepository.getThreadDetailById).toBeCalledWith(
            new GetThreadDetails({
                threadId: 'thread-123',
            }),
        );
        expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(
            'thread-123',
        );
        expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
            new GetThreadDetails({
                threadId: 'thread-123',
            }),
        );
        expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(
            new GetThreadDetails({
                threadId: 'thread-123',
            }),
        );
        expect(mockLikeRepository.getLikeCountsByThreadId).toBeCalledWith(
            new GetThreadDetails({
                threadId: 'thread-123',
            }),
        );
    });
});
