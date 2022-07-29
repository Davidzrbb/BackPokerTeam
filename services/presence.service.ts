import {SecurityUtils} from "../utils";


const Presence = require('../models/Presence');
const User = require('../models/User');

export class PresenceService {

    private static instance?: PresenceService;

    public static getInstance(): PresenceService {
        if (PresenceService.instance === undefined) {
            PresenceService.instance = new PresenceService();
        }
        return PresenceService.instance;
    }

    private constructor() {
    }

    public async createPresence(presence: typeof Presence): Promise<typeof Presence> {
        if (!presence.idUser) {
            throw new Error("Missing parameters");
        }

        let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        let date = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 10).replace('T', ' ');

        let presenceExist = await Presence.findOne({where: {idUser: presence.idUser, dayPresence: new Date(date)}});
        if (presenceExist) {
            throw new Error("Presence already exist");
        }
        if (await User.findOne({where: {idUser: presence.idUser}})) {
            presence.createdAt = new Date(date);
            presence.updatedAt = new Date(date);
            presence.dayPresence = new Date(date);
            return await Presence.create(presence);
        } else {
            throw new Error("User doesn't exist");
        }
    }

    public async getPresenceByUserId(idUser: number): Promise<typeof Presence[]> {
        if (!idUser) {
            throw new Error("Missing parameters");
        }
        return await Presence.findAll({where: {idUser: idUser}});
    }

    async updatePresence(idPresence: number, step: number) {
        if (!idPresence) {
            throw new Error("Missing parameters");
        }
        if (!step) {
            throw new Error("Missing parameters");
        }
        if (step < 0 || step > 2) {
            throw new Error("Invalid parameters");
        }
        const presence = await Presence.findOne({where: {idPresence: idPresence}});
        if (presence) {
            return await Presence.update(
                {
                    validatePresence: step,
                    updatedAt: new Date()
                },
                {
                    where: {idPresence: idPresence},
                }
            );
        } else {
            throw new Error("Presence doesn't exist");
        }
    }

    async getAll() {
        return await Presence.findAll();
    }
}