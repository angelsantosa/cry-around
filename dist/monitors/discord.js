"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordMonitor = void 0;
const discord_js_1 = require("discord.js");
class DiscordMonitor {
    constructor(botToken, userId, guildId) {
        this.activityCallbacks = [];
        this.lastVoiceState = null;
        this.client = new discord_js_1.Client({
            intents: [
                discord_js_1.GatewayIntentBits.Guilds,
                discord_js_1.GatewayIntentBits.GuildVoiceStates,
                discord_js_1.GatewayIntentBits.GuildPresences,
            ],
        });
        this.userId = userId;
        this.guildId = guildId;
        this.setupEventHandlers();
    }
    setupEventHandlers() {
        this.client.on('ready', () => {
            console.log(`🤖 Discord bot logged in as ${this.client.user?.tag}`);
        });
        this.client.on('voiceStateUpdate', (oldState, newState) => {
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
    handleVoiceStateChange(oldState, newState) {
        const wasInVoice = oldState.channelId !== null;
        const isInVoice = newState.channelId !== null;
        if (!wasInVoice && isInVoice) {
            // User joined a voice channel
            const event = {
                type: 'discord_join',
                timestamp: new Date(),
                details: {
                    channel: newState.channel?.name || 'Unknown Channel',
                },
            };
            this.triggerActivity(event);
        }
        else if (wasInVoice && !isInVoice) {
            // User left a voice channel
            const event = {
                type: 'discord_leave',
                timestamp: new Date(),
                details: {
                    channel: oldState.channel?.name || 'Unknown Channel',
                },
            };
            this.triggerActivity(event);
        }
    }
    triggerActivity(event) {
        console.log(`🎤 Discord activity: ${event.type} - ${event.details.channel}`);
        this.activityCallbacks.forEach(callback => callback(event));
    }
    async start() {
        try {
            await this.client.login(process.env.DISCORD_BOT_TOKEN);
            console.log('🎧 Discord monitor started');
        }
        catch (error) {
            console.error('❌ Failed to start Discord monitor:', error);
            throw error;
        }
    }
    async stop() {
        try {
            await this.client.destroy();
            console.log('🎧 Discord monitor stopped');
        }
        catch (error) {
            console.error('❌ Failed to stop Discord monitor:', error);
            throw error;
        }
    }
    onActivity(callback) {
        this.activityCallbacks.push(callback);
    }
}
exports.DiscordMonitor = DiscordMonitor;
//# sourceMappingURL=discord.js.map