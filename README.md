# AI KOL Outreach Assistant

AI-powered KOL (Key Opinion Leader) discovery, profile analysis, and personalized outreach email generation for global marketing teams.

![MVP v0.1](https://img.shields.io/badge/MVP-v0.1-e94560)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-10a37f)
![License](https://img.shields.io/badge/license-MIT-blue)

## What It Does

- **KOL Discovery** — Import KOLs from YouTube, Instagram, TikTok. Search and filter by niche, region, and platform.
- **AI Profile Analysis** — GPT-4o analyzes content style, audience demographics, engagement quality, and brand fit score.
- **Smart Email Generator** — Generate personalized outreach emails in any language (EN, PT, ES, AR, FR) with configurable tone and cooperation type.
- **Campaign Tracker** — Track outreach campaigns with pipeline stats (sent → replied → converted).

## Quick Start

### Prerequisites

- Node.js 18+
- An OpenAI API key ([get one here](https://platform.openai.com/api-keys))

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/ai-kol-assistant.git
cd ai-kol-assistant

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local and add your OPENAI_API_KEY

# Set up the database
npx prisma generate
npx prisma db push

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS |
| AI Engine | OpenAI GPT-4o |
| Database | SQLite via Prisma ORM |
| Icons | Lucide React |
| Deployment | Vercel |

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Dashboard
│   ├── layout.tsx        # Root layout with sidebar
│   ├── kols/
│   │   ├── page.tsx      # KOL list & import
│   │   └── [id]/page.tsx # KOL detail & AI analysis
│   ├── email/
│   │   └── page.tsx      # AI email generator
│   └── campaigns/
│       └── page.tsx      # Campaign tracker
├── components/
│   └── Sidebar.tsx       # Navigation sidebar
└── lib/
    ├── prisma.ts         # Database client
    └── openai.ts         # AI functions (analysis + email gen)
prisma/
└── schema.prisma         # Data models
```

## Roadmap

- [ ] Real social media API integration (YouTube Data API, Instagram Graph API)
- [ ] Email sending via SMTP / Gmail API
- [ ] CSV/Excel bulk KOL import
- [ ] Multi-language UI (i18n)
- [ ] Analytics dashboard with charts
- [ ] User authentication
- [ ] Team collaboration features

## Built With Vibe Coding

This project was built using **Vibe Coding** — a natural-language-driven development approach where AI writes the code while humans define the product vision, business logic, and user experience.

## License

MIT
