import fetch from 'node-fetch';
import { Client } from 'discord.js';
import fs from 'fs';
import path from 'path';

const modelUrl = 'https://drive.google.com/uc?id=18fjbBxu5jMsrU50QBqfAWQyJLYn98b9a';
const modelDir = './models';  // Folder to store the model
const logFile = './translation.log';  // Log file for debugging

async function translateText(message) {
    try {
        const targetLanguage = message.author.preferredLocale || 'en'; // Detect user's system language
        const sourceLanguage = detectLanguage(message.content); // Detect source language

        if (sourceLanguage === targetLanguage) return; // Skip if languages match

        // Ensure the model is downloaded and extracted
        if (!fs.existsSync(modelDir)) {
            fs.mkdirSync(modelDir);
            await downloadAndExtractModel(modelUrl, modelDir);
        }

        // Perform translation
        const translatedText = await translateUsingModel(message.content, sourceLanguage, targetLanguage);

        // Replace original message with a webhook
        await sendTranslatedMessage(message, translatedText, sourceLanguage, targetLanguage);
        await message.delete(); // Delete the original message
    } catch (error) {
        logError(error, 'Error during text translation');
    }
}

function detectLanguage(text) {
    // Replace with actual language detection logic (API or library)
    return 'en'; // Placeholder for detected language
}

async function downloadAndExtractModel(url, outputDir) {
    try {
        const zipPath = path.join(outputDir, 'model.zip');
        const file = fs.createWriteStream(zipPath);

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to download model zip');

        response.body.pipe(file);
        await new Promise((resolve) => file.on('finish', resolve));

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
        content: `${translatedText}\n\n*Original:* ${message.content}\n*Languages:* ${sourceLang} ${arrow} ${targetLang}`,
        username: message.author.username,
        avatar_url: message.author.displayAvatarURL(),
        allowed_mentions: { parse: [] }, // Prevent mentions from triggering
    };

    await webhookChannel.send(webhookMessage);
}

function logError(error, context = '') {
    const logEntry = `[${new Date().toISOString()}] ${context}: ${error.message}\n`;
    fs.appendFileSync(logFile, logEntry);
}

export { translateText };
