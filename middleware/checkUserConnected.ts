import {Request, RequestHandler} from "express";
import {UserService} from "../services/user.service";
import {SecurityUtils} from "../utils/security.utils";
import {User} from "../models/User";

declare module 'express' {
    export interface Request {
        user?: typeof User;
    }
}

export function checkUserConnected(): RequestHandler {
    return async function (req: Request,
                           res,
                           next) {
        const authorization = req.headers['authorization'];
        if (authorization === undefined) {
            res.status(401).end();
            return;
        }
        const parts = authorization.split(" ");
        if (parts.length !== 2) {
            res.status(401).end();
            return;
        }
        if (parts[0] !== 'Bearer') {
            res.status(401).end();
            return;
        }
        const token = parts[1];
        const user = await UserService.getInstance().getUserByToken(token);
        if (user === undefined) {
            res.status(401).end();
            return;
        }
        req.user = user;
        next();
    }
}