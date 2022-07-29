import {config} from "dotenv";
import express from "express";
import http from "http";
import {UserController} from "./controlers/userController";
import {Presence} from "./models/Presence";
import {PresenceControler} from "./controlers/presence.controler";


config();

async function startServer(): Promise<void> {

    const db = require('./utils/mysql.connector');
    db.authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        }).catch((err: any) => {
        console.error('Unable to connect to the database:', err);
    });
    const port = process.env.PORT || 3000;
    const app = express();
    const httpServer = http.createServer(app);
    const io = require('socket.io')(httpServer, {
        cors: {origin: process.env.FRONT_URL}
    });

    let cors = require('cors');
    app.use(cors({origin: process.env.FRONT_URL}));

    const userController = new UserController();
    app.use('/user', userController.buildRoutes());

    const presenceController = new PresenceControler();
    app.use('/presence', presenceController.buildRoutes());

    httpServer.listen(port, () => console.log(`Listening on port ${port}`));
}

startServer().catch(console.error);
