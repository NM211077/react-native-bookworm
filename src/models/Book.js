import mongoose from "mongoose";

const RATING_MIN = 1;
const RATING_MAX = 5;

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        caption: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: RATING_MIN,
            max: RATING_MAX
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }
    },
    {timestamps: true}
);

const Book = mongoose.model('Book', bookSchema);

export default Book;