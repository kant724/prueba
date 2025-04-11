import { PlayerScore, GameScore } from '../types';

export class StorageService {
    private readonly PLAYER_SCORES_KEY = 'bingo_player_scores';
    private readonly GAME_HISTORY_KEY = 'bingo_game_history';

    savePlayerScore(score: PlayerScore): void {
        const scores = this.getAllPlayerScores();
        const index = scores.findIndex(s => s.id === score.id);
        
        if (index >= 0) {
            scores[index] = score;
        } else {
            scores.push(score);
        }

        localStorage.setItem(this.PLAYER_SCORES_KEY, JSON.stringify(scores));
    }

    getPlayerScore(playerId: string): PlayerScore | null {
        const scores = this.getAllPlayerScores();
        return scores.find(s => s.id === playerId) || null;
    }

    getAllPlayerScores(): PlayerScore[] {
        const data = localStorage.getItem(this.PLAYER_SCORES_KEY);
        return data ? JSON.parse(data) : [];
    }

    saveGameHistory(game: GameScore): void {
        const history = this.getGameHistory();
        history.push(game);
        localStorage.setItem(this.GAME_HISTORY_KEY, JSON.stringify(history));
    }

    getGameHistory(): GameScore[] {
        const data = localStorage.getItem(this.GAME_HISTORY_KEY);
        return data ? JSON.parse(data) : [];
    }

    clearData(): void {
        localStorage.removeItem(this.PLAYER_SCORES_KEY);
        localStorage.removeItem(this.GAME_HISTORY_KEY);
    }
}
