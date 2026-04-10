import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseSyllabusIntoUnits, extractTopicsFromUnits } from "@/lib/syllabus-parser";
import { searchVideos } from "@/lib/youtube-api";
import { generateTopicNotes } from "@/lib/gemini-ai";

export async function POST(req: NextRequest) {
    try {
        const { title, syllabusText, userId } = await req.json();

        if (!title || !syllabusText) {
            return NextResponse.json({ error: "Missing title or syllabus text" }, { status: 400 });
        }

        // 1. Get User
        let finalUserId = userId;
        if (!finalUserId) {
            const firstUser = await prisma.user.findFirst();
            if (firstUser) {
                finalUserId = firstUser.id;
            } else {
                return NextResponse.json({ error: "No user found in system. Please register first." }, { status: 403 });
            }
        }

        // 2. Create Syllabus
        const syllabus = await prisma.syllabus.create({
            data: {
                title,
                text: syllabusText,
                userId: finalUserId
            }
        });

        // 2. Parse into Units
        const units = parseSyllabusIntoUnits(syllabusText);
        
        // 3. Extract Topics using TF-IDF logic across units
        const unitTopics = extractTopicsFromUnits(units);

        // 4. Create Units and Topics
        for (const u of units) {
            const unit = await prisma.unit.create({
                data: {
                    syllabusId: syllabus.id,
                    unitNo: u.unitNo,
                    unitTitle: u.unitTitle
                }
            });

            const topics = unitTopics[u.unitNo] || [];

            // 5. Search YouTube and generate AI notes for each Topic
            for (const tText of topics) {
                // Parallelize search and AIGeneration for speed
                const [aiResult, videos] = await Promise.all([
                    generateTopicNotes(tText),
                    searchVideos(tText, 15)
                ]);

                const topic = await prisma.topic.create({
                    data: {
                        unitId: unit.id,
                        text: tText,
                        summary: aiResult.summary,
                        notes: aiResult.notes
                    }
                });

                // Store videos
                if (videos.length > 0) {
                    await prisma.video.createMany({
                        data: videos.map(v => ({
                            topicId: topic.id,
                            youtubeId: v.youtubeId,
                            title: v.title,
                            channelTitle: v.channelTitle,
                            channelId: v.channelId,
                            durationSec: v.durationSec,
                            viewCount: v.viewCount,
                            publishedAt: new Date(v.publishedAt),
                            ratingScore: v.ratingScore,
                            similarity: v.similarity,
                            finalScore: v.finalScore,
                            difficulty: v.difficulty,
                            url: v.url,
                            thumbnailUrl: v.thumbnail
                        }))
                    });
                }
            }
        }

        return NextResponse.json({ success: true, syllabusId: syllabus.id });
    } catch (error: any) {
        console.error("Processing API error:", error?.message);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
