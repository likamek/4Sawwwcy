// Log errors to console or external logging service
export function logError(error, context) {
    console.error(`${context}:`, error);
}

// Utility to check if a message is in English or Russian
export function isValidLanguage(text) {
    const russianPattern = /[А-Яа-яЁё]/;
    const englishPattern = /^[A-Za-z0-9\s.,!?]*$/;

    if (russianPattern.test(text)) return 'ru';
    if (englishPattern.test(text)) return 'en';
    return 'unknown';
}
