import {config} from "dotenv";
import express from "express";
import http from "http";


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
    // use it before all route definitions
    app.use(cors({origin: process.env.FRONT_URL}));

    httpServer.listen(port, () => console.log(`Listening on port ${port}`));
    const User = require('./models/User');
    await User.create({
        name: 'John',
        lastname: 'Doe',
        password: '123456',
        promo: '2018',
        role: 'admin'
    });
    console.log('User created');
}

startServer().catch(console.error);
