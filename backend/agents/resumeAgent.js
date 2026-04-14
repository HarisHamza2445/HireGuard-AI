import OpenAI from "openai";

export const resumeAgent = async (resumeText) => {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
    });

    const response = await openai.chat.completions.create({
        model: process.env.AI_MODEL || "google/gemma-2-9b-it:free",
        messages: [
            {
                role: "system",
                content: `
You are an expert AI Resume Forensic Agent and Technical Recruiter.

Extract a structured JSON profile from the resume text. You must also perform a deep Fraud and Risk analysis. Look for skill exaggeration, timeframe impossibilities, and keyword padding.

Return STRICTLY this JSON format:
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
Only return valid JSON without markdown wrapping.`
            },
            {
                role: "user",
                content: resumeText,
            },
        ],
        response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content);
};
