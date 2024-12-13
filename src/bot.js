const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const { translateText } = require('./translations.js');  // Adjusted path for translations.js
const { config } = require('./config.js');  // Adjusted path for config.js
const { logError } = require('./utils.js');  // Adjusted path for utils.js

const app = express();
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

// Express route to keep the service active
app.get('/', (req, res) => {
    res.send('Bot is running!');
});

// Start Express server to listen on the required port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Web service running on port ${port}`);
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
