# AI Outreach Hub

**From Contact to Connection — Powered by AI**

AI-powered multilingual outreach platform for global business development teams. Manage contacts, generate personalized messages, and track outreach across Email, WhatsApp, and Instagram.

![Version](https://img.shields.io/badge/version-0.2.0-e94560)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-10a37f)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## What It Does

- **Contact Management** — Import and organize contacts from YouTube, Instagram, TikTok, or any platform. Search and filter by type, niche, region, and priority.
- **AI Profile Analysis** — GPT-4o analyzes content style, audience demographics, engagement quality, and brand fit score.
- **Multilingual Outreach Generator** — Generate personalized messages in English, Portuguese, Spanish, or Chinese. Supports Email, WhatsApp, and Instagram DM channels.
- **Batch Generation** — Create messages for multiple contacts at once with channel-specific formatting.
- **Campaign Tracker** — Track outreach status across your pipeline: Not Contacted → Sent → Replied → Converted.
- **One-Click Send** — Open messages directly in your email client, WhatsApp Web, or Instagram DM.

## Quick Start

### Prerequisites

- Node.js 18+
- An OpenAI API key ([get one here](https://platform.openai.com/api-keys))

### Installation

```bash
# Clone the repo
git clone https://github.com/Xumenghua1110/outreach-hub.git
cd ai-outreach-hub

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

## Configuration

All brand-specific content is centralized in `src/config/`. Edit these files to customize for your organization:

| File | Purpose |
|------|---------|
| `src/config/brand.config.ts` | Company name, website, sender info, contact types, supported languages |
| `src/config/templates.config.ts` | Message templates for each channel and language (uses `{variable}` syntax) |
| `src/config/prompts.config.ts` | AI system prompts for profile analysis and outreach generation |

### Brand Configuration

```typescript
// src/config/brand.config.ts
export const brandConfig = {
  brand: {
    companyName: "Your Company",
    website: "https://yourcompany.com",
    productDescription: {
      English: "Describe your company and products in English",
      Portuguese: "Descreva sua empresa e produtos em português",
      Spanish: "Describe tu empresa y productos en español",
      Chinese: "用中文描述你的公司和产品",
    },
  },
  sender: {
    name: "Your Name",
    email: "you@yourcompany.com",
    title: "Business Development Manager",
    phone: "+1-234-567-8900",
  },
};
```

### Template Variables

Templates support these variables: `{contactName}`, `{greeting}`, `{niche}`, `{region}`, `{platform}`, `{brandName}`, `{website}`, `{productDescription}`, `{senderName}`, `{senderTitle}`, `{senderPhone}`, `{senderEmail}`.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| AI Engine | OpenAI GPT-4o |
| Database | SQLite / PostgreSQL via Prisma ORM |
| Icons | Lucide React |
| Spreadsheet | SheetJS (xlsx) for import/export |
| Deployment | GitHub Pages / Vercel / Netlify |

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Dashboard with stats and quick actions
│   ├── layout.tsx            # Root layout with sidebar navigation
│   ├── contacts/
│   │   ├── page.tsx          # Contact list with search and filters
│   │   └── [id]/page.tsx     # Contact detail with AI analysis
│   ├── outreach/
│   │   └── page.tsx          # AI message generator (single + batch)
│   ├── import/
│   │   └── page.tsx          # CSV/Excel contact import
│   ├── sent/
│   │   └── page.tsx          # Sent message history
│   └── campaigns/
│       └── page.tsx          # Campaign tracker and pipeline
├── config/
│   ├── brand.config.ts       # Brand and sender configuration
│   ├── templates.config.ts   # Message templates (i18n)
│   └── prompts.config.ts     # AI prompt configuration
├── components/
│   └── Sidebar.tsx           # Navigation sidebar
└── lib/
    ├── demoData.ts           # Data layer with localStorage persistence
    └── openai.ts             # AI functions (analysis + generation)
```

## Deployment

### GitHub Pages

The project includes a GitHub Actions workflow for automatic deployment:

```bash
# Push to main branch triggers deployment
git push origin main
```

### Vercel

```bash
npm i -g vercel
vercel
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | Your OpenAI API key |
| `OPENAI_BASE_URL` | No | Custom API endpoint (defaults to `https://api.openai.com/v1`) |
| `DATABASE_URL` | No | Database connection string (defaults to local SQLite) |

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

[MIT](LICENSE)
