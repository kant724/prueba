import { Tournament, TournamentMatch, TournamentRound } from '../types/tournament';
import { EventManager } from './EventManager';

export class TournamentService {
    private static instance: TournamentService;
    private tournaments: Map<string, Tournament>;
    private eventManager: EventManager;

    private constructor() {
        this.tournaments = new Map();
        this.eventManager = EventManager.getInstance();
    }

    static getInstance(): TournamentService {
        if (!TournamentService.instance) {
            TournamentService.instance = new TournamentService();
        }
        return TournamentService.instance;
    }

    createTournament(tournamentData: Partial<Tournament>): Tournament {
        const tournament: Tournament = {
            id: this.generateId(),
            name: tournamentData.name || 'Nuevo Torneo',
            startDate: tournamentData.startDate || new Date(),
            endDate: tournamentData.endDate || new Date(),
            status: 'upcoming',
            participants: [],
            rounds: [],
            prizePool: tournamentData.prizePool || 0,
            rules: tournamentData.rules || {
                minPlayers: 4,
                maxPlayers: 16,
                winningPatterns: ['Línea', 'Cartón Lleno'],
                entryFee: 100
            }
        };

        this.tournaments.set(tournament.id, tournament);
        return tournament;
    }

    private generateId(): string {
        return `T-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    generateBrackets(tournamentId: string): void {
        const tournament = this.tournaments.get(tournamentId);
        if (!tournament) throw new Error('Torneo no encontrado');

        const players = [...tournament.participants];
        const rounds: TournamentRound[] = [];
        
        // Generar rondas
        while (players.length > 1) {
            const matches: TournamentMatch[] = [];
            for (let i = 0; i < players.length; i += 2) {
                matches.push({
                    id: `M-${Date.now()}-${i}`,
                    player1: players[i],
                    player2: players[i + 1] || 'bye',
                    winner: undefined
                });
            }
            rounds.push({
                roundNumber: rounds.length + 1,
                matches
            });
            players.length = Math.ceil(players.length / 2);
        }

        tournament.rounds = rounds;
        this.tournaments.set(tournamentId, tournament);
    }

    distributePrizes(tournamentId: string): void {
        const tournament = this.tournaments.get(tournamentId);
        if (!tournament) throw new Error('Torneo no encontrado');

        const lastRound = tournament.rounds[tournament.rounds.length - 1];
        const winner = lastRound.matches[0].winner;
        const runnerUp = lastRound.matches[0].player1 === winner 
            ? lastRound.matches[0].player2 
            : lastRound.matches[0].player1;

        // Distribuir premios
        const prizes = {
            first: tournament.prizePool * 0.6,
            second: tournament.prizePool * 0.3,
            third: tournament.prizePool * 0.1
        };

        this.eventManager.emit('tournamentEnded', {
            tournamentId,
            winners: {
                first: { player: winner, prize: prizes.first },
                second: { player: runnerUp, prize: prizes.second }
            }
        });
    }
}
