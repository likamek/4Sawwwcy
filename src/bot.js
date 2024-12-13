const { Client, GatewayIntentBits } = require('discord.js');
const { translateText } = require('./src/translations');  // Adjusted path for translations.js
const { config } = require('./src/config');  // Adjusted path for config.js
const { logError } = require('./src/utils');  // Adjusted path for utils.js

// Initialize Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

// Login to Discord with your app's token
client.login(config.DISCORD_BOT_TOKEN);

// Handle incoming messages
client.on('messageCreate', async (message) => {
    try {
        if (message.author.bot) return; // Ignore bot messages

        // Auto-detect language and translate the message
        if (message.content) {
            await translateText(message);
        }

    } catch (error) {
        logError(error, 'Error processing message');
    }
});
