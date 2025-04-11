import { GameEvent, GameEventType, GameEventListener } from '../types/events';

export class EventManager {
    private static instance: EventManager;
    private listeners: Map<GameEventType, Set<GameEventListener>>;

    private constructor() {
        this.listeners = new Map();
    }

    static getInstance(): EventManager {
        if (!EventManager.instance) {
            EventManager.instance = new EventManager();
        }
        return EventManager.instance;
    }

    emit<T>(type: GameEventType, payload: T): void {
        const event: GameEvent<T> = {
            type,
            payload,
            timestamp: new Date()
        };

        this.listeners.get(type)?.forEach(listener => {
            try {
                listener(event);
            } catch (error) {
                console.error(`Error en listener para evento ${type}:`, error);
            }
        });
    }

    on<T>(type: GameEventType, listener: GameEventListener<T>): () => void {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Set());
        }
        this.listeners.get(type)?.add(listener);

        // Retornar función para remover el listener
        return () => this.off(type, listener);
    }

    off(type: GameEventType, listener: GameEventListener): void {
        this.listeners.get(type)?.delete(listener);
    }
}
