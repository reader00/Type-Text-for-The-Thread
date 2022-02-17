const container = require('../../container');
const createServer = require('../createServer');

describe('/hi endpoint', () => {
    describe('when GET /hi', () => {
        it('should return Hello', async () => {
            // Arrange
            const server = await createServer(container);

            // Actions
            const response = await server.inject({
                method: 'GET',
                url: '/hi',
            });

            // Assert
            expect(response.statusCode).toBe(200);
            expect(response.payload).toEqual('Hello');
        });
    });
});
