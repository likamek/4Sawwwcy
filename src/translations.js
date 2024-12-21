import fs from 'fs';
import { downloadAndExtractModel } from './download.js';  // Ensure this path is correct

const modelUrl = 'https://drive.google.com/uc?id=18fjbBxu5jMsrU50QBqfAWQyJLYn98b9a';
const modelDir = './models';  // Folder to store the model

async function translateText(message) {
    try {
        const targetLanguage = message.author.preferredLocale || 'en'; // Detect user's system language
        const sourceLanguage = detectLanguage(message.content); // Detect source language

        if (sourceLanguage === targetLanguage) return; // Skip if languages match

        console.log(`Processing message: "${message.content}" from ${sourceLanguage} to ${targetLanguage}`);

        // Ensure the model is downloaded and extracted
        if (!fs.existsSync(modelDir)) {
            console.log('Model directory not found. Creating and downloading model.');
            fs.mkdirSync(modelDir, { recursive: true });
            await downloadAndExtractModel(modelUrl, modelDir);
        }

        // Perform translation using model
        const translatedText = await translateUsingModel(message.content, sourceLanguage, targetLanguage);

        // Log translation
        console.log(`Translated text: ${translatedText}`);

        // Send translated message
        await sendTranslatedMessage(message, translatedText, sourceLanguage, targetLanguage);
        await message.delete(); // Delete the original message

        console.log(`Translation complete for message ID: ${message.id}`);
    } catch (error) {
        console.error('Error during text translation:', error);
    }
}

function detectLanguage(text) {
    // Placeholder for language detection logic
    return 'auto'; // Adjust this to detect language based on the message
}

async function translateUsingModel(text, sourceLang, targetLang) {
    try {
        console.log(`Translating from ${sourceLang} to ${targetLang}`);
        
        // Actual translation logic here (use your translation model/API)
        const translatedText = `${text} (Translated from ${sourceLang} to ${targetLang})`;

        console.log(`Translated text: ${translatedText}`);
        return translatedText;
    } catch (error) {
        console.error('Error during translation', error);
    }
}

async function sendTranslatedMessage(message, translatedText, sourceLang, targetLang) {
    try {
        const webhookChannel = message.channel;

        const arrow = '→'; // Clean language display
        const webhookMessage = {
            content: `${translatedText}\n\n*Original:* ${message.content}\n*Languages:* ${sourceLang} ${arrow} ${targetLang}`,
            username: message.author.username,
            avatar_url: message.author.displayAvatarURL(),
            allowed_mentions: { parse: [] },
        };

        await webhookChannel.send(webhookMessage);
    } catch (error) {
        console.error('Error sending translated message:', error);
    }
}

export { translateText };
