const ForbiddenError = require('../ForbiddenError');

describe('ForbiddenError', () => {
    it('should create ForbiddenError correctly', () => {
        const forbiddenError = new ForbiddenError('an error occurs');

        expect(forbiddenError.statusCode).toEqual(403);
        expect(forbiddenError.message).toEqual('an error occurs');
        expect(forbiddenError.name).toEqual('ForbiddenError');
    });
});
