import { User } from '../types';

export class SessionService {
    private static instance: SessionService;
    private sessions: Map<string, {
        user: User,
        lastActivity: Date,
        refreshToken: string
    }>;
    private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutos

    private constructor() {
        this.sessions = new Map();
        this.startCleanupInterval();
    }

    static getInstance(): SessionService {
        if (!SessionService.instance) {
            SessionService.instance = new SessionService();
        }
        return SessionService.instance;
    }

    createSession(user: User, refreshToken: string): void {
        this.sessions.set(user.id, {
            user,
            lastActivity: new Date(),
            refreshToken
        });
    }

    updateActivity(userId: string): void {
        const session = this.sessions.get(userId);
        if (session) {
            session.lastActivity = new Date();
        }
    }

    private startCleanupInterval(): void {
        setInterval(() => this.cleanupSessions(), this.SESSION_TIMEOUT);
    }

    private cleanupSessions(): void {
        const now = new Date();
        this.sessions.forEach((session, userId) => {
            if (now.getTime() - session.lastActivity.getTime() > this.SESSION_TIMEOUT) {
                this.sessions.delete(userId);
            }
        });
    }
}
