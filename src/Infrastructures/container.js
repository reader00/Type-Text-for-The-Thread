/* istanbul ignore file */

const { createContainer } = require('instances-container');

// external agency
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const pool = require('./database/postgres/pool');
const Jwt = require('@hapi/jwt');

// service
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres');
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres');
const BcryptPasswordHash = require('./security/BcryptPasswordHash');
const JwtTokenManager = require('./security/JwtTokenManager');
const AuthenticationTokenManager = require('../Applications/security/AuthenticationTokenManager');
const ThreadRepositoryPostgres = require('./repository/ThreadRepositoryPostgres');

// use case
const PasswordHash = require('../Applications/security/PasswordHash');
const UserRepository = require('../Domains/users/UserRepository');
const AuthenticationRepository = require('../Domains/authentications/AuthenticationRepository');
const AddUserUseCase = require('../Applications/use_case/AddUserUseCase');
const LoginUserUseCase = require('../Applications/use_case/LoginUserUseCase');
const RefreshAuthenticationUseCase = require('../Applications/use_case/RefreshAuthenticationUseCase');
const LogoutUserUseCase = require('../Applications/use_case/LogoutUserUseCase');
const AddThreadUseCase = require('../Applications/use_case/AddThreadUseCase');
const ThreadRepository = require('../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../Applications/use_case/AddCommentUseCase');
const GetThreadDetailsUseCase = require('../Applications/use_case/GetThreadDetailsUseCase');
const DeleteCommentUseCase = require('../Applications/use_case/DeleteCommentUseCase');
const AddReplyUseCase = require('../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../Applications/use_case/DeleteReplyUseCase');

// creating container
const container = createContainer();

// registering service and repository
container.register([
    {
        key: UserRepository.name,
        Class: UserRepositoryPostgres,
        parameter: {
            dependencies: [
                {
                    concrete: pool,
                },
                {
                    concrete: nanoid,
                },
            ],
        },
    },
    {
        key: AuthenticationRepository.name,
        Class: AuthenticationRepositoryPostgres,
        parameter: {
            dependencies: [
                {
                    concrete: pool,
                },
            ],
        },
    },
    {
        key: PasswordHash.name,
        Class: BcryptPasswordHash,
        parameter: {
            dependencies: [
                {
                    concrete: bcrypt,
                },
            ],
        },
    },
    {
        key: AuthenticationTokenManager.name,
        Class: JwtTokenManager,
        parameter: {
            dependencies: [
                {
                    concrete: Jwt.token,
                },
            ],
        },
    },
    {
        key: ThreadRepository.name,
        Class: ThreadRepositoryPostgres,
        parameter: {
            dependencies: [
                {
                    concrete: pool,
                },
                {
                    concrete: nanoid,
                },
            ],
        },
    },
]);

// registering use case
container.register([
    {
        key: AddUserUseCase.name,
        Class: AddUserUseCase,
        parameter: {
            injectType: 'destructuring',
            dependencies: [
                {
                    name: 'userRepository',
                    internal: UserRepository.name,
                },
                {
                    name: 'passwordHash',
                    internal: PasswordHash.name,
                },
            ],
        },
    },
    {
        key: LoginUserUseCase.name,
        Class: LoginUserUseCase,
        parameter: {
            injectType: 'destructuring',
            dependencies: [
                {
                    name: 'userRepository',
                    internal: UserRepository.name,
                },
                {
                    name: 'authenticationRepository',
                    internal: AuthenticationRepository.name,
                },
                {
                    name: 'passwordHash',
                    internal: PasswordHash.name,
                },
                {
                    name: 'authenticationTokenManager',
                    internal: AuthenticationTokenManager.name,
                },
            ],
        },
    },
    {
        key: RefreshAuthenticationUseCase.name,
        Class: RefreshAuthenticationUseCase,
        parameter: {
            injectType: 'destructuring',
            dependencies: [
                {
                    name: 'authenticationRepository',
                    internal: AuthenticationRepository.name,
                },
                {
                    name: 'authenticationTokenManager',
                    internal: AuthenticationTokenManager.name,
                },
            ],
        },
    },
    {
        key: LogoutUserUseCase.name,
        Class: LogoutUserUseCase,
        parameter: {
            dependencies: [
                {
                    name: 'authenticationRepository',
                    internal: AuthenticationRepository.name,
                },
            ],
        },
    },
    {
        key: AddThreadUseCase.name,
        Class: AddThreadUseCase,
        parameter: {
            injectType: 'destructuring',
            dependencies: [
                {
                    name: 'threadRepository',
                    internal: ThreadRepository.name,
                },
            ],
        },
    },
    {
        key: AddCommentUseCase.name,
        Class: AddCommentUseCase,
        parameter: {
            injectType: 'destructuring',
            dependencies: [
                {
                    name: 'threadRepository',
                    internal: ThreadRepository.name,
                },
            ],
        },
    },
    {
        key: GetThreadDetailsUseCase.name,
        Class: GetThreadDetailsUseCase,
        parameter: {
            injectType: 'destructuring',
            dependencies: [
                {
                    name: 'threadRepository',
                    internal: ThreadRepository.name,
                },
            ],
        },
    },
    {
        key: DeleteCommentUseCase.name,
        Class: DeleteCommentUseCase,
        parameter: {
            injectType: 'destructuring',
            dependencies: [
                {
                    name: 'threadRepository',
                    internal: ThreadRepository.name,
                },
            ],
        },
    },
    {
        key: AddReplyUseCase.name,
        Class: AddReplyUseCase,
        parameter: {
            injectType: 'destructuring',
            dependencies: [
                {
                    name: 'threadRepository',
                    internal: ThreadRepository.name,
                },
            ],
        },
    },
    {
        key: DeleteReplyUseCase.name,
        Class: DeleteReplyUseCase,
        parameter: {
            injectType: 'destructuring',
            dependencies: [
                {
                    name: 'threadRepository',
                    internal: ThreadRepository.name,
                },
            ],
        },
    },
]);

module.exports = container;
