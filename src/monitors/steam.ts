import psList from 'ps-list';
import { ActivityMonitor, ActivityEvent } from '../types';

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

export class SteamMonitor implements ActivityMonitor {
  private checkInterval: number;
  private intervalId: NodeJS.Timeout | null = null;
  private activityCallbacks: ((event: ActivityEvent) => void)[] = [];
  private runningGames: Set<string> = new Set();
  private isRunning: boolean = false;

  constructor(checkInterval: number = 5000) {
    this.checkInterval = checkInterval;
  }

  private async checkRunningProcesses(): Promise<void> {
    try {
      const processes = await psList();
      const currentGames = new Set<string>();

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
          const event: ActivityEvent = {
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
          const event: ActivityEvent = {
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
    } catch (error) {
      console.error('❌ Error checking processes:', error);
    }
  }

  private triggerActivity(event: ActivityEvent): void {
    console.log(`🎮 Game activity: ${event.type} - ${event.details.game}`);
    this.activityCallbacks.forEach(callback => callback(event));
  }

  async start(): Promise<void> {
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

  async stop(): Promise<void> {
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

  onActivity(callback: (event: ActivityEvent) => void): void {
    this.activityCallbacks.push(callback);
  }

  // Method to add custom games to monitor
  addGame(gameName: string): void {
    if (!STEAM_GAMES.includes(gameName)) {
      STEAM_GAMES.push(gameName);
      console.log(`🎮 Added game to monitor: ${gameName}`);
    }
  }
} 