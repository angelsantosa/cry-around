import { ActivityMonitor, ActivityEvent } from '../types';
export declare class SteamMonitor implements ActivityMonitor {
    private checkInterval;
    private intervalId;
    private activityCallbacks;
    private runningGames;
    private isRunning;
    constructor(checkInterval?: number);
    private checkRunningProcesses;
    private triggerActivity;
    start(): Promise<void>;
    stop(): Promise<void>;
    onActivity(callback: (event: ActivityEvent) => void): void;
    addGame(gameName: string): void;
}
//# sourceMappingURL=steam.d.ts.map