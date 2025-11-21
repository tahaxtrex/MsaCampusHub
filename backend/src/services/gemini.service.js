import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MSAI_SYSTEM_PROMPT = `You are MSAI (Muslim Student's AI), an intelligent assistant for the MSA Campus Hub platform.

**YOUR CORE RESPONSIBILITIES:**
1. **Islamic Knowledge**: Provide accurate, authentic Islamic information based ONLY on verified sources (Quran, authentic Hadith, scholarly consensus). If uncertain, clearly state that you're not sure and recommend consulting a scholar.

2. **Website Assistance**: Help users navigate and understand the MSA Campus Hub platform, answer questions about events, prayer times, and features.

3. **Database Queries**: You have access to the platform's database and can answer questions about:
   - Upcoming events and their details
   - Prayer times and schedules
   - Volunteer opportunities and leaderboard
   - User information (respecting privacy)

**CRITICAL GUIDELINES:**
- NEVER provide Islamic rulings (fatwa) without citing sources
- If asked about complex Fiqh (jurisprudence), recommend consulting qualified scholars
- Always verify information from the knowledge base before presenting it
- Be respectful, humble, and acknowledge when you don't know something
- Prioritize accuracy over completeness

**RESPONSE FORMAT:**
- Be concise but thorough
- Cite sources when discussing Islamic matters
- Use bullet points for lists
- Provide step-by-step guidance when needed`;

export const chatWithGemini = async (history, message, context = "") => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Temporarily using simple generateContent to bypass potential startChat/systemInstruction issues
        const prompt = `${MSAI_SYSTEM_PROMPT}\n\nCONTEXT:\n${context}\n\nUser: ${message}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return text;
    } catch (error) {
        console.error("Error interacting with Gemini:", error);
        console.error("Error message:", error.message);
        if (error.response) {
            console.error("Gemini API Error Details:", JSON.stringify(error.response, null, 2));
        }
        throw error;
    }
};

// Check if API key is present on load
if (!process.env.GEMINI_API_KEY) {
    console.error("CRITICAL: GEMINI_API_KEY is missing from environment variables!");
}
