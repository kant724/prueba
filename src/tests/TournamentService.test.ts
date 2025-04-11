import { TournamentService } from '../services/TournamentService';
import { Tournament } from '../types/tournament';

describe('TournamentService', () => {
    let tournamentService: TournamentService;

    beforeEach(() => {
        tournamentService = TournamentService.getInstance();
    });

    test('debería crear un torneo correctamente', () => {
        const tournamentData = {
            name: 'Torneo Test',
            prizePool: 1000,
            rules: {
                minPlayers: 4,
                maxPlayers: 8,
                winningPatterns: ['Línea'],
                entryFee: 100
            }
        };

        const tournament = tournamentService.createTournament(tournamentData);
        expect(tournament.name).toBe('Torneo Test');
        expect(tournament.status).toBe('upcoming');
    });

    test('debería generar brackets correctamente', () => {
        const tournament = tournamentService.createTournament({
            name: 'Torneo Brackets'
        });
        
        // Agregar participantes
        const players = ['player1', 'player2', 'player3', 'player4'];
        players.forEach(p => tournament.participants.push(p));

        tournamentService.generateBrackets(tournament.id);
        expect(tournament.rounds.length).toBeGreaterThan(0);
        expect(tournament.rounds[0].matches.length).toBe(2);
    });

    test('debería distribuir premios correctamente', () => {
        const tournament = tournamentService.createTournament({
            name: 'Torneo Premios',
            prizePool: 1000
        });

        tournamentService.generateBrackets(tournament.id);
        tournamentService.distributePrizes(tournament.id);
        
        // Verificar distribución de premios
        const lastRound = tournament.rounds[tournament.rounds.length - 1];
        expect(lastRound.matches[0].winner).toBeDefined();
    });
});
