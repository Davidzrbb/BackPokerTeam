import express, {Request, Response, Router} from "express";
import {checkUserConnected} from "../middleware/checkUserConnected";
import {PresenceService} from "../services/presence.service";
import {checkAdminConnected} from "../middleware/checkAdminConnected";

//import {checkUserConnected} from "../middlewares/auth.middleware";

export class PresenceControler {

    async createPresence(req: Request, res: Response) {
        try {
            await PresenceService.getInstance().createPresence({
                idUser: req.body.idUser,
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

    async getPresenceByUser(req: Request, res: Response) {
        try {
            const presence = await PresenceService.getInstance().getPresenceByUserId(parseInt(req.params.idUser));
            res.send({
                response: true,
                presence: presence
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

    async getAll(req: Request, res: Response) {
        try {
            const presence = await PresenceService.getInstance().getAll();
            res.send({
                response: true,
                presence: presence
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

    async updatePresence(req: Request, res: Response) {
        try {
            await PresenceService.getInstance().updatePresence(parseInt(req.params.idPresence), req.body.step);
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

    buildRoutes(): Router {
        const router = express.Router();
        router.post('/create', checkUserConnected(), express.json(), this.createPresence.bind(this));
        router.get('/getById/:idUser', checkUserConnected(), this.getPresenceByUser.bind(this));
        router.put('/update/:idPresence', checkAdminConnected(), express.json(), this.updatePresence.bind(this));
        router.get('/all', checkAdminConnected(), this.getAll.bind(this));
        return router;
    }
}