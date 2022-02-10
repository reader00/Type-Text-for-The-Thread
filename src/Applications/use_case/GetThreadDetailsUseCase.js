const GetThreadDetails = require('../../Domains/threads/entities/GetThreadDetails');
const ThreadDetails = require('../../Domains/threads/entities/ThreadDetails');

class GetThreadDetailsUseCase {
    constructor({ threadRepository }) {
        this._threadRepository = threadRepository;
    }

    async execute(useCasePayload) {
        const getThreadDetails = new GetThreadDetails(useCasePayload);

        await this._threadRepository.verifyThreadExist(useCasePayload.threadId);

        const thread = await this._threadRepository.getThreadDetailsById(getThreadDetails);
        const threadComments = await this._threadRepository.getThreadCommentsById(getThreadDetails);

        return new ThreadDetails({
            ...thread,
            comments: threadComments,
        });
    }
}

module.exports = GetThreadDetailsUseCase;
