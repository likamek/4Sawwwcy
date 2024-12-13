import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';

const modelDir = path.join(__dirname, 'models');
const modelUrl = 'https://drive.google.com/uc?export=download&id=your-nlp-model-id'; // Update with correct link

async function downloadAndExtractModel(url, outputDir) {
    try {
        const zipPath = path.join(outputDir, 'model.zip');
        const file = fs.createWriteStream(zipPath);

        // Download the zip file from Google Drive
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

async function checkAndDownloadNLPModel() {
    // Ensure model directory exists
    if (!fs.existsSync(modelDir)) {
        fs.mkdirSync(modelDir);
        console.log('Model directory created.');
    }

    const modelPath = path.join(modelDir, 'nlp_model'); // Replace with actual model folder name

    // If model directory doesn't exist, download and extract model
    if (!fs.existsSync(modelPath)) {
        console.log('Downloading and extracting NLP model...');
        await downloadAndExtractModel(modelUrl, modelDir);
    } else {
        console.log('NLP model already downloaded.');
    }
}

checkAndDownloadNLPModel();

// NLP model