import express, {Request, Response, Router} from "express";
import {UserService} from "../services/user.service";
//import {checkUserConnected} from "../middlewares/auth.middleware";

export class UserControler {

    async createUser(req: Request, res: Response) {
        try {
            const user = await UserService.getInstance().subscribeUser({
                name: req.body.name,
                lastname: req.body.lastname,
                password: req.body.password,
                promo: req.body.promo,
                role: req.body.role,
                login: req.body.login
            });
            res.send({
                response: true
            });
        } catch (err) {
            res.status(400).send({
                response: false,
                message: err
            });
        }
    }

    async connexionUser(req: Request, res: Response) {
        try {
            const user = await UserService.getInstance().connexionUser({
                login: req.body.login,
                password: req.body.password
            });
            res.send({
                response: true,
                user: user
            });
        } catch (err) {
            res.status(400).send({
                response: false,
                message: err
            });
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.post('/subscribe', express.json(), this.createUser.bind(this));
        router.post('/connexion', express.json(), this.connexionUser.bind(this));
        return router;
    }
}