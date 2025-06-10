import express from 'express';
import cors from 'cors';
import { config } from './config/config.js';
import { connectDB } from './config/database.js';
import { requestLogger, errorLogger } from './middleware/logger.middleware.js';
import logger from './config/logger.js';
import authRoutes from './routes/auth.routes.js';
import bookRoutes from './routes/book.routes.js';
import { authMiddleware } from './middleware/auth.middleware.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', authMiddleware, bookRoutes);

// Error handling
app.use(errorLogger);
app.use((err, req, res, next) => {
    logger.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

// Start server
const startServer = async () => {
    try {
        await connectDB();
        app.listen(config.port, () => {
            logger.info(`Server running on port ${config.port}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer(); 