import express, {Request, Response, Router} from "express";
import {UserService} from "../services/user.service";
import {checkUserConnected} from "../middleware/checkUserConnected";

//import {checkUserConnected} from "../middlewares/auth.middleware";

export class UserController {

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
            console.log(err);
            let message = "" + err;
            res.status(400).send({
                response: false,
                message: message
            });
        }
    }

    async connexionUser(req: Request, res: Response) {
        try {
            const session = await UserService.getInstance().connexionUser({
                login: req.body.login,
                password: req.body.password
            });
            res.send({
                response: true,
                connexion: session
            });
        } catch (err) {
            console.log(err);
            let message = "" + err;
            res.status(400).send({
                response: false,
                message: message
            });
        }
    }

    async me(req: Request, res: Response) {
        res.json(req.user);
    }

    async getUserById(req: Request, res: Response) {
        try {
            const user = await UserService.getInstance().getUserById(parseInt(req.params.idUser));
            res.send({
                response: true,
                user: user
            });
        } catch (err) {
            console.log(err);
            let message = "" + err;
            res.status(400).send({
                response: false,
                message: message
            });
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.post('/subscribe', express.json(), this.createUser.bind(this));
        router.post('/connexion', express.json(), this.connexionUser.bind(this));
        router.get('/me', checkUserConnected(), this.me.bind(this));
        router.get('/getById/:idUser', checkUserConnected(), this.getUserById.bind(this));
        return router;
    }
}