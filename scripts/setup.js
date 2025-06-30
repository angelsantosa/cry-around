#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setup() {
  console.log('🚀 Activity Monitor Daemon Setup\n');
  console.log('This script will help you create your .env file.\n');

  const envPath = path.join(__dirname, '..', '.env');
  const examplePath = path.join(__dirname, '..', 'env.example');

  // Check if .env already exists
  if (fs.existsSync(envPath)) {
    const overwrite = await question('.env file already exists. Overwrite? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Setup cancelled.');
      rl.close();
      return;
    }
  }

  console.log('📋 Discord Configuration:');
  const discordBotToken = await question('Discord Bot Token: ');
  const discordUserId = await question('Your Discord User ID: ');
  const discordGuildId = await question('Discord Server ID: ');

  console.log('\n📱 Twilio Configuration:');
  const twilioAccountSid = await question('Twilio Account SID: ');
  const twilioAuthToken = await question('Twilio Auth Token: ');
  const twilioPhoneNumber = await question('Twilio Phone Number: ');
  const targetPhoneNumber = await question('Target Phone Number: ');

  console.log('\n⚙️  Application Configuration:');
  const yourName = await question('Your Name: ');
  const checkInterval = await question('Check Interval (ms, default 5000): ') || '5000';

  const envContent = `# Discord Bot Configuration
DISCORD_BOT_TOKEN=${discordBotToken}
DISCORD_USER_ID=${discordUserId}
DISCORD_GUILD_ID=${discordGuildId}

# Twilio Configuration
TWILIO_ACCOUNT_SID=${twilioAccountSid}
TWILIO_AUTH_TOKEN=${twilioAuthToken}
TWILIO_PHONE_NUMBER=${twilioPhoneNumber}
TARGET_PHONE_NUMBER=${targetPhoneNumber}

# Application Configuration
YOUR_NAME=${yourName}
CHECK_INTERVAL=${checkInterval}
`;

  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ .env file created successfully!');
    console.log('\nNext steps:');
    console.log('1. Make sure your Discord bot is in your server');
    console.log('2. Run: npm run build');
    console.log('3. Run: npm start');
  } catch (error) {
    console.error('❌ Error creating .env file:', error.message);
  }

  rl.close();
}

setup().catch(console.error); 