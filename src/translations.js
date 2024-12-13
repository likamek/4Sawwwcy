const { Client } = require('discord.js');
const { logError } = require('./src/utils.js');  // Adjusted path for utils.js
const fetch = require('node-fetch');
const fs = require('fs');  // Added fs import
const path = require('path');  // Added path import

// Load model from Google Drive
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

        // Load and use the model for translation (replace with actual model logic here)
        const translatedText = await translateUsingModel(message.content, sourceLanguage, targetLanguage);

        // Send the translation via webhook
        await sendTranslatedMessage(message, translatedText, sourceLanguage, targetLanguage);
    } catch (error) {
        logError(error, 'Error during text translation');
    }
}

async function translateUsingModel(text, sourceLang, targetLang) {
    // Replace this with actual logic to use the downloaded model
    // For now, assume a dummy translation
    return `${text} (Translated from ${sourceLang} to ${targetLang})`;
}

async function sendTranslatedMessage(message, translatedText, sourceLang, targetLang) {
    const webhookChannel = message.channel; // Get appropriate channel for the webhook

    // Create minimalistic design for the webhook message
    const webhookMessage = {
        content: translatedText,
        username: message.author.username,
        avatar_url: message.author.displayAvatarURL(),
        embeds: [
            {
                description: `${translatedText}`,
                footer: {
                    text: `${sourceLang} > ${targetLang}`,  // Minimalistic design for language indicator
                },
                fields: [
                    {
                        name: 'Original Message',
                        value: message.content,
                        inline: true
                    }
                ]
            }
        ]
    };

    // Send the webhook message
    await webhookChannel.send(webhookMessage);
}

module.exports = { translateText };
