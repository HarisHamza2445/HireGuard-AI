import OpenAI from "openai";
import Candidate from "../models/Candidate.js";

// OpenAI will be instantiated inside functions after dotenv loads

export const processInterviewMessage = async (candidateId, userMessage) => {
    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            baseURL: "https://openrouter.ai/api/v1",
        });

        const candidate = await Candidate.findById(candidateId);

        if (!candidate) {
            throw new Error("Candidate not found.");
        }

        // Initialize transcript if it's the first message
        if (candidate.interviewTranscript.length === 0) {
            // First time accessing. The AI gives the initial prompt based on skills.
            const skills = candidate.structuredData?.skills || [];
            const domainContext = skills.join(", ");

            candidate.interviewStatus = "In Progress";

            const initialSystemPrompt = `You are an expert technical interviewer for HireGuard AI assessing a candidate.
The candidate claims knowledge in these areas: ${domainContext}.
You must ask exactly ONE moderately difficult technical question related to one of their core skills to assess their actual knowledge.
Be professional, welcoming, and concise. Do not give away the answer. Start by welcoming them.`;

            const response = await openai.chat.completions.create({
                model: "mistralai/mistral-7b-instruct:free",
                messages: [{ role: "system", content: initialSystemPrompt }],
            });

            const initialGreeting = response.choices[0].message.content;

            candidate.interviewTranscript.push({ role: 'assistant', content: initialGreeting });
            await candidate.save();

            return {
                reply: initialGreeting,
                status: candidate.interviewStatus,
                transcript: candidate.interviewTranscript
            };
        }

        // Append user message
        candidate.interviewTranscript.push({ role: 'user', content: userMessage });

        // Build the conversation history for the AI
        const systemPrompt = `You are a technical interviewer traversing a conversation.
The candidate claims these skills: ${(candidate.structuredData?.skills || []).join(", ")}.
This is a short rapid-fire interview (max 3-4 questions total). 
Assess their last answer.
If their answer is good, acknowledge it briefly and ask the next question on a different skill.
If their answer is poor, briefly correct them (optional) and move to the next question.
If you have asked 3 distinct technical questions already, state clearly: "INTERVIEW_COMPLETE. Thank you for your time. The assessment is over."`;

        const messagesForAI = [
            { role: "system", content: systemPrompt },
            ...candidate.interviewTranscript.map(msg => ({ role: msg.role, content: msg.content }))
        ];

        const response = await openai.chat.completions.create({
            model: "mistralai/mistral-7b-instruct:free",
            messages: messagesForAI,
        });

        let aiReply = response.choices[0].message.content;

        // Check for completion flag
        if (aiReply.includes("INTERVIEW_COMPLETE")) {
            candidate.interviewStatus = "Completed";
            // Clean up the reply to remove the flag
            aiReply = aiReply.replace("INTERVIEW_COMPLETE.", "").trim();
            candidate.interviewTranscript.push({ role: 'assistant', content: aiReply });
            await candidate.save();

            // Kick off asynchronous evaluation to calculate the score since interview is done
            evaluateInterview(candidate._id);

            return {
                reply: aiReply,
                status: "Completed",
                transcript: candidate.interviewTranscript
            };
        }

        candidate.interviewTranscript.push({ role: 'assistant', content: aiReply });
        await candidate.save();

        return {
            reply: aiReply,
            status: candidate.interviewStatus,
            transcript: candidate.interviewTranscript
        };

    } catch (error) {
        console.error("Interview Process Error:", error);
        throw error;
    }
};


// Run this after the interview is complete to score the candidate
export const evaluateInterview = async (candidateId) => {
    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            baseURL: "https://openrouter.ai/api/v1",
        });

        const candidate = await Candidate.findById(candidateId);
        if (!candidate || candidate.interviewStatus !== "Completed") return;

        const systemPrompt = `You are a technical recruiting evaluator. Review the following interview transcript.
Assess the candidate's technical accuracy, depth of knowledge, and communication based ONLY on their answers to the interviewer's questions.

Return STRICTLY this JSON format:
{
  "score": 0, // A number from 0 to 100 representing their technical proficiency demonstrated.
  "feedback": "A concise paragraph summarizing their performance, strengths, and weaknesses."
}

Transcript:
${JSON.stringify(candidate.interviewTranscript)}
`;

        const response = await openai.chat.completions.create({
            model: "mistralai/mistral-7b-instruct:free",
            messages: [{ role: "system", content: systemPrompt }],
            response_format: { type: "json_object" }
        });

        const evaluation = JSON.parse(response.choices[0].message.content);

        candidate.interviewScore = evaluation.score;
        candidate.interviewFeedback = evaluation.feedback;
        await candidate.save();

    } catch (error) {
        console.error("Interview Evaluation Error:", error);
    }
};
