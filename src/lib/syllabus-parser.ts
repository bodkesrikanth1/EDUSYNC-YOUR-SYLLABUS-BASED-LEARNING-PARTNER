import mammoth from "mammoth";
import natural from "natural";

export async function parseDocx(buffer: Buffer): Promise<string> {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
}

export interface ParsedUnit {
    unitNo: number;
    unitTitle: string;
    content: string;
}

export function parseSyllabusIntoUnits(text: string): ParsedUnit[] {
    // Regex splits by UNIT I, UNIT 1, MODULE 1, CHAPTER 1 etc.
    const unitRegex = /(?:UNIT|MODULE|CHAPTER)\s+([IVX0-9]+)[:.-]?\s*([^\n]*)/gi;
    
    const units: ParsedUnit[] = [];
    let match;
    let unitCount = 0;
    
    // We first find all starting positions
    const matches = [];
    while ((match = unitRegex.exec(text)) !== null) {
        matches.push({
            index: match.index,
            unitNo: match[1],
            unitTitle: match[2]?.trim() || `Unit ${unitCount + 1}`
        });
    }

    if (matches.length > 0) {
        for (let i = 0; i < matches.length; i++) {
            const start = matches[i].index;
            const end = matches[i + 1] ? matches[i + 1].index : text.length;
            const content = text.substring(start, end).trim();
            
            unitCount++;
            units.push({
                unitNo: unitCount,
                unitTitle: matches[i].unitTitle,
                content: content
            });
        }
    } else {
        // Fallback: entire text as Unit 1
        units.push({ 
            unitNo: 1, 
            unitTitle: "General Syllabus", 
            content: text.trim() 
        });
    }

    return units;
}

/**
 * Extract Topics using TF-IDF logic across units.
 * Treats each unit as a document in the corpus.
 */
export function extractTopicsFromUnits(units: ParsedUnit[]): Record<number, string[]> {
    const tfidf = new natural.TfIdf();
    const result: Record<number, string[]> = {};

    // Add each unit to the corpus
    units.forEach(u => {
        tfidf.addDocument(u.content.toLowerCase());
    });

    const stopWords = new Set(["the", "a", "is", "of", "and", "or", "in", "with", "to", "for", "on", "by", "its", "it", "from", "at", "as", "an", "be", "this", "that", "unit", "module", "chapter", "syllabus", "course", "topics", "learn", "study", "introduction", "basics", "simple", "concept"]);

    // For each unit, get top topics based on TF-IDF measures
    for (let i = 0; i < units.length; i++) {
        const terms = tfidf.listTerms(i)
            .filter(t => t.term.length > 3 && !stopWords.has(t.term))
            .slice(0, 8) // Top 8 terms
            .map(t => t.term);
        
        // Enhance with Bi-grams that represent phrases
        const phrases = extractPhrases(units[i].content, 3);
        const combined = Array.from(new Set([...phrases, ...terms])).slice(0, 10);
        
        result[units[i].unitNo] = combined;
    }

    return result;
}

function extractPhrases(content: string, limit: number): string[] {
    const stopWords = new Set(["the", "and", "data", "unit", "introduction", "basics"]);
    const words = content.toLowerCase().replace(/[^a-z\s]/g, " ").split(/\s+/).filter(w => w.length > 2);
    const phrases: Record<string, number> = {};
    
    for (let i = 0; i < words.length - 1; i++) {
        if (!stopWords.has(words[i]) && !stopWords.has(words[i+1])) {
            const bigram = `${words[i]} ${words[i+1]}`;
            phrases[bigram] = (phrases[bigram] || 0) + 1;
        }
    }

    return Object.entries(phrases)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(e => e[0]);
}
