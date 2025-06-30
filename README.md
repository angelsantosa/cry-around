# Activity Monitor Daemon

A TypeScript daemon that monitors Discord voice activity and Steam game launches, then sends notifications via WhatsApp/SMS using Twilio.

## Features

- 🎤 **Discord Voice Monitoring**: Detects when you join or leave voice channels
- 🎮 **Steam Game Monitoring**: Detects when you start or stop playing games
- 📱 **SMS/WhatsApp Notifications**: Sends messages via Twilio
- 🔧 **Extensible**: Easy to add more triggers (Minecraft, Spotify, etc.)
- 🚀 **Background Daemon**: Runs continuously in the background

## Prerequisites

- Node.js 16+ and npm
- Discord Bot Token (with appropriate permissions)
- Twilio Account (for SMS/WhatsApp notifications)
- Your Discord User ID and Server ID

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to "Bot" section and create a bot
4. Enable these permissions:
   - Read Messages/View Channels
   - Voice States
   - Presence Intent
5. Copy the bot token
6. Invite the bot to your server with appropriate permissions

### 3. Get Your Discord IDs

- **User ID**: Right-click your username → Copy ID
- **Server ID**: Right-click server name → Copy ID

### 4. Setup Twilio

1. Create a [Twilio account](https://www.twilio.com/)
2. Get your Account SID and Auth Token
3. Get a Twilio phone number
4. For WhatsApp, you'll need to use the Twilio WhatsApp sandbox initially

### 5. Configure Environment

Copy the example environment file and fill in your details:

```bash
cp env.example .env
```

Edit `.env` with your actual values:

```env
# Discord Bot Configuration
DISCORD_BOT_TOKEN=your_discord_bot_token_here
DISCORD_USER_ID=your_discord_user_id_here
DISCORD_GUILD_ID=your_discord_server_id_here

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here
TARGET_PHONE_NUMBER=your_target_phone_number_here

# Application Configuration
YOUR_NAME=YourName
CHECK_INTERVAL=5000
```

## Usage

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
# Build the project
npm run build

# Start the daemon
npm start
```

### Background Service (macOS/Linux)

You can run it as a background service using `pm2`:

```bash
# Install pm2 globally
npm install -g pm2

# Start the daemon
pm2 start dist/index.js --name activity-monitor

# Monitor logs
pm2 logs activity-monitor

# Stop the daemon
pm2 stop activity-monitor
```

## 🪟 Windows Usage

### Running the Daemon

You can run the daemon in Command Prompt or PowerShell:

```sh
npm run dev
```

or, for production:

```sh
npm run build
npm start
```

### Running as a Background Service

#### Using pm2

1. Install pm2 globally:
   ```sh
   npm install -g pm2
   ```
2. Start the daemon:
   ```sh
   pm2 start dist/index.js --name activity-monitor
   ```
3. To make pm2 auto-start on boot:
   ```sh
   pm2 startup
   pm2 save
   ```
4. To view logs:
   ```sh
   pm2 logs activity-monitor
   ```
5. To stop the daemon:
   ```sh
   pm2 stop activity-monitor
   ```

#### Using nssm

1. Download and install [nssm](https://nssm.cc/download).
2. Open Command Prompt as Administrator.
3. Install the service:
   ```sh
   nssm install ActivityMonitorDaemon "C:\\Program Files\\nodejs\\node.exe" "C:\\path\\to\\your\\project\\dist\\index.js"
   ```
4. Start the service:
   ```sh
   nssm start ActivityMonitorDaemon
   ```
5. To stop/remove:
   ```sh
   nssm stop ActivityMonitorDaemon
   nssm remove ActivityMonitorDaemon
   ```

### Environment Variables

- Use a `.env` file in your project root, or set environment variables in Windows system settings.

### Process Monitoring Permissions

- If Steam/game detection does not work, try running your terminal as **Administrator**.
- Whitelist your project folder in your antivirus/security software if needed.

## Adding More Triggers

The system is designed to be easily extensible. To add more triggers:

1. Create a new monitor class implementing `ActivityMonitor`
2. Add it to the main daemon in `src/index.ts`
3. Update the message formatting logic

Example for adding Spotify monitoring:

```typescript
// src/monitors/spotify.ts
export class SpotifyMonitor implements ActivityMonitor {
  // Implementation here
}

// In src/index.ts, add:
private spotifyMonitor: SpotifyMonitor;

// Initialize and start it
```

## Customizing Game Detection

Edit `src/monitors/steam.ts` to add more games to monitor:

```typescript
const STEAM_GAMES = [
  // Add your games here
  'your-game.exe',
  'another-game.exe',
];
```

## Troubleshooting

### Discord Bot Issues
- Ensure the bot has the correct permissions
- Check that the bot is in your server
- Verify your User ID and Server ID are correct

### Twilio Issues
- Verify your Account SID and Auth Token
- Check that your Twilio number is active
- For WhatsApp, you may need to join the Twilio sandbox first

### Process Monitoring Issues
- On macOS, you might need to grant accessibility permissions
- Some games might use different executable names

## License

MIT License - feel free to modify and distribute as needed.

## Contributing

Feel free to submit issues and enhancement requests! 