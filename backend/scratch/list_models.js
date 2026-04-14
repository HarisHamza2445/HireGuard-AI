import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

async function fetchMyModels() {
    try {
        console.log("Fetching available models for your API Key...");
        const response = await fetch("https://openrouter.ai/api/v1/models", {
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            }
        });
        const data = await response.json();
        
        if (!data.data) {
            console.error("Failed to fetch models. Response:", data);
            return;
        }

        const freeModels = data.data.filter(m => m.id.includes(":free"));
        console.log("\n--- AVAILABLE FREE MODELS FOR YOUR KEY ---");
        if (freeModels.length === 0) {
            console.warn("CRITICAL: No free models found. Your account settings are likely filtering them all out.");
        } else {
            freeModels.forEach(m => console.log(`- ${m.id}`));
        }

        const gemma = data.data.find(m => m.id === "google/gemma-2-9b-it:free");
        console.log("\n--- GEMMA STATUS ---");
        console.log(gemma ? "✅ Gemma is available to your key." : "❌ Gemma is NOT available (Filtered out).");

    } catch (error) {
        console.error("Fetch Failed:", error.message);
    }
}

fetchMyModels();
