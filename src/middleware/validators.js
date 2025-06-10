import { body, validationResult } from 'express-validator';
import { config } from '../config/config.js';

// Registration validation
export const validateRegister = [
    body('username')
        .trim()
        .isLength({ min: config.validation.username.minLength })
        .withMessage(`Username must be at least ${config.validation.username.minLength} characters long`)
        .matches(config.validation.username.pattern)
        .withMessage('Username can only contain letters, numbers and underscore'),
    
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail(),
    
    body('password')
        .isLength({ min: config.validation.password.minLength })
        .withMessage(`Password must be at least ${config.validation.password.minLength} characters long`)
        .matches(/\d/)
        .withMessage('Password must contain at least one number')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
];

// Login validation
export const validateLogin = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail(),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

// Book validation
export const validateBook = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ 
            min: config.validation.book.title.minLength, 
            max: config.validation.book.title.maxLength 
        })
        .withMessage(`Title must be between ${config.validation.book.title.minLength} and ${config.validation.book.title.maxLength} characters`),
    
    body('caption')
        .trim()
        .notEmpty()
        .withMessage('Caption is required')
        .isLength({ 
            min: config.validation.book.caption.minLength, 
            max: config.validation.book.caption.maxLength 
        })
        .withMessage(`Caption must be between ${config.validation.book.caption.minLength} and ${config.validation.book.caption.maxLength} characters`),
    
    body('image')
        .notEmpty()
        .withMessage('Image is required')
        .isString()
        .withMessage('Image must be a valid string'),
    
    body('rating')
        .notEmpty()
        .withMessage('Rating is required')
        .isFloat({ 
            min: config.validation.book.rating.min, 
            max: config.validation.book.rating.max 
        })
        .withMessage(`Rating must be a number between ${config.validation.book.rating.min} and ${config.validation.book.rating.max}`)
];

// Validation middleware
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
}; 