import { Request, Response } from 'express';
import { RankingService } from '../services/RankingService';

export class RankingController {
    private rankingService: RankingService;

    constructor() {
        this.rankingService = RankingService.getInstance();
    }

    async getGlobalRanking(req: Request, res: Response): Promise<void> {
        try {
            const limit = Number(req.query.limit) || 10;
            const ranking = this.rankingService.getGlobalRanking(limit);
            res.json(ranking);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getWeeklyRanking(req: Request, res: Response): Promise<void> {
        try {
            const ranking = this.rankingService.getWeeklyRanking();
            res.json(ranking);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
