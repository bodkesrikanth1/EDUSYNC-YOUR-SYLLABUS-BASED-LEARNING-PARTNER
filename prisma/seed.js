const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = "admin@edusync.com";
  const password = "demo";
  const passwordHash = await bcrypt.hash(password, 10);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`User ${email} already exists. Skipping.`);
    return;
  }

  const user = await prisma.user.create({
    data: {
      email,
      fullName: "System Admin",
      passwordHash,
      role: "ADMIN",
      college: "EduSync HQ",
      department: "Education AI",
      year: "2026",
      enrollmentNo: "ADMIN-001"
    }
  });

  console.log(`Seed success! Created admin user:`);
  console.log(`Email: ${user.email}`);
  console.log(`Password: demo`);
  console.log(`Role: ${user.role}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
