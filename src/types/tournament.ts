export interface Tournament {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    status: 'upcoming' | 'active' | 'finished';
    participants: string[];
    rounds: TournamentRound[];
    prizePool: number;
    rules: TournamentRules;
}

export interface TournamentRound {
    roundNumber: number;
    matches: TournamentMatch[];
}

export interface TournamentMatch {
    id: string;
    player1: string;
    player2: string;
    winner?: string;
    gameId?: string;
}

export interface TournamentRules {
    minPlayers: number;
    maxPlayers: number;
    winningPatterns: string[];
    entryFee: number;
}
