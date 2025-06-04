import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import {catchErrorHandler} from '../utils/errorHandlers.js';

const PASSWORD_MIN_LENGTH = 6;
const USERNAME_MIN_LENGTH = 3;

const generateToken = (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES});
}

const registerController = async (req, res) => {
    try {
        const {username, email, password} = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({message: 'All fields are required'});
        }

        if (username.length < USERNAME_MIN_LENGTH) return res.status(400).json({message: `Username must be at least ${USERNAME_MIN_LENGTH} characters`});

        if (password.length < PASSWORD_MIN_LENGTH) return res.status(400).json({message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`});

        //check if username/email already exists
        const existingEmail = await User.findOne({email});
        if (existingEmail) return res.status(400).json({message: 'Email already exists'});

        const existingUser = await User.findOne({username});
        if (existingUser) return res.status(400).json({message: 'User already exists'});

        //get random avatar
        const profileImage = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`;

        const user = new User({
            username,
            email,
            password,
            profileImage,
        });

        await user.save();

        const token = generateToken(user._id);

        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                createdAt: user.createdAt
            }
        });
    } catch (err) {
        catchErrorHandler(res, err);
    }
};

const loginController = async (req, res) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) return res.status(400).json({message: 'All fields are required'});

        // check if user exists
        const user = await User.findOne({email});
        if (!user) return res.status(400).json({message: 'Invalid credentials'});

        // check if password is correct
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) return res.status(400).json({message: 'Invalid credentials'});

        const token = generateToken(user._id);

        res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                createdAt: user.createdAt
            },
        });
    } catch (err) {
        catchErrorHandler(res, err);
    }
}

export {registerController, loginController};