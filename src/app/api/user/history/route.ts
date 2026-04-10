import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            // If no userId, return default/empty or find the first user for demo
            const firstUser = await prisma.user.findFirst();
            if (!firstUser) return NextResponse.json({ success: true, history: [], stats: { units: 0, topics: 0, syllabi: 0 } });
            
            const history = await prisma.syllabus.findMany({
                where: { userId: firstUser.id },
                orderBy: { createdAt: "desc" },
                include: {
                    _count: {
                        select: { units: true }
                    }
                }
            });

            // Calculate stats
            const syllabiCount = history.length;
            const unitsTotal = await prisma.unit.count({ where: { syllabus: { userId: firstUser.id } } });
            const topicsTotal = await prisma.topic.count({ where: { unit: { syllabus: { userId: firstUser.id } } } });

            return NextResponse.json({
                success: true,
                history,
                stats: {
                    units: unitsTotal,
                    topics: topicsTotal,
                    syllabi: syllabiCount
                }
            });
        }

        const history = await prisma.syllabus.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            include: {
                _count: {
                    select: { units: true }
                }
            }
        });

        const syllabiCount = history.length;
        const unitsTotal = await prisma.unit.count({ where: { syllabus: { userId } } });
        const topicsTotal = await prisma.topic.count({ where: { unit: { syllabus: { userId } } } });

        return NextResponse.json({
            success: true,
            history,
            stats: {
                units: unitsTotal,
                topics: topicsTotal,
                syllabi: syllabiCount
            }
        });
    } catch (error: any) {
        console.error("History API error:", error?.message);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
