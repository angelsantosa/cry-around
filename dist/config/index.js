"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = loadConfig;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function loadConfig() {
    const requiredEnvVars = [
        'DISCORD_BOT_TOKEN',
        'DISCORD_USER_ID',
        'DISCORD_GUILD_ID',
        'TWILIO_ACCOUNT_SID',
        'TWILIO_AUTH_TOKEN',
        'TWILIO_PHONE_NUMBER',
        'TARGET_PHONE_NUMBER',
        'YOUR_NAME'
    ];
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            throw new Error(`Missing required environment variable: ${envVar}`);
        }
    }
    return {
        discord: {
            botToken: process.env.DISCORD_BOT_TOKEN,
            userId: process.env.DISCORD_USER_ID,
            guildId: process.env.DISCORD_GUILD_ID,
        },
        twilio: {
            accountSid: process.env.TWILIO_ACCOUNT_SID,
            authToken: process.env.TWILIO_AUTH_TOKEN,
            fromNumber: process.env.TWILIO_PHONE_NUMBER,
            toNumber: process.env.TARGET_PHONE_NUMBER,
        },
        app: {
            yourName: process.env.YOUR_NAME,
            checkInterval: parseInt(process.env.CHECK_INTERVAL || '5000'),
        },
    };
}
//# sourceMappingURL=index.js.map