import { Client, GatewayIntentBits, GuildMember, VoiceState } from 'discord.js';
import { ActivityMonitor, ActivityEvent } from '../types';

export class DiscordMonitor implements ActivityMonitor {
  private client: Client;
  private userId: string;
  private guildId: string;
  private activityCallbacks: ((event: ActivityEvent) => void)[] = [];
  private lastVoiceState: VoiceState | null = null;

  constructor(botToken: string, userId: string, guildId: string) {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
      ],
    });
    this.userId = userId;
    this.guildId = guildId;

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.client.on('ready', () => {
      console.log(`🤖 Discord bot logged in as ${this.client.user?.tag}`);
    });

    this.client.on('voiceStateUpdate', (oldState: VoiceState, newState: VoiceState) => {
      // Only monitor the specific user
      if (oldState.member?.id !== this.userId && newState.member?.id !== this.userId) {
        return;
      }

      // Only monitor the specific guild
      if (oldState.guild.id !== this.guildId && newState.guild.id !== this.guildId) {
        return;
      }

      this.handleVoiceStateChange(oldState, newState);
    });

    this.client.on('error', (error) => {
      console.error('❌ Discord client error:', error);
    });
  }

  private handleVoiceStateChange(oldState: VoiceState, newState: VoiceState): void {
    const wasInVoice = oldState.channelId !== null;
    const isInVoice = newState.channelId !== null;

    if (!wasInVoice && isInVoice) {
      // User joined a voice channel
      const event: ActivityEvent = {
        type: 'discord_join',
        timestamp: new Date(),
        details: {
          channel: newState.channel?.name || 'Unknown Channel',
        },
      };
      this.triggerActivity(event);
    } else if (wasInVoice && !isInVoice) {
      // User left a voice channel
      const event: ActivityEvent = {
        type: 'discord_leave',
        timestamp: new Date(),
        details: {
          channel: oldState.channel?.name || 'Unknown Channel',
        },
      };
      this.triggerActivity(event);
    }
  }

  private triggerActivity(event: ActivityEvent): void {
    console.log(`🎤 Discord activity: ${event.type} - ${event.details.channel}`);
    this.activityCallbacks.forEach(callback => callback(event));
  }

  async start(): Promise<void> {
    try {
      await this.client.login(process.env.DISCORD_BOT_TOKEN);
      console.log('🎧 Discord monitor started');
    } catch (error) {
      console.error('❌ Failed to start Discord monitor:', error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    try {
      await this.client.destroy();
      console.log('🎧 Discord monitor stopped');
    } catch (error) {
      console.error('❌ Failed to stop Discord monitor:', error);
      throw error;
    }
  }

  onActivity(callback: (event: ActivityEvent) => void): void {
    this.activityCallbacks.push(callback);
  }
} 