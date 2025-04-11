import { StorageService } from './StorageService';
import fs from 'fs/promises';
import path from 'path';

export class BackupService {
    private static instance: BackupService;
    private storage: StorageService;
    private readonly BACKUP_DIR = 'backups';
    private readonly BACKUP_INTERVAL = 1000 * 60 * 60; // 1 hora

    private constructor() {
        this.storage = new StorageService();
        this.initialize();
    }

    static getInstance(): BackupService {
        if (!BackupService.instance) {
            BackupService.instance = new BackupService();
        }
        return BackupService.instance;
    }

    private async initialize(): Promise<void> {
        await this.ensureBackupDir();
        this.startAutoBackup();
    }

    private async ensureBackupDir(): Promise<void> {
        try {
            await fs.mkdir(this.BACKUP_DIR, { recursive: true });
        } catch (error) {
            console.error('Error creating backup directory:', error);
        }
    }

    private startAutoBackup(): void {
        setInterval(() => this.createBackup(), this.BACKUP_INTERVAL);
    }

    async createBackup(): Promise<string> {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `backup-${timestamp}.json`;
        const data = {
            playerScores: this.storage.getAllPlayerScores(),
            gameHistory: this.storage.getGameHistory(),
            timestamp
        };

        await fs.writeFile(
            path.join(this.BACKUP_DIR, filename),
            JSON.stringify(data, null, 2)
        );

        return filename;
    }

    async restoreFromBackup(filename: string): Promise<void> {
        const filePath = path.join(this.BACKUP_DIR, filename);
        const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));
        
        this.storage.clearData();
        data.playerScores.forEach(score => this.storage.savePlayerScore(score));
        data.gameHistory.forEach(game => this.storage.saveGameHistory(game));
    }
}
