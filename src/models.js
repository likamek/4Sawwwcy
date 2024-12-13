import axios from 'axios';
import fs from 'fs';
import path from 'path';

const modelDir = path.join(__dirname, 'models');
const modelUrl = 'https://drive.google.com/uc?export=download&id=1fXPouig4GE5oiDqY6swAtcOjf__63lU3'; // Update with correct Google Drive link

async function downloadModel() {
    // Ensure model directory exists
    if (!fs.existsSync(modelDir)) {
        fs.mkdirSync(modelDir);
        console.log('Model directory created.');
    }

    const modelPath = path.join(modelDir, 'whisper_large_model.bin');

    // Download the model if it doesn't exist
    if (!fs.existsSync(modelPath)) {
        console.log('Downloading Whisper model...');
        const writer = fs.createWriteStream(modelPath);

        try {
            const response = await axios({
                url: modelUrl,
                method: 'GET',
                responseType: 'stream',
                maxRedirects: 5,
            });

            response.data.pipe(writer);

            writer.on('finish', () => {
                console.log('Whisper model downloaded successfully!');
            });

            writer.on('error', (err) => {
                console.error('Error downloading the Whisper model:', err);
            });
        } catch (error) {
            console.error('Error downloading the Whisper model:', error);
        }
    } else {
        console.log('Whisper model already downloaded.');
    }
}

downloadModel();
// Whisper model