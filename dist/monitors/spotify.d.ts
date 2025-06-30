import { ActivityMonitor, ActivityEvent } from '../types';
export declare class SpotifyMonitor implements ActivityMonitor {
    private checkInterval;
    private intervalId;
    private activityCallbacks;
    private isSpotifyRunning;
    private isRunning;
    constructor(checkInterval?: number);
    private checkSpotifyStatus;
    private triggerActivity;
    start(): Promise<void>;
    stop(): Promise<void>;
    onActivity(callback: (event: ActivityEvent) => void): void;
}
//# sourceMappingURL=spotify.d.ts.map