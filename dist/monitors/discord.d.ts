import { ActivityMonitor, ActivityEvent } from '../types';
export declare class DiscordMonitor implements ActivityMonitor {
    private client;
    private userId;
    private guildId;
    private activityCallbacks;
    private lastVoiceState;
    constructor(botToken: string, userId: string, guildId: string);
    private setupEventHandlers;
    private handleVoiceStateChange;
    private triggerActivity;
    start(): Promise<void>;
    stop(): Promise<void>;
    onActivity(callback: (event: ActivityEvent) => void): void;
}
//# sourceMappingURL=discord.d.ts.map