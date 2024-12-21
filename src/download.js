import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';

// Log file for debugging
const logFile = './translation.log';

// Directory and model URL
const modelUrl = 'https://drive.google.com/uc?export=download&id=1M1OeVIV3kb3rZ-49lH8hozeHNYlpQv0_';
const modelDir = path.join(__dirname, 'src', 'NLP'); // Adjusted to "NLP" folder directly

async function downloadAndExtractModel(url, outputDir) {
    try {
        const zipPath = path.join(outputDir, 'NLP.zip'); // Temporary zip file path

        // Create directory if it doesn't exist
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
            logInfo(`Created directory: ${outputDir}`);
        }

        // Download the zip file from Google Drive
        logInfo(`Downloading model from: ${url}`);
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to download model zip');

        const fileStream = fs.createWriteStream(zipPath);
        await new Promise((resolve, reject) => {
            response.body.pipe(fileStream);
            response.body.on('error', reject);
            fileStream.on('finish', resolve);
        });

        logInfo('Download complete. Extracting model...');
        extractModel(zipPath, outputDir);
    } catch (error) {
        logError(error, 'Error during download or extraction');
    }
}

function extractModel(zipPath, outputDir) {
    try {
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(outputDir, true);
        logInfo('Model extraction complete.');
        fs.unlinkSync(zipPath); // Delete the zip file after extraction
    } catch (error) {
        logError(error, 'Error extracting model');
    }
}

async function checkAndDownloadNLPModel() {
    try {
        // Check if the model folder already exists
        if (!fs.existsSync(modelDir)) {
            logInfo('NLP model not found. Downloading...');
            await downloadAndExtractModel(modelUrl, modelDir);
        } else {
            logInfo('NLP model already exists. Skipping download.');
        }
    } catch (error) {
        logError(error, 'Error checking/downloading NLP model');
    }
}

// Check and download the model
checkAndDownloadNLPModel();

// Logging functions
function logInfo(message) {
    const logEntry = `[${new Date().toISOString()}] INFO: ${message}\n`;
    fs.appendFileSync(logFile, logEntry);
}

function logError(error, context = '') {
    const logEntry = `[${new Date().toISOString()}] ERROR: ${context}: ${error.message}\n`;
    fs.appendFileSync(logFile, logEntry);
}

export { checkAndDownloadNLPModel };
