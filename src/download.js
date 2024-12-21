import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';

// Base directory (update to your actual directory path)
const baseDir = path.join(__dirname, 'src', 'download.js'); // Adjusted directory path
const modelDir = path.join(baseDir, 'NLP'); // Adjusted to "NLP" folder directly
const modelUrl = 'https://drive.google.com/uc?export=download&id=1M1OeVIV3kb3rZ-49lH8hozeHNYlpQv0_';

async function downloadAndExtractModel(url, outputDir) {
    try {
        const zipPath = path.join(outputDir, 'NLP.zip'); // Temporary zip file path

        // Create directory if it doesn't exist
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
            console.log(`Created directory: ${outputDir}`);
        }

        // Download the zip file from Google Drive
        console.log('Downloading model from:', url);
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to download model zip');

        const fileStream = fs.createWriteStream(zipPath);
        await new Promise((resolve, reject) => {
            response.body.pipe(fileStream);
            response.body.on('error', reject);
            fileStream.on('finish', resolve);
        });

        console.log('Download complete. Extracting...');
        extractModel(zipPath, outputDir);
    } catch (error) {
        console.error('Error during download or extraction:', error);
    }
}

function extractModel(zipPath, outputDir) {
    try {
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(outputDir, true);
        console.log('Extraction complete.');
        fs.unlinkSync(zipPath); // Delete the zip file after extraction
    } catch (error) {
        console.error('Error extracting model:', error);
    }
}

async function checkAndDownloadNLPModel() {
    try {
        // Check if the model folder already exists
        if (!fs.existsSync(modelDir)) {
            console.log('NLP model not found. Downloading...');
            await downloadAndExtractModel(modelUrl, modelDir);
        } else {
            console.log('NLP model already exists. Skipping download.');
        }
    } catch (error) {
        console.error('Error checking/downloading NLP model:', error);
    }
}

// Check and download the model
checkAndDownloadNLPModel();

export { checkAndDownloadNLPModel };
