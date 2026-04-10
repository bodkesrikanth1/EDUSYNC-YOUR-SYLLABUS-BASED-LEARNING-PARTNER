const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const id = '69c502d3105cc1848d9e70ce';
  const syllabus = await prisma.syllabus.findUnique({
    where: { id },
    include: {
      units: {
        include: {
          topics: {
            include: {
              videos: true
            }
          }
        }
      }
    }
  });

  if (!syllabus) {
    console.log("NOT FOUND");
    return;
  }

  console.log("Syllabus:", syllabus.title);
  console.log("Units Count:", syllabus.units.length);
  for (const u of syllabus.units) {
    console.log(`- Unit ${u.unitNo}: ${u.topics.length} topics`);
    for (const t of u.topics) {
      console.log(`  - Topic ${t.text}: ${t.videos.length} videos`);
      for (const v of t.videos) {
        console.log(`    - Video: ${v.title} (finalScore: ${v.finalScore}, duration: ${v.durationSec})`);
      }
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
