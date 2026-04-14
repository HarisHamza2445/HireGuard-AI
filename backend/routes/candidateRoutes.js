import express from 'express';
import { getCandidates, getCandidateById, getAnalytics } from '../controllers/candidateController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// The specific routes MUST go before dynamic parameter routes like /:id
router.get('/analytics', protect, getAnalytics);

router.get('/', protect, getCandidates);
router.get('/:id', protect, getCandidateById);

export default router;
