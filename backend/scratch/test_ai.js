import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
});

async function testModel() {
    try {
        console.log("Testing model WITHOUT JSON mode...");
        const response = await openai.chat.completions.create({
            model: process.env.AI_MODEL || "google/gemma-2-9b-it:free",
            messages: [{ role: "user", content: "Say hello." }],
        });
        console.log("Success! Response:", response.choices[0].message.content);
    } catch (error) {
        console.error("Test Failed:", error.message);
        if (error.message.includes("404")) {
            console.log("\n--- TROUBLESHOOTING ---");
            console.log("1. Go to https://openrouter.ai/settings/privacy");
            console.log("2. Ensure 'Zero Data Retention' is UNCHECKED.");
            console.log("3. Ensure 'Allow providers to store data' or similar is ON.");
        }
    }
}

testModel();
