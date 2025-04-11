import { GameState, Player } from '../types';
import { CardGenerator } from './CardGenerator';
import { NumberDrawer } from './NumberDrawer';

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

    // ...más métodos
}
