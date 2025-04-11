import { ScoreManager } from '../services/ScoreManager';
import { GameScore, PlayerScore } from '../types';

describe('ScoreManager', () => {
    let scoreManager: ScoreManager;
    
    beforeEach(() => {
        scoreManager = new ScoreManager();
    });

    test('should correctly update player score', () => {
        const gameScore: GameScore = {
            winner: 'player1',
            pattern: 'Línea Horizontal',
            timestamp: new Date(),
            players: ['player1', 'player2'],
            pointsAwarded: 100
        };

        const result = scoreManager.updateScore(gameScore);
        
        expect(result.gamesWon).toBe(1);
        expect(result.score).toBe(100);
        expect(result.patterns['Línea Horizontal']).toBe(1);
    });

    test('should throw error for invalid game score', () => {
        expect(() => {
            scoreManager.updateScore({} as GameScore);
        }).toThrow('GameScore inválido');
    });
});
