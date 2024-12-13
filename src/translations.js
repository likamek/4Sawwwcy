import fetch from 'node-fetch';
import { Client } from 'discord.js';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

// Model download link
const modelUrl = 'https://drive.google.com/uc?id=18fjbBxu5jMsrU50QBqfAWQyJLYn98b9a';
const modelDir = './models';  // Folder to store the model

async function translateText(message) {
    try {
        const targetLanguage = message.author.preferredLocale || 'en'; // Auto-detect user's language
        const sourceLanguage = 'auto';  // Automatically detect source language

        // Ensure the model is downloaded and extracted
        if (!fs.existsSync(modelDir)) {
            fs.mkdirSync(modelDir);
            await downloadAndExtractModel(modelUrl, modelDir);
        }

        // Check if translation is necessary (ignore if same language)
        if (sourceLanguage === targetLanguage) {
            console.log('No translation needed for the same language');
            return;
        }

        // Perform translation (replace with actual model logic)
        const translatedText = await translateUsingModel(message.content, sourceLanguage, targetLanguage);

        // Send the translation via webhook
        await sendTranslatedMessage(message, translatedText, sourceLanguage, targetLanguage);
    } catch (error) {
        logError(error, 'Error during text translation');
    }
}

async function downloadAndExtractModel(url, outputDir) {
    try {
        const zipPath = path.join(outputDir, 'model.zip');
        const file = fs.createWriteStream(zipPath);

        // Download zip file from Google Drive
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to download model zip');

        // Save zip file
        response.body.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log('Download complete, extracting...');
            extractModel(zipPath, outputDir);
        });
    } catch (error) {
        console.error('Error downloading or extracting model:', error);
    }
}

function extractModel(zipPath, outputDir) {
    try {
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(outputDir, true);
        console.log('Extraction complete');
        fs.unlinkSync(zipPath);  // Optional: delete the zip file after extraction
    } catch (error) {
        console.error('Error extracting model:', error);
    }
}

// Perform the translation
async function translateUsingModel(text, sourceLang, targetLang) {
    // Use actual translation logic here
    return `${text} (Translated from ${sourceLang} to ${targetLang})`;
}

async function sendTranslatedMessage(message, translatedText, sourceLang, targetLang) {
    const webhookChannel = message.channel; // Get appropriate channel for the webhook

    // Create minimalistic design for the webhook message
    const webhookMessage = {
        content: translatedText,
        username: message.author.username,
        avatar_url: message.author.displayAvatarURL(),
        allowed_mentions: { parse: [] }, // Prevent mentions from triggering
    };

    // Send the webhook message
    await webhookChannel.send(webhookMessage);
}

export { translateText };
