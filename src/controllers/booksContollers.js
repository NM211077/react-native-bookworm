import cloudinary from "../lib/cloudinary.js";
import Book from "../models/Book.js";
import { catchErrorHandler } from "../utils/errorHandlers.js";
import { BOOKS_CONFIG } from "../config/books.config.js";

const createBookPost = async (req, res) => {
    try {
        const { title, caption, image, rating } = req.body;
        if (!title || !caption || !image || !rating) return res.status(400).json({ message: 'Please provide all fields' });

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
    try {
        const page = parseInt(req.query.page) || BOOKS_CONFIG.DEFAULT_PAGE_NUM;
        const limit = parseInt(req.query.limit) || BOOKS_CONFIG.DEFAULT_LIMIT;
        const skip = (page - 1) * limit;

        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

        const pipeline = [
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $sort: {
                    [sortBy === 'username' ? 'user.username' : sortBy]: sortOrder
                }
            },
            { $skip: skip },
            { $limit: limit },
            {
                $project: {
                    title: 1,
                    caption: 1,
                    image: 1,
                    rating: 1,
                    createdAt: 1,
                    user: {
                        _id: '$user._id',
                        username: '$user.username',
                        profileImage: '$user.profileImage'
                    }
                }
            }
        ];

        const books = await Book.aggregate(pipeline);

        const totalBooks = await Book.countDocuments();

        res.send({
            books,
            currentPage: page,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit)
        });
    } catch (err) {
        catchErrorHandler(res, err);
    }
};

const deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        //check if user is creator it book
        if (book.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Unauthorized' });

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
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (err) {
        catchErrorHandler(res, err);
    }
};

const getRecommendedBooks = async (req, res) => {
    try {
        const books = await Book.find({ user: req.user._id })
            .sort({ [BOOKS_CONFIG.SORT_OPTIONS.CREATED_AT]: BOOKS_CONFIG.SORT_ORDERS.DESC });
        res.json(books);
    } catch (err) {
        catchErrorHandler(res, err);
    }
};

export { createBookPost, getAllBooks, deleteBook, getRecommendedBooks };