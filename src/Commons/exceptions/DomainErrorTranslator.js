const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
    translate(error) {
        return DomainErrorTranslator._dictionaries[error.message] || error;
    },
};

DomainErrorTranslator._dictionaries = {
    'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
        'tidak dapat membuat user baru karena properti yang dibutuhkan tidak lengkap'
    ),
    'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
        'tidak dapat membuat user baru karena tipe data tidak sesuai'
    ),
    'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError(
        'tidak dapat membuat user baru karena karakter username melebihi batas'
    ),
    'REGISTER_USER.USERNAME_CONTAINS_RESTRICTED_CHARACTER': new InvariantError(
        'tidak dapat membuat user baru karena username mengandung karakter terlarang'
    ),
    'LOGIN_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
    'LOGIN_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
        'username dan password harus bertipe data string'
    ),
    'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError(
        'harus mengirimkan refresh token'
    ),
    'REFRESH_AUTHENTICATION_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
        'refresh token harus bertipe data string'
    ),
    'LOGOUT_USER_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan refresh token'),
    'LOGOUT_USER_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
        'refresh token harus bertipe data string'
    ),
    'ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
        'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak lengkap'
    ),
    'ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
        'tidak dapat membuat thread baru karena tipe data tidak sesuai'
    ),
    'ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
        'tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak lengkap'
    ),
    'ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
        'tidak dapat membuat komentar baru karena tipe data tidak sesuai'
    ),
    'DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
        'tidak dapat menghapus komentar karena properti yang dibutuhkan tidak lengkap'
    ),
    'DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
        'tidak dapat menghapus komentar karena tipe data tidak sesuai'
    ),
    'GET_THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
        'tidak dapat mengambil rincian thread karena properti yang dibutuhkan tidak lengkap'
    ),
    'GET_THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
        'tidak dapat mengambil rincian karena tipe data tidak sesuai'
    ),
    'ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
        'tidak dapat membuat balasan baru karena properti yang dibutuhkan tidak lengkap'
    ),
    'ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
        'tidak dapat membuat balasan baru karena tipe data tidak sesuai'
    ),
    'DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
        'tidak dapat menghapus balasan karena properti yang dibutuhkan tidak lengkap'
    ),
    'DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
        'tidak dapat menghapus balasan karena tipe data tidak sesuai'
    ),
};

module.exports = DomainErrorTranslator;
