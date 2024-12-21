import { translateText } from './translations.js';
import { transcribeVoice } from './transcribe.js';
import { logError, logInfo } from './utils.js';

// Handle live chat transcription and translation
async function handleLiveChat(voiceState) {
    try {
        logInfo(`User ${voiceState.member.user.username} joined the voice channel.`);
        const connection = await voiceState.channel.join();
        const transcriptionThread = await voiceState.channel.send('Transcribing live chat...');

        connection.on('speaking', async (user, speaking) => {
            if (speaking) {
                logInfo(`User ${user.username} is speaking...`);
                try {
                    const audioBuffer = await getAudioBuffer(user);  // Your method for getting audio buffer
                    const transcription = await transcribeVoice(user, audioBuffer);
                    const translatedText = await translateText(transcription);
                    transcriptionThread.send(`${user.username}: ${translatedText}`);
                } catch (error) {
                    logError(error, `Error transcribing or translating speech for ${user.username}`);
                }
            }
        });
    } catch (error) {
        logError(error, 'Error in live chat transcription');
    }
}

// Placeholder function to simulate audio buffer fetching (replace with your actual logic)
async function getAudioBuffer(user) {
    // Simulating audio buffer fetching logic
    return Buffer.from([]);
}

export { handleLiveChat };
