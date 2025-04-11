export enum LogLevel {
    DEBUG,
    INFO,
    WARN,
    ERROR
}

export class Logger {
    private static instance: Logger;
    private logHistory: string[] = [];

    private constructor() {}

    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    log(level: LogLevel, message: string, context?: any): void {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${LogLevel[level]}: ${message} ${context ? JSON.stringify(context) : ''}`;
        
        this.logHistory.push(logEntry);
        console.log(logEntry);
    }

    getHistory(): string[] {
        return [...this.logHistory];
    }

    clearHistory(): void {
        this.logHistory = [];
    }
}
