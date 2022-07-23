import {config} from "dotenv";
import express from "express";
import http from "http";
import {db} from "./utils";

config();

async function startServer(): Promise<void> {

    db.connect();

    const port = process.env.PORT || 3000;
    const app = express();
    const httpServer = http.createServer(app);
    const io = require('socket.io')(httpServer, {
        cors: {origin: process.env.FRONT_URL}
    });

    let cors = require('cors');
    // use it before all route definitions
    app.use(cors({origin: process.env.FRONT_URL}));

    httpServer.listen(port, () => console.log(`Listening on port ${port}`));
    let userModel = require('./models/User');
    await userModel.createUser();
}


startServer().catch(console.error);
