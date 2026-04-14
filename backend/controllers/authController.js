import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT Function
const generateToken = (id) => {
    return jwt.sign({ id: id.toString() }, process.env.JWT_SECRET || 'hireguard_fallback_secret_9942', {
        expiresIn: '30d',
    });
};

// @desc    Register new recruiter
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, organization, password } = req.body;

        if (!firstName || !lastName || !email || !password || !organization) {
            return res.status(400).json({ success: false, message: 'Please add all fields' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const user = await User.create({
            firstName,
            lastName,
            email,
            organization,
            password
        });

        if (user) {
            res.status(201).json({
                success: true,
                _id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                organization: user.organization,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ success: false, message: 'Server runtime error during registration' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.json({
                success: true,
                _id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                organization: user.organization,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ success: false, message: 'Server runtime error during login' });
    }
};

// @desc    Get user profile data
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            res.json({
                success: true,
                _id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                organization: user.organization,
                role: user.role
            });
        } else {
            res.status(401).json({ 
                success: false, 
                message: 'User identity not found in database. Your session may be from a different database. Please log out and register a new account.' 
            });
        }
    } catch (error) {
        console.error('Profile Fetch Error:', error);
        res.status(500).json({ success: false, message: 'Server runtime error fetching profile' });
    }
};
