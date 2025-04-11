import { Request, Response } from 'express';
import { GameManager } from '../services/GameManager';
import { RoomManager } from '../services/RoomManager';

export class GameController {
    private gameManager: GameManager;
    private roomManager: RoomManager;

    constructor() {
        this.gameManager = new GameManager();
        this.roomManager = new RoomManager();
    }

    async createRoom(req: Request, res: Response): Promise<void> {
        try {
            const { config } = req.body;
            const room = await this.roomManager.createRoom(req.user, config);
            res.json(room);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async joinRoom(req: Request, res: Response): Promise<void> {
        try {
            const { roomId } = req.params;
            const result = await this.roomManager.joinRoom(roomId, req.user);
            res.json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async drawNumber(req: Request, res: Response): Promise<void> {
        try {
            const number = this.gameManager.drawNumber();
            res.json({ number });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
