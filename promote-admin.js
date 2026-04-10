const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function promote(email) {
    if (!email) {
        console.error("Please provide an email: node promote-admin.js <email>");
        process.exit(1);
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            console.error(`User with email ${email} not found.`);
            process.exit(1);
        }

        const updated = await prisma.user.update({
            where: { email },
            data: { role: 'ADMIN' }
        });

        console.log(`Success! ${updated.fullName} (${updated.email}) is now an ADMIN.`);
        console.log(`You can now access the Admin Registry at: http://localhost:3000/admin`);
    } catch (error) {
        console.error("Error promoting user:", error);
    } finally {
        await prisma.$disconnect();
    }
}

const email = process.argv[2];
promote(email);
