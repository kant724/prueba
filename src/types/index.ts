export type BingoNumber = number | null;
export type BingoRow = BingoNumber[];
export type BingoCard = BingoRow[];

export interface Player {
    name: string;
    card: BingoCard;
    marks: Set<number>;
}

export interface GameState {
    isStarted: boolean;
    currentNumber: number | null;
    drawnNumbers: Set<number>;
}

export interface Room {
    id: string;
    name: string;
    host: string;
    players: Map<string, Player>;
    config: RoomConfig;
    state: RoomState;
}

export interface RoomConfig {
    maxPlayers: number;
    autoStart: boolean;
    winningPatterns: WinPattern[];
    cardPrice?: number;
    prizePool?: number;
}

export interface RoomState {
    status: 'waiting' | 'playing' | 'finished';
    winner?: Player;
    startTime?: Date;
    endTime?: Date;
}

export interface WinPattern {
    name: string;
    pattern: boolean[][];
    prize?: number;
}

export interface User {
    id: string;
    username: string;
    email: string;
    credits: number;
    activeRooms: string[];
    statistics: UserStats;
}

export interface UserStats {
    gamesPlayed: number;
    gamesWon: number;
    totalEarnings: number;
    favoriteRooms: string[];
}

export interface APIResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    timestamp: Date;
}
