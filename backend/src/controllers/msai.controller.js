import { chatWithGemini } from "../services/gemini.service.js";
import { supabaseAdmin } from "../lib/supabase.js";

export const handleChat = async (req, res) => {
    try {
        const { message, history, userId } = req.body;

        // 1. Build Context from Database
        let context = "";

        // Fetch recent events
        try {
            const { data: events, error: eventError } = await supabaseAdmin
                .from("events")
                .select("title, date, location, description")
                .gte("date", new Date().toISOString())
                .order("date", { ascending: true })
                .limit(3);

            if (eventError) console.error("Error fetching events:", eventError);
            if (events && events.length > 0) {
                context += "UPCOMING EVENTS:\n" + JSON.stringify(events) + "\n\n";
            }
        } catch (e) {
            console.error("Exception fetching events:", e);
        }

        // Fetch verified knowledge base
        try {
            const { data: knowledge, error: knowledgeError } = await supabaseAdmin
                .from("msai_knowledge")
                .select("title, content, source")
                .eq("is_verified", true)
                .limit(3);

            if (knowledgeError) console.error("Error fetching knowledge:", knowledgeError);
            if (knowledge && knowledge.length > 0) {
                context += "RELEVANT KNOWLEDGE:\n" + JSON.stringify(knowledge) + "\n\n";
            }
        } catch (e) {
            console.error("Exception fetching knowledge:", e);
        }

        // 2. Call Gemini
        const responseText = await chatWithGemini(history || [], message, context);

        // 3. Store Chat History (if user is logged in)
        if (userId) {
            try {
                // Store User Message
                await supabaseAdmin.from("msai_chats").insert({
                    user_id: userId,
                    role: "user",
                    content: message,
                    session_id: req.body.sessionId // Assuming frontend sends this
                });

                // Store Assistant Message
                await supabaseAdmin.from("msai_chats").insert({
                    user_id: userId,
                    role: "assistant",
                    content: responseText,
                    session_id: req.body.sessionId
                });
            } catch (e) {
                console.error("Error storing chat history:", e);
            }
        }

        res.json({ response: responseText });

    } catch (error) {
        console.error("Error in handleChat:", error);
        res.status(500).json({ error: "Failed to process chat request" });
    }
};
