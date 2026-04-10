# EduSync Your Syllabus (Next.js Version)

EduSync is a premium educational platform that transforms paper-based syllabi into personalized digital learning experiences with AI-powered topic extraction and intelligent YouTube video recommendations.

## 🚀 Features

- **Syllabus Scaling**: Convert any document text into a structured unit-topic map.
- **AI Topic Extraction**: Automatically identifies key concepts using NLP.
- **Smart Recommendations**: Curates top 1% YouTube content based on relevance, quality, and difficulty.
- **Rich Filtering**: Filter by Duration (Short/Med/Long), Difficulty (Beg/Int/Adv), and Rating.
- **Admin Dashboard**: Manage users and view system-wide analytics.
- **Premium UI**: Modern dark theme with glassmorphism and smooth animations.

## 🛠️ Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Database**: PostgreSQL (Prisma ORM)
- **Styling**: Tailwind CSS + Framer Motion
- **Icons**: Lucide React
- **API**: YouTube Data API v3
- **Parsing**: Mammoth (Docx)

## 🏁 Getting Started

### 1. Prerequisites
- Node.js 20+
- PostgreSQL Database (Supabase or Vercel Postgres recommended)

### 2. Configuration
Create a `.env` file in the root (use `.env.example` as a template):
```env
DATABASE_URL="postgresql://..."
YOUTUBE_API_KEY="AIza..."
```

### 3. Installation
```bash
npm install
```

### 4. Database Setup
```bash
npx prisma db push
```

### 5. Run Locally
```bash
npm run dev
```

## 🚢 Deployment (Vercel)

1. Connect your GitHub repository to Vercel.
2. Add environment variables (`DATABASE_URL`, `YOUTUBE_API_KEY`) in Vercel project settings.
3. Vercel will automatically build and deploy the application.
4. Ensure your database allows connections from Vercel's IP range (or use Supabase/Neon).

---
*Built with ❤️ for EdusyncYourSyllabus*
