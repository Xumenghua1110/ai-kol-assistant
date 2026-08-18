export interface KOL {
  id: string;
  name: string;
  platform: string;
  followers: number;
  niche: string | null;
  region: string | null;
  engagement: string | null;
  status: string;
  language: string;
  tier: string;
  priority: string;
  profileUrl: string | null;
  contactInfo: {
    emails: string[];
    phones: string[];
    instagrams: string[];
    youtubes: string[];
  };
  notes?: string;
  engagementRate?: number;
  avgViews?: number;
  analyses?: Analysis[];
  emails?: EmailRecord[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Analysis {
  id: string;
  contentStyle: string | null;
  audienceProfile: string | null;
  engagementQuality: string | null;
  brandFitScore: number | null;
  recommendations: string | null;
  riskFactors: string | null;
  createdAt: string;
}

export interface EmailRecord {
  id: string;
  subject: string | null;
  body: string;
  language: string;
  status: string;
  channel: string;
  cooperationType: string;
  kolId: string | null;
  createdAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: string;
  notes: string | null;
  createdAt: string;
}

export const demoKols: KOL[] = [
  {
    id: "1",
    name: "Energia Solar Master",
    platform: "YouTube",
    followers: 245000,
    niche: "Solar Energy",
    region: "Brazil",
    engagement: "High",
    status: "Contacted",
    language: "Portuguese",
    tier: "Macro",
    priority: "High",
    profileUrl: "https://youtube.com/@energiasolarmaster",
    contactInfo: {
      emails: ["contato@energiasolarmaster.com.br"],
      phones: ["+5511999998888"],
      instagrams: ["energiasolarmaster"],
      youtubes: ["@energiasolarmaster"],
    },
    notes: "Leading solar education channel in Brazil",
    engagementRate: 4.2,
    avgViews: 35000,
    analyses: [
      {
        id: "a1",
        contentStyle: "Professional tutorials with hands-on installation demos. High production quality with clear explanations in Portuguese.",
        audienceProfile: "Brazilian solar installers and homeowners interested in renewable energy. Age 25-55, primarily male.",
        engagementQuality: "High",
        brandFitScore: 8.5,
        recommendations: '["Partner for product review video","Sponsor a tutorial series","Co-create installation guide content"]',
        riskFactors: '["Very selective about brand partnerships","Requires 2-week lead time for content"]',
        createdAt: "2026-08-01T00:00:00Z",
      },
    ],
    emails: [
      {
        id: "e1",
        subject: "Partnership Opportunity - Ktech Solar Inverters",
        body: "Hi Energia Solar Master team,\n\nI've been following your channel and love your detailed installation tutorials...",
        language: "Portuguese",
        status: "Sent",
        channel: "email",
        cooperationType: "gift",
        kolId: "1",
        createdAt: "2026-08-05T00:00:00Z",
      },
    ],
    createdAt: "2026-08-01T00:00:00Z",
    updatedAt: "2026-08-05T00:00:00Z",
  },
  {
    id: "2",
    name: "Solar Brasil",
    platform: "YouTube",
    followers: 180000,
    niche: "Solar Installation",
    region: "Brazil",
    engagement: "High",
    status: "New",
    language: "Portuguese",
    tier: "Macro",
    priority: "Medium",
    profileUrl: "https://youtube.com/@solarbrasil",
    contactInfo: {
      emails: ["contato@solarbrasil.com.br"],
      phones: [],
      instagrams: ["solarbrasil"],
      youtubes: ["@solarbrasil"],
    },
    notes: "Focus on commercial solar installations",
    engagementRate: 3.8,
    avgViews: 22000,
    analyses: [],
    emails: [],
    createdAt: "2026-08-02T00:00:00Z",
    updatedAt: "2026-08-02T00:00:00Z",
  },
  {
    id: "3",
    name: "El profe chris",
    platform: "YouTube",
    followers: 95000,
    niche: "Solar Education",
    region: "Mexico",
    engagement: "Medium",
    status: "Analyzed",
    language: "Spanish",
    tier: "Micro",
    priority: "Medium",
    profileUrl: "https://youtube.com/@elprofechris",
    contactInfo: {
      emails: ["christian@elprofechris.com"],
      phones: [],
      instagrams: ["elprofechris"],
      youtubes: ["@elprofechris"],
    },
    notes: "Educational content creator, very engaging teaching style",
    engagementRate: 5.1,
    avgViews: 15000,
    analyses: [
      {
        id: "a3",
        contentStyle: "Engaging educational content with clear explanations. Uses real-world examples and analogies.",
        audienceProfile: "Spanish-speaking homeowners and small business owners interested in solar energy.",
        engagementQuality: "Medium",
        brandFitScore: 7.2,
        recommendations: '["Sponsor an educational series","Provide equipment for hands-on demo"]',
        riskFactors: '["Smaller audience but highly engaged","Prefers long-term partnerships"]',
        createdAt: "2026-08-03T00:00:00Z",
      },
    ],
    emails: [],
    createdAt: "2026-08-03T00:00:00Z",
    updatedAt: "2026-08-03T00:00:00Z",
  },
  {
    id: "4",
    name: "Solar Culture",
    platform: "Instagram",
    followers: 45000,
    niche: "Solar Installation",
    region: "Brazil",
    engagement: "High",
    status: "Contacted",
    language: "Portuguese",
    tier: "Micro",
    priority: "Medium",
    profileUrl: "https://instagram.com/solarculture",
    contactInfo: {
      emails: ["hello@solarculture.com.br"],
      phones: ["+5511888887777"],
      instagrams: ["solarculture"],
      youtubes: [],
    },
    notes: "Instagram-first content creator",
    engagementRate: 6.3,
    avgViews: 8000,
    analyses: [],
    emails: [
      {
        id: "e4",
        subject: "Collaboration Proposal",
        body: "Hi Solar Culture team...",
        language: "Portuguese",
        status: "Sent",
        channel: "email",
        cooperationType: "paid",
        kolId: "4",
        createdAt: "2026-08-06T00:00:00Z",
      },
    ],
    createdAt: "2026-08-04T00:00:00Z",
    updatedAt: "2026-08-06T00:00:00Z",
  },
  {
    id: "5",
    name: "Jeff Bala",
    platform: "Instagram",
    followers: 32000,
    niche: "Solar Energy",
    region: "USA",
    engagement: "Medium",
    status: "New",
    language: "English",
    tier: "Micro",
    priority: "Low",
    profileUrl: "https://instagram.com/jeffbala",
    contactInfo: {
      emails: [],
      phones: [],
      instagrams: ["jeffbala"],
      youtubes: [],
    },
    notes: "US-based solar enthusiast",
    engagementRate: 3.5,
    avgViews: 5000,
    analyses: [],
    emails: [],
    createdAt: "2026-08-05T00:00:00Z",
    updatedAt: "2026-08-05T00:00:00Z",
  },
  {
    id: "6",
    name: "Marcio Takata",
    platform: "YouTube",
    followers: 520000,
    niche: "Solar Industry News",
    region: "Brazil",
    engagement: "High",
    status: "Contacted",
    language: "Portuguese",
    tier: "Macro",
    priority: "Critical",
    profileUrl: "https://youtube.com/@marciotakata",
    contactInfo: {
      emails: ["contato@marciotakata.com.br"],
      phones: ["+5511777776666"],
      instagrams: ["marciotakata"],
      youtubes: ["@marciotakata"],
    },
    notes: "Industry leader, strategic cooperation opportunity",
    engagementRate: 3.9,
    avgViews: 80000,
    analyses: [],
    emails: [],
    createdAt: "2026-08-01T00:00:00Z",
    updatedAt: "2026-08-07T00:00:00Z",
  },
  {
    id: "7",
    name: "Lucas Mannelli",
    platform: "Instagram",
    followers: 28000,
    niche: "Solar Installation",
    region: "Argentina",
    engagement: "High",
    status: "New",
    language: "Spanish",
    tier: "Micro",
    priority: "Medium",
    profileUrl: "https://instagram.com/lucasmannelli",
    contactInfo: {
      emails: ["lucas@solarinstall.ar"],
      phones: ["+5491155554444"],
      instagrams: ["lucasmannelli"],
      youtubes: [],
    },
    notes: "Installation company founder",
    engagementRate: 7.2,
    avgViews: 4500,
    analyses: [],
    emails: [],
    createdAt: "2026-08-06T00:00:00Z",
    updatedAt: "2026-08-06T00:00:00Z",
  },
  {
    id: "8",
    name: "Solar Tech Review",
    platform: "YouTube",
    followers: 156000,
    niche: "Solar Product Reviews",
    region: "USA",
    engagement: "Medium",
    status: "Analyzed",
    language: "English",
    tier: "Macro",
    priority: "High",
    profileUrl: "https://youtube.com/@solartechreview",
    contactInfo: {
      emails: ["reviews@solartechreview.com"],
      phones: [],
      instagrams: ["solartechreview"],
      youtubes: ["@solartechreview"],
    },
    notes: "Detailed product review channel",
    engagementRate: 4.5,
    avgViews: 25000,
    analyses: [],
    emails: [],
    createdAt: "2026-08-02T00:00:00Z",
    updatedAt: "2026-08-08T00:00:00Z",
  },
  {
    id: "9",
    name: "Energia Limpia MX",
    platform: "YouTube",
    followers: 67000,
    niche: "Clean Energy",
    region: "Mexico",
    engagement: "Medium",
    status: "New",
    language: "Spanish",
    tier: "Micro",
    priority: "Low",
    profileUrl: "https://youtube.com/@energialimpiamx",
    contactInfo: {
      emails: ["info@energialimpia.mx"],
      phones: [],
      instagrams: ["energialimpiamx"],
      youtubes: ["@energialimpiamx"],
    },
    notes: "Clean energy advocacy channel",
    engagementRate: 3.2,
    avgViews: 8000,
    analyses: [],
    emails: [],
    createdAt: "2026-08-07T00:00:00Z",
    updatedAt: "2026-08-07T00:00:00Z",
  },
  {
    id: "10",
    name: "Green Energy Colombia",
    platform: "Instagram",
    followers: 38000,
    niche: "Renewable Energy",
    region: "Colombia",
    engagement: "High",
    status: "Contacted",
    language: "Spanish",
    tier: "Micro",
    priority: "Medium",
    profileUrl: "https://instagram.com/greenenergyco",
    contactInfo: {
      emails: ["hello@greenenergyco.com"],
      phones: ["+573001234567"],
      instagrams: ["greenenergyco"],
      youtubes: [],
    },
    notes: "Growing presence in Colombian market",
    engagementRate: 5.8,
    avgViews: 6000,
    analyses: [],
    emails: [],
    createdAt: "2026-08-03T00:00:00Z",
    updatedAt: "2026-08-09T00:00:00Z",
  },
  {
    id: "11",
    name: "Solar Power Daily",
    platform: "YouTube",
    followers: 890000,
    niche: "Solar News & Reviews",
    region: "USA",
    engagement: "Medium",
    status: "New",
    language: "English",
    tier: "Mega",
    priority: "Critical",
    profileUrl: "https://youtube.com/@solarpowerdaily",
    contactInfo: {
      emails: ["partnerships@solarpowerdaily.com"],
      phones: [],
      instagrams: ["solarpowerdaily"],
      youtubes: ["@solarpowerdaily"],
    },
    notes: "Mega influencer in solar space",
    engagementRate: 2.8,
    avgViews: 150000,
    analyses: [],
    emails: [],
    createdAt: "2026-08-01T00:00:00Z",
    updatedAt: "2026-08-10T00:00:00Z",
  },
  {
    id: "12",
    name: "Instalador Solar Pro",
    platform: "Instagram",
    followers: 15000,
    niche: "Solar Installation Tips",
    region: "Chile",
    engagement: "High",
    status: "New",
    language: "Spanish",
    tier: "Nano",
    priority: "Low",
    profileUrl: "https://instagram.com/instaladorsolarpro",
    contactInfo: {
      emails: [],
      phones: ["+56987654321"],
      instagrams: ["instaladorsolarpro"],
      youtubes: [],
    },
    notes: "Micro influencer with loyal following",
    engagementRate: 8.1,
    avgViews: 2000,
    analyses: [],
    emails: [],
    createdAt: "2026-08-08T00:00:00Z",
    updatedAt: "2026-08-08T00:00:00Z",
  },
];

export const demoCampaigns: Campaign[] = [
  {
    id: "c1",
    name: "Brazil Solar Launch Q3",
    status: "Active",
    notes: "Targeting Brazilian solar KOLs for product launch",
    createdAt: "2026-07-15T00:00:00Z",
  },
  {
    id: "c2",
    name: "Latin America Expansion",
    status: "Planning",
    notes: "Expanding outreach to Mexico, Argentina, Colombia",
    createdAt: "2026-08-01T00:00:00Z",
  },
  {
    id: "c3",
    name: "US Market Pilot",
    status: "Completed",
    notes: "Initial outreach to US-based solar influencers",
    createdAt: "2026-06-01T00:00:00Z",
  },
];

export const demoSentMessages: EmailRecord[] = [
  {
    id: "e1",
    subject: "Partnership Opportunity - Ktech Solar Inverters",
    body: "Hi Energia Solar Master team,\n\nI've been following your channel and love your detailed installation tutorials. Your recent video on hybrid inverter setup was particularly impressive.\n\nI'm Eaea from Ktech Solar, a Chinese manufacturer specializing in hybrid and off-grid solar inverters. We're looking for authentic partners in the Brazilian solar market.\n\nWe'd love to send you our latest hybrid inverter for review. Would you be interested in a collaboration?\n\nBest regards,\nEaea\nKtech Solar",
    language: "Portuguese",
    status: "Sent",
    channel: "email",
    cooperationType: "gift",
    kolId: "1",
    createdAt: "2026-08-05T00:00:00Z",
  },
  {
    id: "e4",
    subject: "Collaboration Proposal",
    body: "Hi Solar Culture team,\n\nWe admire your Instagram content showcasing real solar installations. Your visual style perfectly matches our brand values.\n\nKtech Solar would like to propose a paid collaboration for Instagram Reels featuring our products.\n\nLooking forward to hearing from you!\n\nEaea | Ktech Solar",
    language: "Portuguese",
    status: "Sent",
    channel: "email",
    cooperationType: "paid",
    kolId: "4",
    createdAt: "2026-08-06T00:00:00Z",
  },
  {
    id: "e6",
    subject: "Strategic Partnership Inquiry",
    body: "Dear Marcio,\n\nAs a leading voice in the Brazilian solar industry, your influence is unmatched. Ktech Solar would like to explore a strategic cooperation including event sponsorship and joint market reports.\n\nWould you be available for a call next week?\n\nBest,\nEaea | Ktech Solar",
    language: "Portuguese",
    status: "Sent",
    channel: "whatsapp",
    cooperationType: "paid",
    kolId: "6",
    createdAt: "2026-08-07T00:00:00Z",
  },
  {
    id: "e10",
    subject: "Hola! Propuesta de colaboración",
    body: "Hola Green Energy Colombia,\n\nMe encanta su contenido sobre energía renovable. Soy Eaea de Ktech Solar...\n\n¿Les interesaría una colaboración?",
    language: "Spanish",
    status: "Sent",
    channel: "instagram",
    cooperationType: "gift",
    kolId: "10",
    createdAt: "2026-08-09T00:00:00Z",
  },
  {
    id: "e11",
    subject: "Product Review Opportunity",
    body: "Hi Solar Power Daily team,\n\nYour channel is the gold standard for solar product reviews. We'd be honored to have you review our latest inverter lineup.\n\nEaea | Ktech Solar",
    language: "English",
    status: "Sent",
    channel: "email",
    cooperationType: "paid",
    kolId: "11",
    createdAt: "2026-08-10T00:00:00Z",
  },
];

export function getDashboardStats() {
  return {
    kolCount: demoKols.length,
    emailCount: demoSentMessages.length + 3,
    sentEmails: demoSentMessages.length,
    repliedEmails: 2,
    responseRate: 40,
  };
}

export function getKolById(id: string): KOL | undefined {
  return demoKols.find((k) => k.id === id);
}
