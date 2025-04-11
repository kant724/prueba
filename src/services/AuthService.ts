import { User } from '../types';
import { StorageService } from './StorageService';
import { EventManager } from './EventManager';
import { SessionService } from './SessionService';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SecurityValidator } from '../utils/SecurityValidator';

export class AuthService {
    private static instance: AuthService;
    private storage: StorageService;
    private eventManager: EventManager;
    private sessionService: SessionService;
    private activeUsers: Map<string, User>;
    private readonly JWT_SECRET = process.env.JWT_SECRET || 'bingo-secret-key';
    private readonly TOKEN_EXPIRY = '24h';

    private constructor() {
        this.storage = new StorageService();
        this.eventManager = EventManager.getInstance();
        this.sessionService = SessionService.getInstance();
        this.activeUsers = new Map();
    }

    static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    async login(email: string, password: string): Promise<{user: User, token: string, refreshToken: string}> {
        if (!SecurityValidator.validateEmail(email)) {
            throw new Error('Email inválido');
        }
        if (!SecurityValidator.validatePassword(password)) {
            throw new Error('Contraseña no cumple los requisitos mínimos');
        }

        const sanitizedEmail = SecurityValidator.sanitizeInput(email);
        const user = await this.validateUser(sanitizedEmail, password);
        const token = this.generateToken(user);
        const refreshToken = this.generateRefreshToken(user);
        
        this.activeUsers.set(user.id, user);
        this.eventManager.emit('userLoggedIn', { userId: user.id });
        this.sessionService.createSession(user, refreshToken);
        
        return { user, token, refreshToken };
    }

    async refreshToken(refreshToken: string): Promise<string | null> {
        if (!SecurityValidator.validateToken(refreshToken)) {
            throw new Error('Token inválido');
        }

        try {
            const decoded = jwt.verify(refreshToken, this.JWT_SECRET) as any;
            const user = this.getActiveUser(decoded.id);
            
            if (!user) return null;
            
            this.sessionService.updateActivity(user.id);
            return this.generateToken(user);
        } catch {
            return null;
        }
    }

    private async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    private generateToken(user: User): string {
        return jwt.sign(
            { id: user.id, email: user.email },
            this.JWT_SECRET,
            { expiresIn: this.TOKEN_EXPIRY }
        );
    }

    private generateRefreshToken(user: User): string {
        return jwt.sign(
            { id: user.id },
            this.JWT_SECRET,
            { expiresIn: '7d' }
        );
    }

    private validateCredentials(email: string, password: string): boolean {
        return email.includes('@') && password.length >= 6;
    }

    logout(userId: string): void {
        this.activeUsers.delete(userId);
        this.eventManager.emit('userLoggedOut', { userId });
    }

    getActiveUser(userId: string): User | undefined {
        return this.activeUsers.get(userId);
    }
}
