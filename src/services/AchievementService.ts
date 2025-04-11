import { Achievement, PlayerAchievement } from '../types/achievements';
import { EventManager } from './EventManager';
import { StorageService } from './StorageService';

export class AchievementService {
    private static instance: AchievementService;
    private achievements: Map<string, Achievement>;
    private eventManager: EventManager;
    private storage: StorageService;

    private constructor() {
        this.achievements = this.initializeAchievements();
        this.eventManager = EventManager.getInstance();
        this.storage = new StorageService();
        this.setupEventListeners();
    }

    private initializeAchievements(): Map<string, Achievement> {
        const achievements = new Map<string, Achievement>();
        
        achievements.set('FIRST_WIN', {
            id: 'FIRST_WIN',
            name: 'Primera Victoria',
            description: 'Gana tu primera partida',
            requirement: { type: 'games_won', target: 1 },
            points: 100,
            icon: '🏆'
        });

        achievements.set('MASTER', {
            id: 'MASTER',
            name: 'Maestro del Bingo',
            description: 'Gana 50 partidas',
            requirement: { type: 'games_won', target: 50 },
            points: 1000,
            icon: '👑'
        });

        return achievements;
    }

    private setupEventListeners(): void {
        this.eventManager.on('playerWon', this.checkAchievements.bind(this));
        this.eventManager.on('tournamentEnded', this.checkAchievements.bind(this));
    }

    private async checkAchievements(event: any): Promise<void> {
        const playerId = event.payload.playerId;
        const playerStats = await this.storage.getPlayerScore(playerId);
        
        this.achievements.forEach(achievement => {
            this.checkAchievement(playerId, achievement, playerStats);
        });
    }
}
