const GetThreadDetails = require('../../Domains/threads/entities/GetThreadDetails');

class GetThreadDetailsUseCase {
    constructor({ threadRepository }) {
        this._threadRepository = threadRepository;
    }

    async execute(useCasePayload) {
        const getThreadDetails = new GetThreadDetails(useCasePayload);

        await this._threadRepository.verifyThreadExist(useCasePayload.threadId);

        return this._threadRepository.getThreadDetails(getThreadDetails);
    }
}

module.exports = GetThreadDetailsUseCase;
