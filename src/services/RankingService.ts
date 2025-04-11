import { StorageService } from './StorageService';
import { PlayerScore } from '../types';

export class RankingService {
    private static instance: RankingService;
    private storage: StorageService;

    private constructor() {
        this.storage = new StorageService();
    }

    static getInstance(): RankingService {
        if (!RankingService.instance) {
            RankingService.instance = new RankingService();
        }
        return RankingService.instance;
    }

    getGlobalRanking(limit: number = 10): PlayerScore[] {
        return this.storage.getAllPlayerScores()
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }

    getWeeklyRanking(): PlayerScore[] {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        return this.storage.getAllPlayerScores()
            .filter(score => new Date(score.lastUpdated) > weekAgo)
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);
    }

    getPatternRanking(pattern: string): PlayerScore[] {
        return this.storage.getAllPlayerScores()
            .sort((a, b) => (b.patterns[pattern] || 0) - (a.patterns[pattern] || 0))
            .slice(0, 10);
    }
}
