const InvariantError = require('../../Commons/exceptions/InvariantError');
const RegisteredUser = require('../../Domains/users/entities/RegisteredUser');
const UserRepository = require('../../Domains/users/UserRepository');

class UserRepositoryPostgres extends UserRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async verifyAvailableUsername(username) {
        const query = {
            text: 'SELECT username FROM users WHERE username = $1',
            values: [username],
        };

        const results = await this._pool.query(query);

        if (results.rowCount) {
            throw new InvariantError('username tidak tersedia');
        }
    }

    async addUser(registerUser) {
        const { username, password, fullname } = registerUser;
        const id = `user-${this._idGenerator()}`;

        const query = {
            text: 'INSERT INTO users(id, username, password, fullname) VALUES($1, $2, $3, $4) RETURNING id, username, fullname',
            values: [id, username, password, fullname],
        };

        const results = await this._pool.query(query);

        return new RegisteredUser({ ...results.rows[0] });
    }

    async getPasswordByUsername(username) {
        const query = {
            text: 'SELECT password FROM users WHERE username = $1',
            values: [username],
        };

        const results = await this._pool.query(query);

        if (!results.rowCount) {
            throw new InvariantError('username tidak ditemukan');
        }

        return results.rows[0].password;
    }

    async getIdByUsername(username) {
        const query = {
            text: 'SELECT id FROM users WHERE username = $1',
            values: [username],
        };

        const results = await this._pool.query(query);

        if (!results.rowCount) {
            throw new InvariantError('username tidak ditemukan');
        }

        return results.rows[0].id;
    }
}

module.exports = UserRepositoryPostgres;
