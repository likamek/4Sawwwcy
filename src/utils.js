// Log errors to console or external logging service
export function logError(error, context) {
    console.error(`${context}:`, error);
    // Optionally, send to an external logging service here
}

// Log information messages
export function logInfo(message) {
    console.log(`INFO: ${message}`);
    // Optionally, send to an external logging service here
}

// Utility to check if a message is in English or Russian
export function isValidLanguage(text) {
    const russianPattern = /[А-Яа-яЁё]/;
    const englishPattern = /^[A-Za-z0-9\s.,!?]*$/;

    try {
        if (russianPattern.test(text)) {
            logInfo('Detected Russian language');
            return 'ru';
        }
        if (englishPattern.test(text)) {
            logInfo('Detected English language');
            return 'en';
        }
        logInfo('Language not detected or unsupported');
        return 'unknown';
    } catch (error) {
        logError(error, 'Error during language validation');
        return 'unknown';
    }
}
