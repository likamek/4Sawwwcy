import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { logInfo, logError } from './utils.js';  // Assuming you have these log functions in utils.js

const modelDir = path.join(__dirname, 'models');
const modelUrl = 'https://drive.google.com/uc?export=download&id=1fXPouig4GE5oiDqY6swAtcOjf__63lU3'; // Update with correct Google Drive link

async function downloadModel() {
    try {
        // Ensure model directory exists
        if (!fs.existsSync(modelDir)) {
            fs.mkdirSync(modelDir);
            logInfo('Model directory created.');
        }

        const modelPath = path.join(modelDir, 'whisper_large_model.bin');

        // Download the model if it doesn't exist
        if (!fs.existsSync(modelPath)) {
            logInfo('Downloading Whisper model...');
            const writer = fs.createWriteStream(modelPath);

            const response = await axios({
                url: modelUrl,
                method: 'GET',
                responseType: 'stream',
                maxRedirects: 5,
            });

            response.data.pipe(writer);

            writer.on('finish', () => {
                logInfo('Whisper model downloaded successfully!');
            });

            writer.on('error', (err) => {
                logError('Error downloading the Whisper model:', err);
            });
        } else {
            logInfo('Whisper model already downloaded.');
        }
    } catch (error) {
        logError('Error downloading the Whisper model:', error);
    }
}

downloadModel();
