import { loadConfig } from './config';
import { DiscordMonitor } from './monitors/discord';
import { SteamMonitor } from './monitors/steam';
import { TwilioNotificationService } from './services/twilio';
import { ActivityEvent } from './types';

class ActivityDaemon {
  private config: ReturnType<typeof loadConfig>;
  private discordMonitor: DiscordMonitor;
  private steamMonitor: SteamMonitor;
  private notificationService: TwilioNotificationService;
  private isRunning: boolean = false;

  constructor() {
    this.config = loadConfig();
    
    this.discordMonitor = new DiscordMonitor(
      this.config.discord.botToken,
      this.config.discord.userId,
      this.config.discord.guildId
    );

    this.steamMonitor = new SteamMonitor(this.config.app.checkInterval);
    
    this.notificationService = new TwilioNotificationService(
      this.config.twilio.accountSid,
      this.config.twilio.authToken,
      this.config.twilio.fromNumber,
      this.config.twilio.toNumber
    );

    this.setupActivityHandlers();
  }

  private setupActivityHandlers(): void {
    const handleActivity = async (event: ActivityEvent) => {
      try {
        const message = this.formatMessage(event);
        await this.notificationService.send(message);
      } catch (error) {
        console.error('❌ Failed to handle activity:', error);
      }
    };

    this.discordMonitor.onActivity(handleActivity);
    this.steamMonitor.onActivity(handleActivity);
  }

  private formatMessage(event: ActivityEvent): string {
    const { yourName } = this.config.app;
    
    switch (event.type) {
      case 'discord_join':
        return `${yourName} just joined ${event.details.channel} on Discord`;
      case 'discord_leave':
        return `${yourName} just left ${event.details.channel} on Discord`;
      case 'game_start':
        return `${yourName} just started playing ${event.details.game}`;
      case 'game_stop':
        return `${yourName} just stopped playing ${event.details.game}`;
      default:
        return `${yourName} had some activity`;
    }
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('⚠️  Daemon is already running');
      return;
    }

    console.log('🚀 Starting Activity Monitor Daemon...');
    
    try {
      // Start monitors
      await this.discordMonitor.start();
      await this.steamMonitor.start();
      
      this.isRunning = true;
      console.log('✅ Activity Monitor Daemon is now running');
      console.log('📱 Monitoring Discord voice activity and Steam games');
      console.log('💬 Sending notifications via Twilio');
      
      // Keep the process alive
      process.on('SIGINT', () => this.stop());
      process.on('SIGTERM', () => this.stop());
      
    } catch (error) {
      console.error('❌ Failed to start daemon:', error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    console.log('🛑 Stopping Activity Monitor Daemon...');
    
    try {
      await this.discordMonitor.stop();
      await this.steamMonitor.stop();
      
      this.isRunning = false;
      console.log('✅ Activity Monitor Daemon stopped');
      
      process.exit(0);
    } catch (error) {
      console.error('❌ Error stopping daemon:', error);
      process.exit(1);
    }
  }
}

// Main execution
async function main(): Promise<void> {
  try {
    const daemon = new ActivityDaemon();
    await daemon.start();
  } catch (error) {
    console.error('❌ Failed to start daemon:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main();
} 