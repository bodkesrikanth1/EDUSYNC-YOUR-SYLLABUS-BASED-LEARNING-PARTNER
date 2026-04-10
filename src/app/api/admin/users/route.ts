import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET all users with relation counts
export async function GET() {
    try {
        const users = await prisma.user.findMany({
            include: {
                _count: {
                    select: { syllabi: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        
        const stats = {
            syllabi: await prisma.syllabus.count(),
            topics: await prisma.topic.count(),
            users: users.length
        };

        return NextResponse.json({ success: true, users, stats });
    } catch (error) {
        return NextResponse.json({ error: "Unauthorized or server error" }, { status: 500 });
    }
}

// POST create new user
export async function POST(req: Request) {
    try {
        const { email, password, fullName, role } = await req.json();
        const passwordHash = await bcrypt.hash(password, 10);
        
        const user = await prisma.user.create({
            data: { email, passwordHash, fullName, role }
        });

        return NextResponse.json({ success: true, user });
    } catch (error) {
        return NextResponse.json({ error: "Could not create user" }, { status: 400 });
    }
}

// PATCH toggle role or edit
export async function PATCH(req: Request) {
    try {
        const { id, role } = await req.json();
        const updated = await prisma.user.update({
            where: { id },
            data: { role }
        });
        return NextResponse.json({ success: true, user: updated });
    } catch (error) {
        return NextResponse.json({ error: "Update failed" }, { status: 400 });
    }
}

// DELETE user
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "ID missing" }, { status: 400 });

        await prisma.user.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Delete failed" }, { status: 400 });
    }
}
