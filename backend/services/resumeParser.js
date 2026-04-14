import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse-new");

export const parseResume = async (fileBuffer) => {
    try {
        const data = await pdfParse(fileBuffer);
        return data.text;
    } catch (error) {
        console.error("PDF Parse Error details:", error);
        throw new Error("Resume parsing failed");
    }
};
