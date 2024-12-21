import fetch from 'node-fetch';
import { Client } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { logError, logInfo } from './utils.js';

const modelUrl = 'https://drive.google.com/uc?id=18fjbBxu5jMsrU50QBqfAWQyJLYn98b9a';
const modelDir = './models';  // Folder to store the model

async function translateText(message) {
    try {
        const targetLanguage = message.author.preferredLocale || 'en'; // Detect user's system language
        const sourceLanguage = detectLanguage(message.content); // Function to detect source language

        // Skip translation if source and target languages are the same
        if (sourceLanguage === targetLanguage) return;

        logInfo(`Translating message from ${sourceLanguage} to ${targetLanguage}`);
        
        // Ensure the model is downloaded and extracted
        if (!fs.existsSync(modelDir)) {
            fs.mkdirSync(modelDir);
            logInfo(`Model directory created. Downloading model from ${modelUrl}`);
            await downloadAndExtractModel(modelUrl, modelDir);
        }

        // Perform translation
        const translatedText = await translateUsingModel(message.content, sourceLanguage, targetLanguage);

        // Replace original message with a webhook
        await sendTranslatedMessage(message, translatedText, sourceLanguage, targetLanguage);
        await message.delete(); // Delete the original message
        logInfo('Message translated and original deleted.');
    } catch (error) {
        logError(error, 'Error during text translation');
    }
}

// Detect source language (replace with actual detection logic)
function detectLanguage(text) {
    // Use an external library or API to detect the language
    return 'auto'; // Replace with real detection logic
}

async function downloadAndExtractModel(url, outputDir) {
    try {
        const zipPath = path.join(outputDir, 'model.zip');
        const file = fs.createWriteStream(zipPath);

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to download model zip');

        response.body.pipe(file);
        await new Promise((resolve) => file.on('finish', resolve));

        logInfo('Model zip downloaded. Extracting...');
        extractModel(zipPath, outputDir);
    } catch (error) {
        logError(error, 'Error downloading or extracting model');
    }
}

function extractModel(zipPath, outputDir) {
    try {
        const AdmZip = require('adm-zip');
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(outputDir, true);
        fs.unlinkSync(zipPath); // Delete the zip file after extraction
        logInfo('Model extracted successfully.');
    } catch (error) {
        logError(error, 'Error extracting model');
    }
}

async function translateUsingModel(text, sourceLang, targetLang) {
    // Replace with actual translation logic
    return `${text} (Translated from ${sourceLang} to ${targetLang})`;
}

async function sendTranslatedMessage(message, translatedText, sourceLang, targetLang) {
    const webhookChannel = message.channel;

    const arrow = '→'; // Use arrow for clean language display
    const webhookMessage = {
        content: translatedText,
        username: message.author.username,
        avatar_url: message.author.displayAvatarURL(),
        allowed_mentions: { parse: [] }, // Prevent mentions from triggering
    };

    // Add original message details
    const footerText = `${sourceLang} ${arrow} ${targetLang}`;
    webhookMessage.content = `${translatedText}\n\n*Original:* ${message.content}\n*Languages:* ${footerText}`;

    await webhookChannel.send(webhookMessage);
}

export { translateText };
