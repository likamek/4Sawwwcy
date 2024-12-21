import { translateText } from './translations.js'; // Adjusted path for translations.js
import { transcribeVoice } from './transcribe.js'; // Adjusted path for transcribe.js
import { logError, logInfo } from './utils.js';  // Adjusted path for utils.js

// Handle live chat transcription and translation
async function handleLiveChat(voiceState) {
    try {
        logInfo(`Joining voice channel: ${voiceState.channel.name}`);
        const connection = await voiceState.channel.join();
        const transcriptionThread = await voiceState.channel.send('Transcribing live chat...');

        connection.on('speaking', async (user, speaking) => {
            if (speaking) {
                try {
                    logInfo(`Transcribing voice for user: ${user.username}`);
                    const audioBuffer = await getAudioBuffer(user);  // Your method for getting audio buffer
                    const transcription = await transcribeVoice(user, audioBuffer);
                    const translatedText = await translateText(transcription);
                    transcriptionThread.send(`${user.username}: ${translatedText}`);
                } catch (error) {
                    logError(error, `Error processing voice for user: ${user.username}`);
                }
            }
        });
    } catch (error) {
        logError(error, 'Error in live chat transcription');
    }
}

export { handleLiveChat };
