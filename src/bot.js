import fetch from 'node-fetch';
import { Client } from 'discord.js';
import fs from 'fs';
import path from 'path';

// Log file for debugging
const logFile = './translation.log';

// Directory and model URL
const modelUrl = 'https://drive.google.com/uc?id=18fjbBxu5jMsrU50QBqfAWQyJLYn98b9a';
const modelDir = './models'; // Folder to store the model

async function translateText(message) {
    try {
        const targetLanguage = message.author.preferredLocale || 'en'; // Detect user's system language
        const sourceLanguage = detectLanguage(message.content); // Detect source language

        if (sourceLanguage === targetLanguage) return; // Skip if languages match

        logInfo(`Processing message: "${message.content}" from ${sourceLanguage} to ${targetLanguage}`);

        // Ensure the model is downloaded and extracted
        if (!fs.existsSync(modelDir)) {
            logInfo(`Model directory not found. Creating and downloading model.`);
            fs.mkdirSync(modelDir, { recursive: true });
            await downloadAndExtractModel(modelUrl, modelDir);
        }

        // Perform translation
        const translatedText = await translateUsingModel(message.content, sourceLanguage, targetLanguage);

        // Send translated message
        await sendTranslatedMessage(message, translatedText, sourceLanguage, targetLanguage);
        await message.delete(); // Delete the original message

        logInfo(`Translation complete for message ID: ${message.id}`);
    } catch (error) {
        logError(error, 'Error during text translation');
    }
}

function detectLanguage(text) {
    // Placeholder for language detection logic
    return 'en'; // Default to 'en' for now
}

async function downloadAndExtractModel(url, outputDir) {
    try {
        const zipPath = path.join(outputDir, 'model.zip');
        const file = fs.createWriteStream(zipPath);

        logInfo(`Downloading model from: ${url}`);
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to download model zip');

        response.body.pipe(file);
        await new Promise((resolve) => file.on('finish', resolve));

        logInfo(`Download complete. Extracting model...`);
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

        logInfo(`Model extracted successfully to: ${outputDir}`);
    } catch (error) {
        logError(error, 'Error extracting model');
    }
}

async function translateUsingModel(text, sourceLang, targetLang) {
    // Placeholder for actual translation logic
    logInfo(`Translating text: "${text}" from ${sourceLang} to ${targetLang}`);
    return `${text} (Translated from ${sourceLang} to ${targetLang})`;
}

async function sendTranslatedMessage(message, translatedText, sourceLang, targetLang) {
    try {
        const webhookChannel = message.channel;

        const arrow = '→'; // Use arrow for clean language display
        const webhookMessage = {
            content: `${translatedText}\n\n*Original:* ${message.content}\n*Languages:* ${sourceLang} ${arrow} ${targetLang}`,
            username: message.author.username,
            avatar_url: message.author.displayAvatarURL(),
            allowed_mentions: { parse: [] }, // Prevent mentions from triggering
        };

        await webhookChannel.send(webhookMessage);
        logInfo(`Translated message sent to channel ID: ${webhookChannel.id}`);
    } catch (error) {
        logError(error, 'Error sending translated message');
    }
}

// Logging functions
function logInfo(message) {
    const logEntry = `[${new Date().toISOString()}] INFO: ${message}\n`;
    fs.appendFileSync(logFile, logEntry);
}

function logError(error, context = '') {
    const logEntry = `[${new Date().toISOString()}] ERROR: ${context}: ${error.message}\n`;
    fs.appendFileSync(logFile, logEntry);
}

export { translateText };
