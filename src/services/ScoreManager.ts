import { PlayerScore, GameScore } from '../types';
import { StorageService } from './StorageService';

export class ScoreManager {
    private static readonly POINTS_CONFIG = {
        'Línea Horizontal': 100,
        'Línea Vertical': 100,
        'Cartón Lleno': 500,
        DEFAULT: 50
    };

    private storage: StorageService;

    constructor() {
        this.storage = new StorageService();
    }

    updateScore(gameScore: GameScore): PlayerScore {
        const playerScore = this.getPlayerScore(gameScore.winner);
        playerScore.gamesPlayed++;
        playerScore.gamesWon++;
        playerScore.score += this.calculatePoints(gameScore.pattern);
        playerScore.patterns[gameScore.pattern] = (playerScore.patterns[gameScore.pattern] || 0) + 1;
        
        this.storage.savePlayerScore(playerScore);
        this.saveGameHistory(gameScore);
        return playerScore;
    }

    private calculatePoints(pattern: string): number {
        return ScoreManager.POINTS_CONFIG[pattern] || ScoreManager.POINTS_CONFIG.DEFAULT;
    }

    getPlayerScore(playerId: string): PlayerScore {
        return this.storage.getPlayerScore(playerId) || this.createNewPlayerScore(playerId);
    }

    private createNewPlayerScore(playerId: string): PlayerScore {
        return {
            id: playerId,
            username: playerId,
            score: 0,
            gamesPlayed: 0,
            gamesWon: 0,
            patterns: {}
        };
    }

    getTopScores(limit: number = 10): PlayerScore[] {
        return this.storage.getAllPlayerScores()
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }
}
