import logger from '../config/logger.js';

export const requestLogger = (req, res, next) => {
    const start = Date.now();

    // Log request
    logger.info('Incoming request', {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        body: req.method !== 'GET' ? req.body : undefined,
    });

    // Log response
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info('Request completed', {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
        });
    });

    next();
};

export const errorLogger = (err, req, res, next) => {
    logger.error('Error occurred', {
        error: {
            message: err.message,
            stack: err.stack,
        },
        request: {
            method: req.method,
            url: req.originalUrl,
            body: req.body,
            user: req.user ? req.user._id : undefined,
        },
    });

    next(err);
}; 