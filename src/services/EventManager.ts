import { GameEvent, GameEventType, GameEventListener } from '../types/events';

export class EventManagerError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'EventManagerError';
    }
}

export class EventManager {
    private static instance: EventManager;
    private listeners: Map<GameEventType, Set<GameEventListener>>;
    private eventLog: GameEvent[];
    private readonly MAX_LOG_SIZE = 1000;
    private readonly MAX_LISTENERS_PER_EVENT = 10;
    private lastCleanup: number = Date.now();
    private readonly CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutos

    private constructor() {
        this.listeners = new Map();
        this.eventLog = [];
        this.setupMemoryMonitoring();
    }

    private setupMemoryMonitoring(): void {
        setInterval(() => {
            this.cleanupOldEvents();
            this.checkMemoryUsage();
        }, this.CLEANUP_INTERVAL);
    }

    private cleanupOldEvents(): void {
        const now = Date.now();
        if (now - this.lastCleanup >= this.CLEANUP_INTERVAL) {
            this.eventLog = this.eventLog.filter(event => 
                now - event.timestamp.getTime() < this.CLEANUP_INTERVAL
            );
            this.lastCleanup = now;
        }
    }

    private checkMemoryUsage(): void {
        if (this.listeners.size > 100) {
            console.warn('Alto número de listeners detectado');
        }
    }

    static getInstance(): EventManager {
        if (!EventManager.instance) {
            EventManager.instance = new EventManager();
        }
        return EventManager.instance;
    }

    emit<T>(type: GameEventType, payload: T): void {
        try {
            this.validateEventType(type);
            this.validatePayload(payload);
            const event = this.createEvent(type, payload);
            this.logEvent(event);
            this.notifyListeners(event);
        } catch (error) {
            this.handleError('Error en emisión de evento:', error);
            throw new EventManagerError(`Error al emitir evento: ${error.message}`);
        }
    }

    private validateEventType(type: GameEventType): void {
        if (!type || !Object.values(GameEventType).includes(type)) {
            throw new EventManagerError('Tipo de evento inválido');
        }
    }

    private validatePayload<T>(payload: T): void {
        if (payload === undefined || payload === null) {
            throw new EventManagerError('Payload no puede ser null/undefined');
        }
    }

    private createEvent<T>(type: GameEventType, payload: T): GameEvent<T> {
        return {
            type,
            payload,
            timestamp: new Date(),
            id: this.generateEventId()
        };
    }

    private logEvent(event: GameEvent): void {
        this.eventLog.push(event);
        if (this.eventLog.length > this.MAX_LOG_SIZE) {
            this.eventLog.shift();
        }
    }

    getEventLog(): GameEvent[] {
        return [...this.eventLog];
    }

    private generateEventId(): string {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    private notifyListeners<T>(event: GameEvent<T>): void {
        const listeners = this.listeners.get(event.type);
        if (!listeners) return;

        listeners.forEach(listener => {
            try {
                listener(event);
            } catch (error) {
                console.error(`Error en listener para evento ${event.type}:`, error);
            }
        });
    }

    on<T>(type: GameEventType, listener: GameEventListener<T>): () => void {
        this.validateListenerCount(type);
        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Set());
        }
        this.listeners.get(type)?.add(listener);

        return () => {
            this.off(type, listener);
            this.cleanupEmptyListeners(type);
        };
    }

    private validateListenerCount(type: GameEventType): void {
        const currentListeners = this.listeners.get(type)?.size || 0;
        if (currentListeners >= this.MAX_LISTENERS_PER_EVENT) {
            throw new EventManagerError(
                `Máximo número de listeners (${this.MAX_LISTENERS_PER_EVENT}) alcanzado para el evento ${type}`
            );
        }
    }

    private cleanupEmptyListeners(type: GameEventType): void {
        if (this.listeners.get(type)?.size === 0) {
            this.listeners.delete(type);
        }
    }

    off(type: GameEventType, listener: GameEventListener): void {
        this.listeners.get(type)?.delete(listener);
    }

    getDebugInfo(): object {
        return {
            totalListeners: Array.from(this.listeners.values())
                .reduce((acc, set) => acc + set.size, 0),
            eventTypes: Array.from(this.listeners.keys()),
            logSize: this.eventLog.length,
            lastCleanup: new Date(this.lastCleanup)
        };
    }

    private handleError(message: string, error: any): void {
        console.error(message, error);
    }
}
