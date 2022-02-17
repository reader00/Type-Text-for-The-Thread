const container = require('../../container');
const createServer = require('../createServer');

describe('/ endpoint', () => {
    describe('when GET /', () => {
        it('should return Hello', async () => {
            // Arrange
            const server = await createServer(container);

            // Actions
            const response = await server.inject({
                method: 'GET',
                url: '/',
            });

            // Assert
            expect(response.statusCode).toBe(200);
            expect(response.payload).toEqual(
                'Selamat datang di aplikasi forum API.',
            );
        });
    });
});
