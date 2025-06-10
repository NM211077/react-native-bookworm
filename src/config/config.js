import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/bookworm',
    jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    isDevelopment: true,
    // Validation defaults
    validation: {
        username: {
            minLength: 3,
            pattern: /^[a-zA-Z0-9_]+$/
        },
        password: {
            minLength: 6,
            requireNumber: true,
            requireUppercase: true
        },
        book: {
            title: {
                minLength: 2,
                maxLength: 100
            },
            caption: {
                minLength: 10,
                maxLength: 1000
            },
            rating: {
                min: 0,
                max: 5
            }
        }
    }
}; 