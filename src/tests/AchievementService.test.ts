import { AchievementService } from '../services/AchievementService';
import { EventManager } from '../services/EventManager';
import { StorageService } from '../services/StorageService';

describe('AchievementService', () => {
    let achievementService: AchievementService;
    let eventManager: EventManager;
    let storageService: StorageService;

    beforeEach(() => {
        achievementService = AchievementService.getInstance();
        eventManager = EventManager.getInstance();
        storageService = new StorageService();
    });

    test('debería otorgar logro por primera victoria', async () => {
        const playerId = 'test-player';
        eventManager.emit('playerWon', { 
            playerId,
            pattern: 'Línea Horizontal' 
        });

        const achievements = await achievementService.getPlayerAchievements(playerId);
        expect(achievements).toContainEqual(
            expect.objectContaining({ id: 'FIRST_WIN' })
        );
    });

    test('debería actualizar progreso de logros', async () => {
        const playerId = 'test-player';
        const progress = await achievementService.getAchievementProgress(
            playerId,
            'MASTER'
        );
        expect(progress).toBeDefined();
        expect(progress.current).toBeLessThanOrEqual(progress.target);
    });
});
