import psList from 'ps-list';
import { ActivityMonitor, ActivityEvent } from '../types';

export class SpotifyMonitor implements ActivityMonitor {
  private checkInterval: number;
  private intervalId: NodeJS.Timeout | null = null;
  private activityCallbacks: ((event: ActivityEvent) => void)[] = [];
  private isSpotifyRunning: boolean = false;
  private isRunning: boolean = false;

  constructor(checkInterval: number = 5000) {
    this.checkInterval = checkInterval;
  }

  private async checkSpotifyStatus(): Promise<void> {
    try {
      const processes = await psList();
      const spotifyProcess = processes.find(process => 
        process.name.toLowerCase().includes('spotify')
      );

      const currentlyRunning = !!spotifyProcess;

      if (currentlyRunning && !this.isSpotifyRunning) {
        // Spotify started
        const event: ActivityEvent = {
          type: 'game_start', // Reusing game_start for simplicity
          timestamp: new Date(),
          details: {
            game: 'Spotify',
            process: 'spotify.exe',
          },
        };
        this.triggerActivity(event);
      } else if (!currentlyRunning && this.isSpotifyRunning) {
        // Spotify stopped
        const event: ActivityEvent = {
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
    } catch (error) {
      console.error('❌ Error checking Spotify status:', error);
    }
  }

  private triggerActivity(event: ActivityEvent): void {
    console.log(`🎵 Spotify activity: ${event.type} - ${event.details.game}`);
    this.activityCallbacks.forEach(callback => callback(event));
  }

  async start(): Promise<void> {
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

  async stop(): Promise<void> {
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

  onActivity(callback: (event: ActivityEvent) => void): void {
    this.activityCallbacks.push(callback);
  }
} 