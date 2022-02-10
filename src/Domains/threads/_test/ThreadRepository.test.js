const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository interface', () => {
    it('should throw error when invoke abstract behavior', async () => {
        // Arrange
        const threadRepository = new ThreadRepository();

        // Action and Assert
        await expect(threadRepository.addThread({})).rejects.toThrowError(
            'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
        );
        await expect(threadRepository.verifyThreadExist()).rejects.toThrowError(
            'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
        );
        await expect(threadRepository.verifyCommentExist()).rejects.toThrowError(
            'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
        );
        await expect(threadRepository.verifyReplyExist()).rejects.toThrowError(
            'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
        );
        await expect(threadRepository.addComment({})).rejects.toThrowError(
            'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
        );
        await expect(threadRepository.addReply({})).rejects.toThrowError(
            'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
        );
        await expect(threadRepository.getThreadDetailsById({})).rejects.toThrowError(
            'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
        );
        await expect(threadRepository.getThreadCommentsById({})).rejects.toThrowError(
            'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
        );
        await expect(threadRepository.getCommentRepliesById({})).rejects.toThrowError(
            'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
        );
        await expect(threadRepository.deleteCommentById({})).rejects.toThrowError(
            'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
        );
        await expect(threadRepository.deleteReplyById({})).rejects.toThrowError(
            'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
        );
    });
});
