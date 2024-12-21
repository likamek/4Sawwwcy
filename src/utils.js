import fs from 'fs';

// Log functions for debugging
function logInfo(message) {
    const logEntry = `[${new Date().toISOString()}] INFO: ${message}\n`;
    fs.appendFileSync('./translation.log', logEntry);
}

function logError(error, context = '') {
    const logEntry = `[${new Date().toISOString()}] ERROR: ${context}: ${error.message}\n`;
    fs.appendFileSync('./translation.log', logEntry);
}

export { logInfo, logError };
