import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Connected to Database ${conn.connection.host}`);
    } catch (err) {
        console.error(err, 'Error connecting to Database');
        process.exit(1);
    }
}