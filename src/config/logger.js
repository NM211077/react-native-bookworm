import winston from 'winston';
import 'winston-daily-rotate-file';
import { config } from './config.js';

// Define log format
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
);

// Define log levels
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

// Create the logger
const logger = winston.createLogger({
    level: config.isDevelopment ? 'debug' : 'info',
    levels,
    format: logFormat,
    transports: [
        // Write all logs with level 'error' and below to 'error.log'
        new winston.transports.DailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            maxFiles: '14d',
            maxSize: '20m',
        }),
        // Write all logs with level 'info' and below to 'combined.log'
        new winston.transports.DailyRotateFile({
            filename: 'logs/combined-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxFiles: '14d',
            maxSize: '20m',
        }),
    ],
});

// If we're in development, also log to the console
if (config.isDevelopment) {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        ),
    }));
}

// Create a stream object for Morgan
export const stream = {
    write: (message) => {
        logger.http(message.trim());
    },
};

export default logger; 