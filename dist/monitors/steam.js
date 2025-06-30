"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SteamMonitor = void 0;
const ps_list_1 = __importDefault(require("ps-list"));
// Common Steam game executable names
const STEAM_GAMES = [
    // Popular games - you can add more
    'cs2.exe', 'csgo.exe', 'dota2.exe', 'steam.exe',
    'hl2.exe', 'portal2.exe', 'tf2.exe', 'gmod.exe',
    'minecraft.exe', 'javaw.exe', // Minecraft
    'spotify.exe', // Spotify (if you want to monitor this too)
    'discord.exe', // Discord desktop app
    'chrome.exe', 'firefox.exe', // Browsers
    'code.exe', 'vscode.exe', // VS Code
    'slack.exe', 'teams.exe', // Communication apps
];
class SteamMonitor {
    constructor(checkInterval = 5000) {
        this.intervalId = null;
        this.activityCallbacks = [];
        this.runningGames = new Set();
        this.isRunning = false;
        this.checkInterval = checkInterval;
    }
    async checkRunningProcesses() {
        try {
            const processes = await (0, ps_list_1.default)();
            const currentGames = new Set();
            for (const process of processes) {
                const processName = process.name.toLowerCase();
                for (const game of STEAM_GAMES) {
                    if (processName.includes(game.toLowerCase())) {
                        currentGames.add(game);
                        break;
                    }
                }
            }
            // Check for newly started games
            for (const game of currentGames) {
                if (!this.runningGames.has(game)) {
                    const event = {
                        type: 'game_start',
                        timestamp: new Date(),
                        details: {
                            game: game,
                            process: game,
                        },
                    };
                    this.triggerActivity(event);
                }
            }
            // Check for stopped games
            for (const game of this.runningGames) {
                if (!currentGames.has(game)) {
                    const event = {
                        type: 'game_stop',
                        timestamp: new Date(),
                        details: {
                            game: game,
                            process: game,
                        },
                    };
                    this.triggerActivity(event);
                }
            }
            this.runningGames = currentGames;
        }
        catch (error) {
            console.error('❌ Error checking processes:', error);
        }
    }
    triggerActivity(event) {
        console.log(`🎮 Game activity: ${event.type} - ${event.details.game}`);
        this.activityCallbacks.forEach(callback => callback(event));
    }
    async start() {
        if (this.isRunning) {
            return;
        }
        this.isRunning = true;
        console.log('🎮 Steam monitor started');
        // Initial check
        await this.checkRunningProcesses();
        // Set up periodic checking
        this.intervalId = setInterval(() => {
            this.checkRunningProcesses();
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
        console.log('🎮 Steam monitor stopped');
    }
    onActivity(callback) {
        this.activityCallbacks.push(callback);
    }
    // Method to add custom games to monitor
    addGame(gameName) {
        if (!STEAM_GAMES.includes(gameName)) {
            STEAM_GAMES.push(gameName);
            console.log(`🎮 Added game to monitor: ${gameName}`);
        }
    }
}
exports.SteamMonitor = SteamMonitor;
//# sourceMappingURL=steam.js.map