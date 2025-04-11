export interface Notification {
    id: string;
    type: NotificationType;
    message: string;
    userId: string;
    read: boolean;
    createdAt: Date;
    data?: any;
}

export type NotificationType = 
    | 'achievement_unlocked'
    | 'game_invitation'
    | 'tournament_start'
    | 'winner_announcement'
    | 'system_alert';
