export interface ActivityEvent {
    type: 'discord_join' | 'discord_leave' | 'game_start' | 'game_stop';
    timestamp: Date;
    details: {
        channel?: string;
        game?: string;
        process?: string;
    };
}
export interface NotificationService {
    send(message: string): Promise<void>;
}
export interface ActivityMonitor {
    start(): Promise<void>;
    stop(): Promise<void>;
    onActivity(callback: (event: ActivityEvent) => void): void;
}
export interface Config {
    discord: {
        botToken: string;
        userId: string;
        guildId: string;
    };
    twilio: {
        accountSid: string;
        authToken: string;
        fromNumber: string;
        toNumber: string;
    };
    app: {
        yourName: string;
        checkInterval: number;
    };
}
//# sourceMappingURL=index.d.ts.map