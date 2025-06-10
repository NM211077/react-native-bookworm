import express from "express";
import cloudinary from "../lib/cloudinary.js";
import Book from "../models/Book.js";
import protectRoute from "../middleware/auth.middleware.js";
import {createBookPost, deleteBook, getAllBooks, getRecommendedBooks} from "../controllers/booksContollers.js";
import { validateBook, validate } from "../middleware/validators.js";

const router = express.Router();

router.post("/", protectRoute, validateBook, validate, createBookPost);
router.get("/", protectRoute, getAllBooks);
router.get("/user", protectRoute, getRecommendedBooks);
router.delete("/:id", protectRoute, deleteBook);

export default router;