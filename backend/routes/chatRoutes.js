import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { chatAgent } from "../agents/chatAgent.js";

const router = express.Router();

// POST /api/chat
// Expected body: { message: "query", candidateId?: "optional_mongo_id" }
router.post("/", protect, async (req, res, next) => {
    try {
        const { message, candidateId } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: "A query message is required." });
        }

        const reply = await chatAgent(message, candidateId, req.user.id);

        res.status(200).json({
            success: true,
            reply: reply
        });

    } catch (error) {
        console.error("Chat Route Error:", error);
        next(error);
    }
});

export default router;
