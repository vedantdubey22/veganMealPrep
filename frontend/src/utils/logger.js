// Log levels
const LOG_LEVELS = {
    DEBUG: 'DEBUG',
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR'
};

// ANSI color codes for console output
const COLORS = {
    DEBUG: '\x1b[36m', // Cyan
    INFO: '\x1b[32m',  // Green
    WARN: '\x1b[33m',  // Yellow
    ERROR: '\x1b[31m', // Red
    RESET: '\x1b[0m'   // Reset
};

class Logger {
    static #instance;
    #logs = [];

    constructor() {
        if (Logger.#instance) {
            return Logger.#instance;
        }
        Logger.#instance = this;
    }

    static getInstance() {
        if (!Logger.#instance) {
            Logger.#instance = new Logger();
        }
        return Logger.#instance;
    }

    #formatMessage(level, message, data = null) {
        const timestamp = new Date().toISOString();
        const color = COLORS[level];
        const formattedMessage = `${color}[${timestamp}] ${level}: ${message}${COLORS.RESET}`;
        
        if (data) {
            console.log(formattedMessage);
            console.log('Data:', data);
        } else {
            console.log(formattedMessage);
        }

        // Store log for later retrieval
        this.#logs.push({
            timestamp,
            level,
            message,
            data
        });
    }

    debug(message, data = null) {
        this.#formatMessage(LOG_LEVELS.DEBUG, message, data);
    }

    info(message, data = null) {
        this.#formatMessage(LOG_LEVELS.INFO, message, data);
    }

    warn(message, data = null) {
        this.#formatMessage(LOG_LEVELS.WARN, message, data);
    }

    error(message, data = null) {
        this.#formatMessage(LOG_LEVELS.ERROR, message, data);
    }

    getLogs() {
        return [...this.#logs];
    }

    clearLogs() {
        this.#logs = [];
    }
}

export default Logger.getInstance(); 