const UserTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const pool = require('../../database/postgres/pool');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');

describe('UserRepositoryPostgres', () => {
    afterEach(async () => {
        await UserTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('verifyAvailableUsername function', () => {
        it('should throw InvariantError when username not available', async () => {
            // Arrange
            await UserTableTestHelper.addUser({ username: 'dicoding' });
            const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

            // Action and Assert
            await expect(userRepositoryPostgres.verifyAvailableUsername('dicoding')).rejects.toThrow(
                InvariantError
            );
        });

        it('should not throw InvariantError when username available', () => {
            // Arrange
            const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

            // Action and Assert
            expect(userRepositoryPostgres.verifyAvailableUsername('dicoding')).resolves.not.toThrowError(
                InvariantError
            );
        });
    });

    describe('addUser function', () => {
        it('should persist register user', async () => {
            // Arrange
            const registerUser = new RegisterUser({
                username: 'dicoding',
                password: 'asd',
                fullname: 'Dicoding Indonesia',
            });

            const fakeIdGenerator = () => '123'; // stub
            const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await userRepositoryPostgres.addUser(registerUser);

            // Assert
            const users = await UserTableTestHelper.findUserById('user-123');
            expect(users).toHaveLength(1);
        });

        it('should return registered user correctly', async () => {
            // Arrange
            const registerUser = new RegisterUser({
                username: 'dicoding',
                password: 'asd',
                fullname: 'Dicoding Indonesia',
            });

            const fageIdGenerator = () => '123'; // stub
            const userRepositoryPostgres = new UserRepositoryPostgres(pool, fageIdGenerator);

            // Action
            const registeredUser = await userRepositoryPostgres.addUser(registerUser);

            // Assert
            expect(registeredUser).toStrictEqual(
                new RegisteredUser({
                    id: 'user-123',
                    username: 'dicoding',
                    fullname: 'Dicoding Indonesia',
                })
            );
        });
    });

    describe('getPasswordByUsername function', () => {
        it('should throw error if username is not registered', async () => {
            // Arrange
            const fageIdGenerator = () => '123'; // stub
            const userRepositoryPostgres = new UserRepositoryPostgres(pool, fageIdGenerator);

            // Action and Assert
            await expect(userRepositoryPostgres.getPasswordByUsername('dicoding')).rejects.toThrowError(
                'username tidak ditemukan'
            );
        });

        it('should return password if username is available', async () => {
            // Arrange
            const registerUser = new RegisterUser({
                username: 'dicoding',
                password: 'asd',
                fullname: 'Dicoding Indonesia',
            });

            const fageIdGenerator = () => '123'; // stub
            const userRepositoryPostgres = new UserRepositoryPostgres(pool, fageIdGenerator);

            await userRepositoryPostgres.addUser(registerUser);

            // Action
            const encryptedPasswrod = await userRepositoryPostgres.getPasswordByUsername('dicoding');

            // Assert
            expect(encryptedPasswrod).toBeDefined();
        });
    });

    describe('getIdByUsername function', () => {
        it('should throw error if username is not registered', async () => {
            // Arrange
            const fageIdGenerator = () => '123'; // stub
            const userRepositoryPostgres = new UserRepositoryPostgres(pool, fageIdGenerator);

            // Action and Assert
            await expect(userRepositoryPostgres.getIdByUsername('dicoding')).rejects.toThrowError(
                'username tidak ditemukan'
            );
        });

        it('should return id if username is available', async () => {
            // Arrange
            const registerUser = new RegisterUser({
                username: 'dicoding',
                password: 'asd',
                fullname: 'Dicoding Indonesia',
            });

            const fageIdGenerator = () => '123'; // stub
            const userRepositoryPostgres = new UserRepositoryPostgres(pool, fageIdGenerator);

            await userRepositoryPostgres.addUser(registerUser);

            // Action
            const userId = await userRepositoryPostgres.getIdByUsername('dicoding');

            // Assert
            expect(userId).toEqual('user-123');
        });
    });
});
