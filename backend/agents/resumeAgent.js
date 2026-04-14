import OpenAI from "openai";

export const resumeAgent = async (resumeText) => {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
    });

    const response = await openai.chat.completions.create({
        model: process.env.AI_MODEL || "google/gemma-3-4b-it:free",
        messages: [
            {
                role: "system",
                content: `
You are an expert AI Resume Forensic Agent and Technical Recruiter.

Extract a structured JSON profile from the resume text. You must also perform a deep Fraud and Risk analysis. Look for skill exaggeration, timeframe impossibilities, and keyword padding.

Return STRICTLY this JSON format (no other text, no markdown code blocks):
{
  "name": "",
  "companies": ["Company A", "Company B"],
  "skills": [],
  "github": "",
  "total_experience_years": 0,
  "fraudAnalysis": {
    "reasoning": "A 1-sentence analytical justification explaining your risk assessment.",
    "contributingFactors": [
      {
        "factor": "Example: Employment credibility low",
        "contributionPercent": 18
      }
    ]
  }
}
Only return valid JSON.`
            },
            {
                role: "user",
                content: resumeText,
            },
        ],
    });

    return JSON.parse(response.choices[0].message.content);
};
