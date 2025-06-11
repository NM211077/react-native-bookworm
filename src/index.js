import express from 'express';
import 'dotenv/config';
import cors from "cors";
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/config.js';
import { connectDB } from "./lib/db.js";
import logger from './config/logger.js';
import { requestLogger, errorLogger } from './middleware/logger.middleware.js';
import authRoutes from "./routes/authRoutes.js";
import booksRoutes from "./routes/booksRoutes.js";
import job from "./lib/cron.js";

const app = express();
const PORT = config.port;

// Start cron job
job.start();

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP address, please try again later.'
});

// Middleware
app.use(helmet());
app.use(limiter);
app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(requestLogger);

// Routes

app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);

// Error handling
app.use(errorLogger);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: config.isDevelopment ? err.message : 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}!`);
    connectDB();
});