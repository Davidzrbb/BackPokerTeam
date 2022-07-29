import {SecurityUtils} from "../utils";

const Session = require('../models/Session');
const User = require('../models/User');

export class UserService {

    private static instance?: UserService;

    public static getInstance(): UserService {
        if (UserService.instance === undefined) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }

    private constructor() {
    }

    public async subscribeUser(user: typeof User): Promise<typeof User> {
        if (user.name === undefined || user.lastname === undefined || user.password === undefined || user.promo === undefined || user.role === undefined || user.login === undefined) {
            throw new Error("Missing parameters");
        }
        if (user.name.length === 0 || user.lastname.length === 0 || user.password.length === 0 || user.promo.length === 0 || user.role.length === 0 || user.login.length === 0) {
            throw new Error("Missing parameters");
        }
        if (user.name.length > 50 || user.lastname.length > 50 || user.password.length > 50 || user.promo.length > 50 || user.role.length > 50 || user.login.length > 50) {
            throw new Error("Too long parameters");
        }

        if (user.name.match(/[^a-zA-Z\d]/g) || user.lastname.match(/[^a-zA-Z\d]/g) || user.promo.match(/[^a-zA-Z\d]/g) || user.role.match(/[^a-zA-Z\d]/g) || user.login.match(/[^a-zA-Z\d]/g)) {
            throw new Error("Invalid parameters");
        }
        if (user.promo.length !== 2) {
            throw new Error("Invalid promo");
        }
        if (user.role !== "admin" && user.role !== "user") {
            throw new Error("Invalid role");
        }
        if (await User.findOne({where: {name: user.name, lastname: user.lastname}})) {
            throw new Error("User already exists");
        }
        if (await User.findOne({where: {login: user.login}})) {
            throw new Error("Login already exists");
        }
        user.createdAt = new Date();
        user.updatedAt = new Date();

        user.password = SecurityUtils.sha512(user.password);
        return await User.create(user);
    }

    async connexionUser(param: typeof User): Promise<typeof User> {
        if (param.login === undefined || param.password === undefined) {
            throw new Error("Missing parameters");
        }
        if (param.login.length === 0 || param.password.length === 0) {
            throw new Error("Missing parameters");
        }
        if (param.login.length > 50 || param.password.length > 50) {
            throw new Error("Too long parameters");
        }
        if (param.login.match(/[^a-zA-Z\d]/g)) {
            throw new Error("Invalid parameters");
        }
        const user = await User.findOne({where: {login: param.login, password: SecurityUtils.sha512(param.password)}});
        if (!user) {
            throw new Error("User not found");
        }
        let token = await this.createSession(user);
        if (!token) {
            throw new Error("Error in insert session");
        }
        return {user: user, token: token.token};
    }

    async createSession(user: typeof User): Promise<typeof Session> {
        return await Session.create({
            idUser: user.idUser,
            token: SecurityUtils.sha512(user.login + user.password + new Date().getTime()),
            expiration: new Date().getTime() + (1000 * 60 * 60 * 24 * 7),
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    async getUserByToken(token: string) {
        const session = await Session.findOne({where: {token: token}});
        if (!session) {
            return undefined;
        }
        if (session.expiration < new Date().getTime()) {
            return undefined;
        }
        return await User.findOne({where: {idUser: session.idUser}});
    }

    getUserById(id: number) {
        if (id === undefined) {
            throw new Error("Missing parameters");
        }
        return User.findOne({where: {idUser: id}});
    }
}