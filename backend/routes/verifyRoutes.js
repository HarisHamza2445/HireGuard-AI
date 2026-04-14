import express from "express";
import multer from "multer";
import { parseResume } from "../services/resumeParser.js";
import { runVerification } from "../orchestrator/agentOrchestrator.js";
import { protect } from "../middleware/authMiddleware.js";
import Candidate from "../models/Candidate.js";

const router = express.Router();

// Production file size limit config
const upload = multer({
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post("/upload", protect, upload.array("resumes"), async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: "No resume PDFs uploaded." });
        }

        const results = await Promise.all(
            req.files.map(async (file) => {
                const resumeText = await parseResume(file.buffer);
                if (!resumeText || resumeText.trim() === "") {
                    throw new Error(`Parsed resume for ${file.originalname} is empty or invalid.`);
                }
                const verificationResult = await runVerification(resumeText);

                // Construct full candidate payload
                const candidatePayload = {
                    filename: file.originalname,
                    ...verificationResult
                };

                // Asynchronously Upsert into MongoDB tied to the securely verified req.user.id
                await Candidate.findOneAndUpdate(
                    {
                        ownerId: req.user.id,
                        'structuredData.name': verificationResult?.structuredData?.name || file.originalname
                    },
                    {
                        ownerId: req.user.id,
                        ...candidatePayload
                    },
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                ).catch((err) => console.error("Candidate DB Save Error:", err));

                return candidatePayload;
            })
        );

        res.status(200).json({
            success: true,
            data: results
        });

    } catch (error) {
        next(error); // Pass to global error handler
    }
});

export default router;
