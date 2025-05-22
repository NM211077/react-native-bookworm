import cloudinary from "../lib/cloudinary.js";
import Book from "../models/Book.js";
import {catchErrorHandler} from "../utils/errorHandlers.js";

const DEFAULT_LIMIT = 10;
const createBookPost = async (req, res) => {
    try {
        const {title, caption, image, rating} = req.body;
        if (!title || !caption || !image || !rating) return res.status(400).json({message: 'Please provide all fields'});

        //upload img to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image);
        const imageUrl = uploadResponse.secure_url;
        //save to db
        const newBook = new Book({
            title,
            caption,
            image: imageUrl,
            rating,
            user: req.user._id
        });

        await newBook.save();

        res.status(201).json(newBook);
    } catch (err) {
        catchErrorHandler(res, err);
    }
};
const getAllBooks = async (req, res) => {
    //pagination => infinity scroll
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || DEFAULT_LIMIT;
        const skip = (page - 1) * limit;

        const books = await Book.find()
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit)
            .populate('user', 'username profileImage');

        const totalBooks = await Book.countDocuments(books);

        res.send({
            books,
            currentPage: page,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit)
        })

    } catch (err) {
        catchErrorHandler(res, err);
    }
}

const deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({message: 'Book not found'});

        //check if user is creator it book
        if (book.user.toString() !== req.user._id.toString()) return res.status(401).json({message: 'Unauthorized'});

        //delete image from cloudinary
        if (book.image && book.image.includes('cloudinary')) {
            try {
                const publicId = book.image.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (deleteError) {
                console.error(deleteError);
            }
        }
        await book.deleteOne();
        res.status(200).json({message: 'Book deleted successfully'});
    } catch (err) {
        catchErrorHandler(res, err);
    }
}

const getRecommendedBooks = async (req, res) => {
    try {
        const books = await Book.find({user: req.params.user}).sort({createdAt: -1});
        res.json(books);
    } catch (err) {
        catchErrorHandler(res, err);
    }
}

export {createBookPost, getAllBooks, deleteBook, getRecommendedBooks}