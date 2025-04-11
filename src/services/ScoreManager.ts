import { PlayerScore, GameScore } from '../types';
import { StorageService } from './StorageService';
import { Logger, LogLevel } from '../utils/Logger';

export class ScoreManagerError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ScoreManagerError';
    }
}

export class ScoreManager {
    private static readonly POINTS_CONFIG = {
        'Línea Horizontal': 100,
        'Línea Vertical': 100,
        'Cartón Lleno': 500,
        DEFAULT: 50
    };

    private storage: StorageService;
    private readonly logger = Logger.getInstance();

    constructor() {
        this.storage = new StorageService();
    }

    updateScore(gameScore: GameScore): PlayerScore {
        try {
            this.validateGameScore(gameScore);

            if (!this.isValidGameScore(gameScore)) {
                throw new ScoreManagerError('GameScore inválido o incompleto');
            }

            const playerScore = this.getPlayerScore(gameScore.winner);
            this.updatePlayerStats(playerScore, gameScore);
            this.saveScoreData(playerScore, gameScore);
            
            return playerScore;
        } catch (error) {
            this.logger.log(LogLevel.ERROR, 'Error actualizando puntuación', { error, gameScore });
            console.error('Error en updateScore:', error);
            throw new ScoreManagerError(`Error al actualizar puntuación: ${error.message}`);
        }
    }

    private validateGameScore(gameScore: GameScore): void {
        if (!gameScore) throw new Error('GameScore es requerido');
        if (typeof gameScore.winner !== 'string') throw new Error('Winner debe ser string');
        if (typeof gameScore.pattern !== 'string') throw new Error('Pattern debe ser string');
        if (!(gameScore.timestamp instanceof Date)) throw new Error('Timestamp debe ser Date');
    }

    private isValidGameScore(gameScore: GameScore): boolean {
        return Boolean(
            gameScore &&
            gameScore.winner &&
            gameScore.pattern &&
            gameScore.timestamp
        );
    }

    private updatePlayerStats(playerScore: PlayerScore, gameScore: GameScore): void {
        playerScore.gamesPlayed++;
        playerScore.gamesWon++;
        playerScore.score += this.calculatePoints(gameScore.pattern);
        playerScore.patterns[gameScore.pattern] = (playerScore.patterns[gameScore.pattern] || 0) + 1;
        playerScore.lastUpdated = new Date();
    }

    private saveScoreData(playerScore: PlayerScore, gameScore: GameScore): void {
        try {
            this.storage.savePlayerScore(playerScore);
            this.saveGameHistory(gameScore);
        } catch (error) {
            throw new ScoreManagerError(`Error al guardar datos: ${error.message}`);
        }
    }

    private calculatePoints(pattern: string): number {
        return ScoreManager.POINTS_CONFIG[pattern] || ScoreManager.POINTS_CONFIG.DEFAULT;
    }

    private saveGameHistory(gameScore: GameScore): void {
        try {
            this.storage.saveGameHistory(gameScore);
        } catch (error) {
            console.error('Error al guardar historial:', error);
            throw new ScoreManagerError('Error al guardar historial del juego');
        }
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
