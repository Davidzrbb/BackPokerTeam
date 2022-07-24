import {User} from "../models/User"
import {SecurityUtils} from "../utils";


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

    public async subscribeUser(user: typeof User): Promise< typeof User> {
        if (user.name === undefined || user.lastname === undefined || user.password === undefined || user.promo === undefined || user.role === undefined || user.login === undefined) {
            throw new Error("Missing parameters");
        }
        if (user.name.length === 0 || user.lastname.length === 0 || user.password.length === 0 || user.promo.length === 0 || user.role.length === 0 || user.login.length === 0) {
            throw new Error("Missing parameters");
        }
        if (user.name.length > 50 || user.lastname.length > 50 || user.password.length > 50 || user.promo.length > 50 || user.role.length > 50 || user.login.length > 50) {
            throw new Error("Too long parameters");
        }

        if (user.name.match(/[^a-zA-Z\d]/g) || user.lastname.match(/[^a-zA-Z\d]/g)  || user.promo.match(/[^a-zA-Z\d]/g) || user.role.match(/[^a-zA-Z\d]/g) || user.login.match(/[^a-zA-Z\d]/g)) {
            throw new Error("Invalid parameters");
        }
        if(user.password.length < 6) {
            throw new Error("Password too short");
        }
        if(user.promo.length !== 2) {
            throw new Error("Invalid promo");
        }
        if(user.role !== "admin" && user.role !== "user") {
            throw new Error("Invalid role");
        }
        if (await User.findOne({where: {name: user.name, lastname: user.lastname}})) {
            throw new Error("User already exists");
        }
        if (await User.findOne({where: {login: user.login}})) {
            throw new Error("Login already exists");
        }
        user.password = SecurityUtils.sha512(user.password);

        return await User.create(user);
    }

    async connexionUser(param : typeof User): Promise< typeof User> {
        if (param.login === undefined || param.password === undefined) {
            throw new Error("Missing parameters");
        }
        if (param.login.length === 0 || param.password.length === 0) {
            throw new Error("Missing parameters");
        }
        if (param.login.length > 50 || param.password.length > 50) {
            throw new Error("Too long parameters");
        }
        if (param.login.match(/[^a-zA-Z\d]/g) || param.password.match(/[^a-zA-Z\d]/g)) {
            throw new Error("Invalid parameters");
        }
        const user = await User.findOne({where: {login: param.login , password: SecurityUtils.sha512(param.password)}});
        if (!user) {
            throw new Error("User not found");
        }
        let token = await this.updateSession(user);
        if (!token) {
            throw new Error("Error in insert session");
        }
        return user;
    }

    async updateSession(user: typeof User): Promise<string> {
        const user_id = user.idUser;
        let token = SecurityUtils.generateToken();
        try {
            await User.update({token: token}, {where: {idUser: user_id}});
            return token;
        } catch (error) {
            console.log(error);
            throw new Error("Error in insert session");
        }
    }

    async getUserByToken(token: string) {
        const user = await User.findOne({where: {token: token}});
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
}