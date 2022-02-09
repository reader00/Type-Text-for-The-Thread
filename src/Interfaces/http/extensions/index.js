const ClientError = require('../../../Commons/exceptions/ClientError');
const DomainErrorTranslator = require('../../../Commons/exceptions/DomainErrorTranslator');

const extensions = {
    onPreResponse: (request, h) => {
        // mendapatkan konteks response dari request
        const { response } = request;

        if (response instanceof Error) {
            const translatedError = DomainErrorTranslator.translate(response);

            // penanganan client error secara internal
            if (translatedError instanceof ClientError) {
                const newResponse = h.response({
                    status: 'fail',
                    message: translatedError.message,
                });

                newResponse.code(translatedError.statusCode);
                return newResponse;
            }

            if (!translatedError.isServer) {
                return h.continue;
            }

            // penanganan server error sesuai kebutuhan
            const newResponse = h.response({
                status: 'error',
                message: 'terjadi kegagalan pada server kami',
            });
            newResponse.code(500);
            return newResponse;
        }

        // jika bukan error, lanjutkan dengan response asli
        return h.continue;
    },
};

module.exports = extensions;
