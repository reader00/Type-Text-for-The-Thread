const NotFoundError = require('../NotFoundError');

describe('NotFoundError', () => {
    it('should create NotFoundError correctly', () => {
        const notFoundError = new NotFoundError('an error occurs');

        expect(notFoundError.statusCode).toEqual(404);
        expect(notFoundError.message).toEqual('an error occurs');
        expect(notFoundError.name).toEqual('NotFoundError');
    });
});
