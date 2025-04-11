import WebSocket from 'ws';
import { EventManager } from './EventManager';
import { GameEvent } from '../types/events';

export class WebSocketService {
    private static instance: WebSocketService;
    private wss: WebSocket.Server;
    private clients: Map<string, WebSocket>;
    private eventManager: EventManager;

    private constructor() {
        this.wss = new WebSocket.Server({ port: 8080 });
        this.clients = new Map();
        this.eventManager = EventManager.getInstance();
        this.initialize();
    }

    static getInstance(): WebSocketService {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }

    private initialize(): void {
        this.setupWebSocketServer();
        this.setupEventListeners();
    }

    private setupWebSocketServer(): void {
        this.wss.on('connection', (ws: WebSocket, req) => {
            const userId = this.extractUserId(req);
            if (userId) {
                this.clients.set(userId, ws);
                this.setupClientHandlers(userId, ws);
            }
        });
    }

    private setupEventListeners(): void {
        this.eventManager.on('numberDrawn', this.broadcastGameEvent.bind(this));
        this.eventManager.on('playerWon', this.broadcastGameEvent.bind(this));
    }

    private broadcastGameEvent(event: GameEvent): void {
        this.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(event));
            }
        });
    }
}
