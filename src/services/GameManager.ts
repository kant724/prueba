import { GameState, Player } from '../types';
import { CardGenerator } from './CardGenerator';
import { NumberDrawer } from '../utils/NumberDrawer';

export class GameManager {
    private players: Map<string, Player>;
    private state: GameState;
    private cardGenerator: CardGenerator;
    private numberDrawer: NumberDrawer;

    constructor() {
        this.players = new Map();
        this.state = {
            isStarted: false,
            currentNumber: null,
            drawnNumbers: new Set()
        };
        this.cardGenerator = new CardGenerator();
        this.numberDrawer = new NumberDrawer();
    }

    addPlayer(name: string): boolean {
        if (this.players.has(name)) return false;
        
        const player: Player = {
            name,
            card: this.cardGenerator.generateCard(),
            marks: new Set()
        };
        
        this.players.set(name, player);
        return true;
    }

    startGame(): boolean {
        if (this.players.size < 2 || this.state.isStarted) return false;
        
        this.state.isStarted = true;
        this.state.currentNumber = null;
        this.state.drawnNumbers.clear();
        this.numberDrawer.reset();
        return true;
    }

    drawNumber(): number | null {
        if (!this.state.isStarted) return null;

        const number = this.numberDrawer.drawNumber();
        if (number) {
            this.state.currentNumber = number;
            this.state.drawnNumbers.add(number);
            this.checkWinners(number);
        }
        return number;
    }

    private checkWinners(number: number): void {
        this.players.forEach(player => {
            if (this.hasNumberInCard(player.card, number)) {
                player.marks.add(number);
                if (this.checkBingo(player)) {
                    this.endGame(player);
                }
            }
        });
    }

    private hasNumberInCard(card: Player['card'], number: number): boolean {
        return card.some(row => row.includes(number));
    }

    private checkBingo(player: Player): boolean {
        // Implementar verificación de patrones ganadores
        return false;
    }

    private endGame(winner: Player): void {
        this.state.isStarted = false;
        // Implementar lógica de fin de juego
    }

    getState(): GameState {
        return { ...this.state };
    }

    getPlayers(): Map<string, Player> {
        return new Map(this.players);
    }
}
