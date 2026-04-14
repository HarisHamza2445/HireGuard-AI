import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'hireguard_fallback_secret_9942');

            // Debug log to verify the ID in the token
            console.log(`[Auth Debug] Attempting to find user with ID: ${decoded.id}`);

            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                console.warn(`[Auth Warning] User not found for ID: ${decoded.id}`);
                return res.status(401).json({ success: false, message: 'Not authorized, user missing' });
            }

            console.log(`[Auth Success] User found: ${req.user.email}`);

            next();
        } catch (error) {
            console.error('Auth Middleware Error:', error);
            res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    }
};
