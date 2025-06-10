import logger from '../config/logger.js';

export const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    });
    next();
};

export const errorLogger = (err, req, res, next) => {
    logger.error('Error:', {
        method: req.method,
        url: req.originalUrl,
        error: err.message,
        stack: err.stack
    });
    next(err);
}; 