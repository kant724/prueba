import { GameState, Player, WinPattern } from '../types';
import { CardGenerator } from './CardGenerator';
import { NumberDrawer } from '../utils/NumberDrawer';
import { PatternValidator } from './PatternValidator';
import { EventManager } from './EventManager';
import { ScoreManager } from './ScoreManager';

export class GameManager {
    private players: Map<string, Player>;
    private state: GameState;
    private cardGenerator: CardGenerator;
    private numberDrawer: NumberDrawer;
    private patternValidator: PatternValidator;
    private eventManager: EventManager;
    private scoreManager: ScoreManager;

    constructor() {
        this.players = new Map();
        this.state = {
            isStarted: false,
            currentNumber: null,
            drawnNumbers: new Set()
        };
        this.cardGenerator = new CardGenerator();
        this.numberDrawer = new NumberDrawer();
        this.patternValidator = new PatternValidator();
        this.eventManager = EventManager.getInstance();
        this.scoreManager = new ScoreManager();
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        this.eventManager.on('numberDrawn', (event) => {
            this.checkWinners(event.payload.number);
        });

        this.eventManager.on('patternSelected', (event) => {
            if (typeof event.payload === 'object' && event.payload !== null && 'patterns' in event.payload) {
                this.updateWinningPatterns((event.payload as { patterns: WinPattern[] }).patterns);
            }
        });
    }

    addPlayer(name: string): boolean {
        if (this.players.has(name)) return false;
        
        const player: Player = {
            name,
            card: this.cardGenerator.generateCard(),
            marks: new Set()
        };
        
        this.players.set(name, player);
        this.eventManager.emit('playerJoined', { name });
        return true;
    }

    startGame(): boolean {
        if (this.players.size < 2 || this.state.isStarted) return false;
        
        this.state.isStarted = true;
        this.state.currentNumber = null;
        this.state.drawnNumbers.clear();
        this.numberDrawer.reset();
        this.eventManager.emit('gameStart', { players: Array.from(this.players.keys()) });
        return true;
    }

    drawNumber(): number | null {
        if (!this.state.isStarted) return null;

        const number = this.numberDrawer.drawNumber();
        if (number) {
            this.state.currentNumber = number;
            this.state.drawnNumbers.add(number);
            this.eventManager.emit('numberDrawn', { number });
        }
        return number;
    }

    private checkWinners(number: number): void {
        this.players.forEach(player => {
            if (this.hasNumberInCard(player.card, number)) {
                player.marks.add(number);
                const winningPattern = this.patternValidator.checkWinner(player.card, player.marks);
                if (winningPattern) {
                    this.endGame(player, winningPattern);
                }
            }
        });
    }

    private hasNumberInCard(card: Player['card'], number: number): boolean {
        return card.some(row => row.includes(number));
    }

    private endGame(winner: Player, pattern: WinPattern): void {
        this.state.isStarted = false;
        
        const gameScore = {
            timestamp: new Date(),
            winner: winner.name,
            pattern: pattern.name,
            players: Array.from(this.players.keys()),
            pointsAwarded: 0
        };

        const playerScore = this.scoreManager.updateScore(gameScore);
        this.eventManager.emit('gameEnd', { winner, pattern, score: playerScore });
    }

    getState(): GameState {
        return { ...this.state };
    }

    getPlayers(): Map<string, Player> {
        return new Map(this.players);
    }
}
