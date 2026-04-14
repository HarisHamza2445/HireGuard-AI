import OpenAI from "openai";
import Candidate from "../models/Candidate.js";

export const chatAgent = async (userMessage, candidateId, userId) => {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
    });

    let systemPrompt = `You are the "HireGuard AI Talent Intelligence Assistant", an expert AI recruiter and forensic risk analyst.
Your job is to answer the recruiter's questions about candidates, classify skills/domains, explain risk scores, and suggest next actions.
Keep answers concise, professional, and data-driven. Use markdown formatting freely for readability.
If a user asks about "authenticity score" or similar, use the confidenceScore from the riskData. 100 - fraudProbability = Score.`;

    let contextData = "";

    // Candidate-Specific Query Mode
    if (candidateId) {
        const candidate = await Candidate.findOne({ _id: candidateId, ownerId: userId });

        if (!candidate) {
            return "Error: Candidate not found or you don't have permission to view them.";
        }

        contextData = `
### Current Candidate Context ###
Name: ${candidate.structuredData?.name || 'Unknown'}
Skills: ${JSON.stringify(candidate.structuredData?.skills || [])}
Experience: ${candidate.structuredData?.total_experience_years || 0} years
Companies: ${JSON.stringify(candidate.structuredData?.companies || [])}
GitHub: ${candidate.structuredData?.github || 'None'}
Risk Level: ${candidate.riskData?.level || 'Unknown'}
Fraud Probability: ${candidate.riskData?.fraudProbability || 0}%
AI Confidence: ${candidate.riskData?.confidenceScore || 0}/100
Risk Reasoning: ${candidate.fraudAnalysis?.reasoning || 'N/A'}
Risk Factors: ${JSON.stringify(candidate.fraudAnalysis?.contributingFactors || [])}
`;
        systemPrompt += "\n\nYou are currently viewing a specific candidate's profile. Use the following context to answer the user's question:\n" + contextData;

    } else {
        // Global Query Mode (e.g. "Show me Python candidates")
        // We fetch a lightweight summary of all the recruiter's candidates for the LLM to search through.
        const allCandidates = await Candidate.find({ ownerId: userId }).select('filename structuredData.name structuredData.skills structuredData.total_experience_years riskData.level riskData.confidenceScore');

        if (!allCandidates || allCandidates.length === 0) {
            return "You haven't uploaded any candidates yet. Please upload some resumes first.";
        }

        const summarizedCandidates = allCandidates.map(c => ({
            id: c._id,
            name: c.structuredData?.name || c.filename,
            skills: Array.isArray(c.structuredData?.skills) ? c.structuredData.skills.flat() : c.structuredData?.skills,
            experience: c.structuredData?.total_experience_years,
            riskLevel: c.riskData?.level,
            authenticityScore: c.riskData?.confidenceScore
        }));

        contextData = `
### Your Candidate Database ###
${JSON.stringify(summarizedCandidates, null, 2)}
`;
        systemPrompt += "\n\nYou are in 'Global Database Query' mode. The user is asking a broader question. Search through the following list of candidates to answer them. If they want a list, provide their names, domains, and authentic scores.\n" + contextData;
    }

    try {
        const response = await openai.chat.completions.create({
            model: "mistralai/mistral-7b-instruct",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage },
            ],
            // Not strictly asking for JSON to allow a rich markdown conversational output
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error("Chat Agent Error:", error);
        return "I encountered an error while processing your request. The AI service may be temporarily unavailable.";
    }
};
