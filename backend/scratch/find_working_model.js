import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
});

async function findWorkingFreeModel() {
    try {
        console.log("Fetching latest free model list...");
        const response = await fetch("https://openrouter.ai/api/v1/models", {
            headers: { "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` }
        });
        const data = await response.json();
        const freeModels = data.data.filter(m => m.id.includes(":free"));

        console.log(`Found ${freeModels.length} free models. Searching for one that responds...`);

        for (const model of freeModels) {
            try {
                process.stdout.write(`Testing ${model.id}... `);
                const test = await openai.chat.completions.create({
                    model: model.id,
                    messages: [{ role: "user", content: "hi" }],
                    max_tokens: 5
                });
                console.log("✅ SUCCESS!");
                console.log(`\nRECOMMENDED MODEL: ${model.id}`);
                return model.id;
            } catch (err) {
                console.log(`❌ (${err.message.split('\n')[0]})`);
            }
        }
        console.error("\nCRITICAL: All free models returned errors. You likely hit your daily OpenRouter free quota.");
    } catch (error) {
        console.error("General Failure:", error.message);
    }
}

findWorkingFreeModel();
