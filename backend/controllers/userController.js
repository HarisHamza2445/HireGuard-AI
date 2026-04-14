import User from '../models/User.js';
import crypto from 'crypto';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            res.status(200).json({
                success: true,
                data: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    organization: user.organization,
                    role: user.role
                }
            });
        } else {
            res.status(404).json({ success: false, message: 'User profile not found' });
        }
    } catch (error) {
        console.error('Fetch Profile Error:', error);
        res.status(500).json({ success: false, message: 'Server error retrieving profile' });
    }
};

// @desc    Update user profile data
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.firstName = req.body.firstName || user.firstName;
            user.lastName = req.body.lastName || user.lastName;
            // Note: We don't typically allow email updates without verification, keeping it locked for now.

            const updatedUser = await user.save();

            res.status(200).json({
                success: true,
                message: "Profile updated successfully!",
                data: {
                    _id: updatedUser._id,
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    email: updatedUser.email,
                    organization: updatedUser.organization,
                    role: updatedUser.role
                }
            });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ success: false, message: 'Server error updating profile' });
    }
};

// @desc    Update user password
// @route   PUT /api/users/password
// @access  Private
export const updateUserPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Need to explicitly pull password field since select: false in schema
        const user = await User.findById(req.user.id).select('+password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if current password matches
        const isMatch = await user.matchPassword(currentPassword);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid current password' });
        }

        if (newPassword && newPassword.length < 6) {
            return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
        }

        // Update password
        user.password = newPassword;
        await user.save(); // This triggers the pre('save') hook in User.js which bcrypt hashes the new payload!

        res.status(200).json({ success: true, message: 'Password updated successfully' });

    } catch (error) {
        console.error('Update Password Error:', error);
        res.status(500).json({ success: false, message: 'Server error updating password' });
    }
};

// @desc    Get all API keys for user
// @route   GET /api/users/apikeys
// @access  Private
export const getApiKeys = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        res.status(200).json({ success: true, apiKeys: user.apiKeys });
    } catch (error) {
        console.error('Fetch API Keys Error:', error);
        res.status(500).json({ success: false, message: 'Server error retrieving API keys' });
    }
};

// @desc    Generate a new API key
// @route   POST /api/users/apikeys
// @access  Private
export const generateApiKey = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const { name } = req.body;
        if (!name) return res.status(400).json({ success: false, message: 'Please provide a name for the API key' });

        // Enforce a maximum of 5 keys per account
        if (user.apiKeys.length >= 5) {
            return res.status(400).json({ success: false, message: 'Maximum limit of 5 API keys reached. Revoke an old key to create a new one.' });
        }

        const newKey = `hg_live_${crypto.randomBytes(24).toString('hex')}`;

        const newApiKeyRecord = {
            name,
            key: newKey
        };

        user.apiKeys.push(newApiKeyRecord);
        await user.save();

        res.status(201).json({
            success: true,
            message: 'API Key generated successfully',
            apiKey: newKey, // Return only once
            apiKeys: user.apiKeys // Return full array to update UI
        });
    } catch (error) {
        console.error('Generate API Key Error:', error);
        res.status(500).json({ success: false, message: 'Server error generating API key' });
    }
};

// @desc    Revoke an API key
// @route   DELETE /api/users/apikeys/:keyId
// @access  Private
export const revokeApiKey = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const keyId = req.params.keyId;

        // Filter out the key to revoke
        const initialLength = user.apiKeys.length;
        user.apiKeys = user.apiKeys.filter(k => k._id.toString() !== keyId);

        if (user.apiKeys.length === initialLength) {
            return res.status(404).json({ success: false, message: 'API key not found' });
        }

        await user.save();
        res.status(200).json({ success: true, message: 'API key permanently revoked', apiKeys: user.apiKeys });

    } catch (error) {
        console.error('Revoke API Key Error:', error);
        res.status(500).json({ success: false, message: 'Server error revoking API key' });
    }
};
