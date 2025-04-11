export interface IStorageService {
    savePlayerScore(score: PlayerScore): void;
    getPlayerScore(playerId: string): PlayerScore | null;
    getAllPlayerScores(): PlayerScore[];
    saveGameHistory(game: GameScore): void;
    getGameHistory(): GameScore[];
    clearData(): void;
}

export interface IEventManager {
    emit<T>(type: GameEventType, payload: T): void;
    on<T>(type: GameEventType, listener: GameEventListener<T>): () => void;
    off(type: GameEventType, listener: GameEventListener): void;
}

export interface ILogger {
    log(level: LogLevel, message: string, context?: any): void;
    getHistory(): string[];
    clearHistory(): void;
}
