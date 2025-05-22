import express from 'express';
import 'dotenv/config';
import authRoutes from "./routes/authRoutes.js";
import {connectDB} from "./lib/db.js";
import booksRoutes from "./routes/booksRoutes.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
console.log({PORT});

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}!`);
    connectDB();
});