import express from 'express';
import 'dotenv/config';
import authRoutes from "./routes/authRoutes.js";
import {connectDB} from "./lib/db.js";
import booksRoutes from "./routes/booksRoutes.js";
import cors from "cors";
import job from "./lib/cron.js";
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/config.js';

const app = express();
const PORT = config.port;

job.start();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, 
    message: 'Too many requests from this IP address, please try again later.'
});

app.use(helmet()); 
app.use(limiter); 
app.use(express.json({ limit: "50mb" }));
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: config.isDevelopment ? err.message : 'Internal server error'
    });
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}!`);
    connectDB();
});