import { BackupService } from '../services/BackupService';
import { StorageService } from '../services/StorageService';
import fs from 'fs/promises';
import path from 'path';

describe('BackupService', () => {
    let backupService: BackupService;
    let storageService: StorageService;

    beforeEach(async () => {
        backupService = BackupService.getInstance();
        storageService = new StorageService();
    });

    afterEach(async () => {
        await fs.rm('backups', { recursive: true, force: true });
    });

    test('debería crear backup correctamente', async () => {
        const filename = await backupService.createBackup();
        const exists = await fs.stat(path.join('backups', filename))
            .then(() => true)
            .catch(() => false);
        expect(exists).toBe(true);
    });

    test('debería restaurar backup correctamente', async () => {
        const testData = {
            id: '1',
            username: 'test',
            score: 100
        };
        storageService.savePlayerScore(testData);
        const filename = await backupService.createBackup();
        storageService.clearData();
        await backupService.restoreFromBackup(filename);
        const restored = storageService.getPlayerScore('1');
        expect(restored).toEqual(testData);
    });
});
