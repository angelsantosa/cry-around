"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpotifyMonitor = void 0;
const ps_list_1 = __importDefault(require("ps-list"));
class SpotifyMonitor {
    constructor(checkInterval = 5000) {
        this.intervalId = null;
        this.activityCallbacks = [];
        this.isSpotifyRunning = false;
        this.isRunning = false;
        this.checkInterval = checkInterval;
    }
    async checkSpotifyStatus() {
        try {
            const processes = await (0, ps_list_1.default)();
            const spotifyProcess = processes.find(process => process.name.toLowerCase().includes('spotify'));
            const currentlyRunning = !!spotifyProcess;
            if (currentlyRunning && !this.isSpotifyRunning) {
                // Spotify started
                const event = {
                    type: 'game_start', // Reusing game_start for simplicity
                    timestamp: new Date(),
                    details: {
                        game: 'Spotify',
                        process: 'spotify.exe',
                    },
                };
                this.triggerActivity(event);
            }
            else if (!currentlyRunning && this.isSpotifyRunning) {
                // Spotify stopped
                const event = {
                    type: 'game_stop', // Reusing game_stop for simplicity
                    timestamp: new Date(),
                    details: {
                        game: 'Spotify',
                        process: 'spotify.exe',
                    },
                };
                this.triggerActivity(event);
            }
            this.isSpotifyRunning = currentlyRunning;
        }
        catch (error) {
            console.error('❌ Error checking Spotify status:', error);
        }
    }
    triggerActivity(event) {
        console.log(`🎵 Spotify activity: ${event.type} - ${event.details.game}`);
        this.activityCallbacks.forEach(callback => callback(event));
    }
    async start() {
        if (this.isRunning) {
            return;
        }
        this.isRunning = true;
        console.log('🎵 Spotify monitor started');
        // Initial check
        await this.checkSpotifyStatus();
        // Set up periodic checking
        this.intervalId = setInterval(() => {
            this.checkSpotifyStatus();
        }, this.checkInterval);
    }
    async stop() {
        if (!this.isRunning) {
            return;
        }
        this.isRunning = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        console.log('🎵 Spotify monitor stopped');
    }
    onActivity(callback) {
        this.activityCallbacks.push(callback);
    }
}
exports.SpotifyMonitor = SpotifyMonitor;
//# sourceMappingURL=spotify.js.map