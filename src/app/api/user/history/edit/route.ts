import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Rename Syllabus
export async function PATCH(req: Request) {
    try {
        const { id, title } = await req.json();
        if (!id || !title) return NextResponse.json({ error: "Missing data" }, { status: 400 });

        const updated = await prisma.syllabus.update({
            where: { id },
            data: { title }
        });

        return NextResponse.json({ success: true, syllabus: updated });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// Delete Syllabus
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

        await prisma.syllabus.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
