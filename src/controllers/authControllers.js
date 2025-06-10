import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import {catchErrorHandler} from '../utils/errorHandlers.js';
import { config } from '../config/config.js';

const generateToken = (userId) => {
    return jwt.sign({userId}, config.jwtSecret, {expiresIn: config.jwtExpiresIn});
}

const registerController = async (req, res) => {
    try {
        const {username, email, password} = req.body;

        // Check for existing users
        const existingEmail = await User.findOne({email});
        if (existingEmail) return res.status(400).json({message: 'Email already exists'});

        const existingUser = await User.findOne({username});
        if (existingUser) return res.status(400).json({message: 'Username already exists'});

        // Generate avatar
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

        // Check if user exists
        const user = await User.findOne({email});
        if (!user) return res.status(400).json({message: 'Invalid credentials'});

        // Verify password
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