import express from 'express';
import { getUserProfile, updateUserProfile, updateUserPassword, getApiKeys, generateApiKey, revokeApiKey } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply global JWT protection to all routes in this file
router.use(protect);

router.route('/profile')
    .get(getUserProfile)
    .put(updateUserProfile);

router.put('/password', updateUserPassword);

router.route('/apikeys')
    .get(getApiKeys)
    .post(generateApiKey);

router.delete('/apikeys/:keyId', revokeApiKey);

export default router;
