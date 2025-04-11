import { GameState, Player, WinPattern } from '../types';
import { CardGenerator } from './CardGenerator';
import { NumberDrawer } from '../utils/NumberDrawer';
import { PatternValidator } from './PatternValidator';
import { EventManager } from './EventManager';
import { ScoreManager } from './ScoreManager';

export class GameManager {
    private readonly MAX_RETRY_ATTEMPTS = 3;
    private backupState: GameState | null = null;
    private isProcessing: boolean = false;
    private operationQueue: Array<() => Promise<void>> = [];

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
        if (!name || typeof name !== 'string') {
            throw new Error('Nombre de jugador inválido');
        }
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
        try {
            this.backupCurrentState();
            if (!this.canStartGame()) {
                return false;
            }

            this.initializeGameState();
            this.eventManager.emit('gameStart', { 
                players: Array.from(this.players.keys()),
                timestamp: new Date()
            });
            return true;
        } catch (error) {
            this.restoreFromBackup();
            throw new GameManagerError(`Error al iniciar juego: ${error.message}`);
        }
    }

    private backupCurrentState(): void {
        this.backupState = {
            players: new Map(this.players),
            state: { ...this.state },
            currentNumber: this.state.currentNumber
        };
    }

    private restoreFromBackup(): void {
        if (this.backupState) {
            this.players = new Map(this.backupState.players);
            this.state = { ...this.backupState.state };
        }
    }

    private retryOperation<T>(operation: () => T, retries = this.MAX_RETRY_ATTEMPTS): T {
        let lastError;
        for (let i = 0; i < retries; i++) {
            try {
                return operation();
            } catch (error) {
                lastError = error;
                console.warn(`Intento ${i + 1} fallido:`, error);
            }
        }
        throw lastError;
    }

    async processOperation<T>(operation: () => Promise<T>): Promise<T> {
        if (this.isProcessing) {
            return new Promise((resolve, reject) => {
                this.operationQueue.push(async () => {
                    try {
                        const result = await operation();
                        resolve(result);
                    } catch (error) {
                        reject(error);
                    }
                });
            });
        }

        try {
            this.isProcessing = true;
            const result = await operation();
            return result;
        } finally {
            this.isProcessing = false;
            this.processQueue();
        }
    }

    private async processQueue(): Promise<void> {
        const nextOperation = this.operationQueue.shift();
        if (nextOperation) {
            await this.processOperation(nextOperation);
        }
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
        if (number < 1 || number > 75) {
            throw new Error('Número fuera de rango válido');
        }
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
