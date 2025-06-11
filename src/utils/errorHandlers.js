import logger from '../config/logger.js';

export const handleError = (error, context = '') => {
    logger.error(`Error in ${context}:`, {
        message: error.message,
        stack: error.stack,
        context: context,
        timestamp: new Date().toISOString()
    });
    return {
        success: false,
        message: error.message || 'An error occurred',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
};

export const handleCloudinaryError = async (error, publicId, context = '') => {
    logger.error(`Cloudinary error in ${context}:`, {
        message: error.message,
        publicId: publicId,
        stack: error.stack,
        context: context,
        timestamp: new Date().toISOString()
    });
    return {
        success: false,
        message: 'Error processing image',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
};

export const catchErrorHandler = (res,err)=> {
    return res.status(500).json({error: 'Internal server error!'});
    console.error('!!!', err);
}