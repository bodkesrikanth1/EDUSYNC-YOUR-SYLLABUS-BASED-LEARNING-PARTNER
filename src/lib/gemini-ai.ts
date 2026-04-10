import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.YOUTUBE_API_KEY || ""; // Reuse the same key if it's a Cloud Project key
const genAI = new GoogleGenerativeAI(API_KEY);

export async function generateTopicNotes(topic: string) {
    if (!API_KEY) {
        return {
            summary: `Learning about ${topic} starts with understanding the basic concepts and foundations. This topic covers the core principles and methodologies relevant to ${topic}.`,
            notes: `1. Core definition of ${topic}\n2. Key principles and theories\n3. Practical applications in the field\n4. Common challenges and complex scenarios`
        };
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Generate a 2-sentence educational summary and 4 bullet points of essential study notes for the academic topic: "${topic}". Format the output as a JSON object with keys "summary" and "notes" (notes should be a newline separated list).`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Basic JSON extraction from markdown if needed
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const data = JSON.parse(jsonMatch[0]);
            return {
                summary: data.summary,
                notes: data.notes
            };
        }

        return {
            summary: text.slice(0, 150),
            notes: text.split('\n').slice(0, 4).join('\n')
        };
    } catch (error) {
        console.error("Gemini AI error:", error);
        return {
            summary: `Deep dive into ${topic} through curated resources and structured learning.`,
            notes: `- Fundamentals of ${topic}\n- Key concepts and terminology\n- Real-world use cases\n- Expert insights`
        };
    }
}
