import express from "express";
import Candidate from "../models/Candidate.js";
import { processInterviewMessage } from "../agents/interviewAgent.js";

const router = express.Router();

// GET /api/interview/:id
// Publicly accessible route to initialize/fetch the interview context
router.get("/:id", async (req, res, next) => {
    try {
        const candidate = await Candidate.findById(req.params.id)
            .select("filename structuredData.name structuredData.skills interviewStatus interviewScore interviewFeedback interviewTranscript createdAt");

        if (!candidate) {
            return res.status(404).json({ success: false, message: "Interview session not found." });
        }

        res.status(200).json({
            success: true,
            candidate: {
                id: candidate._id,
                name: candidate.structuredData?.name || "Candidate",
                skills: candidate.structuredData?.skills || [],
                status: candidate.interviewStatus,
                score: candidate.interviewScore,
                feedback: candidate.interviewFeedback,
                transcript: candidate.interviewTranscript,
                date: candidate.createdAt
            }
        });
    } catch (error) {
        console.error("Interview Fetch Error:", error);
        next(error);
    }
});

// POST /api/interview/:id/chat
// Publicly accessible route to send answers to the AI
router.post("/:id/chat", async (req, res, next) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: "A message is required." });
        }

        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) {
            return res.status(404).json({ success: false, message: "Interview session not found." });
        }

        if (candidate.interviewStatus === "Completed") {
            return res.status(400).json({ success: false, message: "Interview is already completed." });
        }

        const aiResponse = await processInterviewMessage(req.params.id, message);

        res.status(200).json({
            success: true,
            ...aiResponse
        });

    } catch (error) {
        console.error("Interview Chat Route Error:", error);
        next(error);
    }
});

export default router;
