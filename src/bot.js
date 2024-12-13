import express from 'express';
import { Client, GatewayIntentBits } from 'discord.js';
import { translateText } from './translations.js';  // Adjusted path for translations.js
import { logError } from './utils.js';  // Adjusted path for utils.js
import fetch from 'node-fetch';  // If you need to use fetch
import dotenv from 'dotenv';
dotenv.config();


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
client.login(process.env.DISCORD_BOT_TOKEN);

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
