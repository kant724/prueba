import { Notification, NotificationType } from '../types/notifications';
import { WebSocketService } from './WebSocketService';
import { EventManager } from './EventManager';

export class NotificationService {
    private static instance: NotificationService;
    private notifications: Map<string, Notification[]>;
    private wsService: WebSocketService;
    private eventManager: EventManager;

    private constructor() {
        this.notifications = new Map();
        this.wsService = WebSocketService.getInstance();
        this.eventManager = EventManager.getInstance();
        this.setupEventListeners();
    }

    static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    private setupEventListeners(): void {
        this.eventManager.on('achievementUnlocked', this.handleAchievement.bind(this));
        this.eventManager.on('gameInvitation', this.handleGameInvite.bind(this));
    }

    async sendNotification(userId: string, type: NotificationType, message: string, data?: any): Promise<void> {
        const notification: Notification = {
            id: `not-${Date.now()}`,
            type,
            message,
            userId,
            read: false,
            createdAt: new Date(),
            data
        };

        this.storeNotification(notification);
        this.wsService.sendToUser(userId, 'notification', notification);
    }
}
