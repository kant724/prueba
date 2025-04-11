export interface Achievement {
    id: string;
    name: string;
    description: string;
    requirement: AchievementRequirement;
    points: number;
    icon: string;
}

export interface AchievementRequirement {
    type: 'games_won' | 'patterns_completed' | 'tournaments_won' | 'score_reached';
    target: number;
    pattern?: string;
}

export interface PlayerAchievement {
    achievementId: string;
    unlockedAt: Date;
    progress: number;
}
