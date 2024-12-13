import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';
import https from 'https';


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
