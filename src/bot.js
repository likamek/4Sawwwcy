import { Client, GatewayIntentBits } from 'discord.js';
import { transcribeVoice } from './transcribe.js';
import { translateText } from './translations.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.VoiceStates] });

client.on('messageCreate', async (message) => {
    try {
        if (message.content.startsWith('!translate')) {
            await translateText(message); // Handle text translation
        }
    } catch (error) {
        console.error('Error in message handler:', error);
    }
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    try {
        if (newState.channel && oldState.channel !== newState.channel) {
            const audioBuffer = await getAudioBuffer(newState);  // Adjust to get audio buffer from voice chat
            const transcription = await transcribeVoice(newState.member, audioBuffer);
            console.log('Transcription:', transcription);
        }
    } catch (error) {
        console.error('Error in voice state update handler:', error);
    }
});

client.login('YOUR_BOT_TOKEN');  // Replace with your bot's token
