import axios from "axios";
import { TfIdf, WordTokenizer, stopwords } from "natural";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export interface YouTubeVideo {
  id: string;
  youtubeId: string;
  title: string;
  description: string;
  channelTitle: string;
  channelId: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: number;
  durationSec: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  score: number;
  similarity: number;
  ratingScore: number;
  finalScore: number;
  url: string;
}

const tokenizer = new WordTokenizer();

function cleanText(text: string): string {
    const tokens = tokenizer.tokenize(text.toLowerCase()) || [];
    return tokens
        .filter(t => !stopwords.includes(t) && t.length > 2)
        .join(" ");
}

function computeSimilarity(query: string, documents: string[]): number[] {
    const tfidf = new TfIdf();
    
    // Corpus: Query (doc 0) + Documents (docs 1 to N)
    tfidf.addDocument(cleanText(query));
    documents.forEach(doc => tfidf.addDocument(cleanText(doc)));

    const numDocs = documents.length;
    const vocabulary = new Set<string>();
    
    // Build vocabulary from query (doc 0)
    tfidf.listTerms(0).forEach(term => vocabulary.add(term.term));

    const queryVector: Record<string, number> = {};
    tfidf.listTerms(0).forEach(term => {
        queryVector[term.term] = term.tfidf;
    });

    const similarities: number[] = [];

    for (let i = 1; i <= numDocs; i++) {
        const docVector: Record<string, number> = {};
        tfidf.listTerms(i).forEach(term => {
            if (vocabulary.has(term.term)) {
                docVector[term.term] = term.tfidf;
            }
        });

        // Compute Cosine Similarity between queryVector and docVector
        let dotProduct = 0;
        let queryNorm = 0;
        let docNorm = 0;

        for (const term of Array.from(vocabulary)) {
            const qVal = queryVector[term] || 0;
            const dVal = docVector[term] || 0;
            dotProduct += qVal * dVal;
            queryNorm += qVal * qVal;
            docNorm += dVal * dVal;
        }

        const similarity = (queryNorm > 0 && docNorm > 0) 
            ? dotProduct / (Math.sqrt(queryNorm) * Math.sqrt(docNorm)) 
            : 0;
        
        similarities.push(similarity);
    }

    return similarities;
}

async function getChannelSubscribers(api_key: string, channelIds: string[]): Promise<Record<string, number>> {
    try {
        const uniqueIds = Array.from(new Set(channelIds)).join(",");
        const r = await axios.get(`https://www.googleapis.com/youtube/v3/channels`, {
            params: {
                part: "statistics",
                id: uniqueIds,
                key: api_key
            }
        });

        const stats: Record<string, number> = {};
        r.data.items?.forEach((item: any) => {
            const s = item.statistics;
            const subs = s.hiddenSubscriberCount ? 0 : parseInt(s.subscriberCount || "0");
            stats[item.id] = subs;
        });
        return stats;
    } catch (e) {
        return {};
    }
}

function getRecencyScore(publishedAt: string): number {
    try {
        const dt = new Date(publishedAt);
        const now = new Date();
        const days = Math.floor((now.getTime() - dt.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        // Newer => higher score, simple inverse log
        return 1.0 / Math.log10(days + 10);
    } catch (e) {
        return 0.5;
    }
}

function getDifficulty(title: string, desc: string): "beginner" | "intermediate" | "advanced" {
    const text = `${title} ${desc}`.toLowerCase();
    if (["beginner", "intro", "introduction", "for beginners", "101", "basics"].some(k => text.includes(k))) {
        return "beginner";
    }
    if (["advanced", "expert", "graduate", "research"].some(k => text.includes(k))) {
        return "advanced";
    }
    return "intermediate";
}

function normalize(arr: number[]): number[] {
    if (arr.length === 0) return [];
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    if (max - min < 1e-9) return arr.map(() => 0.5);
    return arr.map(x => (x - min) / (max - min));
}

export async function searchVideos(topic: string, maxResults: number = 15): Promise<YouTubeVideo[]> {
    if (!YOUTUBE_API_KEY) {
        console.warn("YouTube API Key missing.");
        return [];
    }

    try {
        // 1) Search
        const searchRes = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
            params: {
                part: "snippet",
                q: topic,
                type: "video",
                maxResults: Math.min(maxResults, 25),
                relevanceLanguage: "en",
                safeSearch: "moderate",
                key: YOUTUBE_API_KEY,
            }
        });

        const items = searchRes.data.items || [];
        if (items.length === 0) return [];

        const ids = items.map((it: any) => it.id.videoId).join(",");

        // 2) Detail
        const statsRes = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
            params: {
                part: "snippet,contentDetails,statistics",
                id: ids,
                key: YOUTUBE_API_KEY,
            }
        });

        const details = statsRes.data.items || [];
        const channelIds = details.map((d: any) => d.snippet.channelId);
        const subCounts = await getChannelSubscribers(YOUTUBE_API_KEY, channelIds);

        const videoDocs = details.map((d: any) => `${d.snippet.title}. ${d.snippet.description || ""}`);
        const sims = computeSimilarity(topic, videoDocs);

        // Compute rating-like score
        const ratings = details.map((d: any) => {
            const views = parseInt(d.statistics.viewCount || "0");
            const subs = subCounts[d.snippet.channelId] || 0;
            const rec = getRecencyScore(d.snippet.publishedAt);
            return Math.log10(views + 1) + 0.5 * Math.log10(subs + 1) + 0.6 * rec;
        });

        const sims_n = normalize(sims);
        const rating_n = normalize(ratings);

        const ranked: YouTubeVideo[] = details.map((d: any, i: number) => {
            const durationSec = parseISO8601Duration(d.contentDetails.duration);
            const difficulty = getDifficulty(d.snippet.title, d.snippet.description);
            
            // Final Weighted Score: 60% similarity, 30% rating, 10% optimal duration (4m to 20m)
            const durationBonus = (durationSec >= 240 && durationSec <= 1200) ? 1 : 0.5;
            const finalScore = (0.6 * sims_n[i]) + (0.3 * rating_n[i]) + (0.1 * durationBonus);

            return {
                id: d.id,
                youtubeId: d.id,
                title: d.snippet.title,
                description: d.snippet.description,
                channelTitle: d.snippet.channelTitle,
                channelId: d.snippet.channelId,
                thumbnail: d.snippet.thumbnails.high?.url || d.snippet.thumbnails.medium?.url || d.snippet.thumbnails.default?.url,
                publishedAt: d.snippet.publishedAt,
                viewCount: parseInt(d.statistics.viewCount || "0"),
                durationSec,
                difficulty,
                similarity: parseFloat(sims_n[i].toFixed(4)),
                ratingScore: parseFloat(rating_n[i].toFixed(4)),
                score: parseFloat(finalScore.toFixed(4)),
                finalScore: parseFloat(finalScore.toFixed(4)),
                url: `https://www.youtube.com/watch?v=${d.id}`
            };
        });

        return ranked.sort((a, b) => b.finalScore - a.finalScore);
    } catch (error: any) {
        console.error("YouTube search error:", error?.message);
        return [];
    }
}

function parseISO8601Duration(duration: string): number {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const matches = duration.match(regex);
    if (!matches) return 0;
    
    const hours = parseInt(matches[1] || '0');
    const minutes = parseInt(matches[2] || '0');
    const seconds = parseInt(matches[3] || '0');
    
    return hours * 3600 + minutes * 60 + seconds;
}

