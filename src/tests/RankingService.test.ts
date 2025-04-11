import { RankingService } from '../services/RankingService';
import { StorageService } from '../services/StorageService';
import { PlayerScore } from '../types';

describe('RankingService', () => {
    let rankingService: RankingService;
    let storageService: StorageService;

    beforeEach(() => {
        rankingService = RankingService.getInstance();
        storageService = new StorageService();
        storageService.clearData();
    });

    test('debería obtener ranking global ordenado', () => {
        const testScores: PlayerScore[] = [
            { id: '1', username: 'user1', score: 100, gamesPlayed: 1, gamesWon: 1, patterns: {} },
            { id: '2', username: 'user2', score: 200, gamesPlayed: 2, gamesWon: 2, patterns: {} },
        ];
        
        testScores.forEach(score => storageService.savePlayerScore(score));
        const ranking = rankingService.getGlobalRanking();
        
        expect(ranking[0].score).toBe(200);
        expect(ranking[1].score).toBe(100);
    });
});
