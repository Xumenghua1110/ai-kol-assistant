export const CONTACT_TYPES = ["KOL", "Association", "Media", "Distributor", "Installer", "Other"] as const;
export type ContactType = typeof CONTACT_TYPES[number];

export const OUTREACH_STATUS = ["Not Contacted", "Sent", "Replied", "Meeting", "Declined"] as const;
export type OutreachStatus = typeof OUTREACH_STATUS[number];

export interface Contact {
  id: string;
  name: string;
  type: ContactType;
  platform: string;
  followers: number;
  niche: string | null;
  region: string | null;
  engagement: string | null;
  status: OutreachStatus;
  language: string;
  tier: string;
  priority: string;
  source: string | null;
  profileUrl: string | null;
  website: string | null;
  contactInfo: {
    emails: string[];
    phones: string[];
    instagrams: string[];
    youtubes: string[];
  };
  contactPerson: string | null;
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

export const demoContacts: Contact[] = [
  {
    id: "1",
    name: "TechReview Global",
    type: "KOL",
    platform: "YouTube",
    followers: 320000,
    niche: "Consumer Technology",
    region: "USA",
    engagement: "High",
    status: "Sent",
    language: "English",
    tier: "Macro",
    priority: "High",
    source: "YouTube Search",
    profileUrl: "https://youtube.com/@techreviewglobal",
    website: null,
    contactInfo: { emails: ["collab@techreviewglobal.com"], phones: [], instagrams: ["techreviewglobal"], youtubes: ["@techreviewglobal"] },
    contactPerson: null,
    notes: "Leading consumer tech review channel with in-depth product analysis",
    engagementRate: 4.5,
    avgViews: 55000,
    analyses: [{ id: "a1", contentStyle: "Professional tutorials with hands-on product demos.", audienceProfile: "Tech enthusiasts and early adopters worldwide.", engagementQuality: "High", brandFitScore: 8.5, recommendations: '["Partner for product review video"]', riskFactors: '["Very selective about brand partnerships"]', createdAt: "2026-08-01T00:00:00Z" }],
    emails: [{ id: "e1", subject: "Partnership Opportunity", body: "Hi TechReview Global team...", language: "English", status: "Sent", channel: "email", cooperationType: "gift", kolId: "1", createdAt: "2026-08-05T00:00:00Z" }],
    createdAt: "2026-08-01T00:00:00Z", updatedAt: "2026-08-05T00:00:00Z",
  },
  {
    id: "2",
    name: "Moda Sustentável BR",
    type: "KOL",
    platform: "Instagram",
    followers: 185000,
    niche: "Sustainable Fashion",
    region: "Brazil",
    engagement: "High",
    status: "Not Contacted",
    language: "Portuguese",
    tier: "Macro",
    priority: "Medium",
    source: "Instagram Search",
    profileUrl: "https://instagram.com/modasustentavelbr",
    website: null,
    contactInfo: { emails: ["contato@modasustentavelbr.com.br"], phones: [], instagrams: ["modasustentavelbr"], youtubes: [] },
    contactPerson: null,
    notes: "Focus on sustainable and ethical fashion in Latin America",
    engagementRate: 5.2, avgViews: 28000, analyses: [], emails: [],
    createdAt: "2026-08-02T00:00:00Z", updatedAt: "2026-08-02T00:00:00Z",
  },
  {
    id: "3",
    name: "El Profe Digital",
    type: "KOL",
    platform: "YouTube",
    followers: 95000,
    niche: "Digital Education",
    region: "Mexico",
    engagement: "Medium",
    status: "Not Contacted",
    language: "Spanish",
    tier: "Micro",
    priority: "Medium",
    source: "YouTube Search",
    profileUrl: "https://youtube.com/@elprofedigital",
    website: null,
    contactInfo: { emails: ["christian@elprofedigital.com"], phones: [], instagrams: ["elprofedigital"], youtubes: ["@elprofedigital"] },
    contactPerson: null,
    notes: "Educational content creator focused on digital tools and online learning",
    engagementRate: 5.1, avgViews: 15000,
    analyses: [{ id: "a3", contentStyle: "Engaging educational content with practical tips.", audienceProfile: "Spanish-speaking professionals and students.", engagementQuality: "Medium", brandFitScore: 7.2, recommendations: '["Sponsor an educational series"]', riskFactors: '["Prefers long-term partnerships"]', createdAt: "2026-08-03T00:00:00Z" }],
    emails: [], createdAt: "2026-08-03T00:00:00Z", updatedAt: "2026-08-03T00:00:00Z",
  },
  {
    id: "4",
    name: "Wanderlust Diaries",
    type: "KOL",
    platform: "Instagram",
    followers: 420000,
    niche: "Travel & Lifestyle",
    region: "Europe",
    engagement: "High",
    status: "Sent",
    language: "English",
    tier: "Macro",
    priority: "High",
    source: "Instagram Search",
    profileUrl: "https://instagram.com/wanderlustdiaries",
    website: null,
    contactInfo: { emails: ["hello@wanderlustdiaries.com"], phones: [], instagrams: ["wanderlustdiaries"], youtubes: [] },
    contactPerson: null,
    notes: "Premium travel and lifestyle content creator with strong European audience",
    engagementRate: 6.3, avgViews: 65000, analyses: [],
    emails: [{ id: "e4", subject: "Collaboration Proposal", body: "Hi Wanderlust Diaries team...", language: "English", status: "Sent", channel: "email", cooperationType: "paid", kolId: "4", createdAt: "2026-08-06T00:00:00Z" }],
    createdAt: "2026-08-04T00:00:00Z", updatedAt: "2026-08-06T00:00:00Z",
  },
  {
    id: "5",
    name: "FitLife Academy",
    type: "KOL",
    platform: "YouTube",
    followers: 150000,
    niche: "Health & Fitness",
    region: "USA",
    engagement: "Medium",
    status: "Not Contacted",
    language: "English",
    tier: "Macro",
    priority: "Low",
    source: "YouTube Search",
    profileUrl: "https://youtube.com/@fitlifeacademy",
    website: null,
    contactInfo: { emails: [], phones: [], instagrams: ["fitlifeacademy"], youtubes: ["@fitlifeacademy"] },
    contactPerson: null,
    notes: "Evidence-based fitness and nutrition content",
    engagementRate: 3.5, avgViews: 22000, analyses: [], emails: [],
    createdAt: "2026-08-05T00:00:00Z", updatedAt: "2026-08-05T00:00:00Z",
  },
  {
    id: "6",
    name: "Global Trade Weekly",
    type: "Media",
    platform: "Website",
    followers: 520000,
    niche: "International Trade News",
    region: "Global",
    engagement: "High",
    status: "Sent",
    language: "English",
    tier: "Mega",
    priority: "Critical",
    source: "Industry Referral",
    profileUrl: null,
    website: "https://globaltradeweekly.com",
    contactInfo: { emails: ["editor@globaltradeweekly.com"], phones: ["+12125551234"], instagrams: ["globaltradeweekly"], youtubes: [] },
    contactPerson: "Sarah Chen (Editor-in-Chief)",
    notes: "Leading international trade publication, strategic media partnership opportunity",
    engagementRate: 3.9, avgViews: 80000, analyses: [], emails: [],
    createdAt: "2026-08-01T00:00:00Z", updatedAt: "2026-08-07T00:00:00Z",
  },
  {
    id: "7",
    name: "Café Culture MX",
    type: "KOL",
    platform: "Instagram",
    followers: 68000,
    niche: "Food & Beverage",
    region: "Mexico",
    engagement: "High",
    status: "Not Contacted",
    language: "Spanish",
    tier: "Micro",
    priority: "Medium",
    source: "Instagram Search",
    profileUrl: "https://instagram.com/cafeculturemx",
    website: null,
    contactInfo: { emails: ["hola@cafeculturemx.com"], phones: ["+525551234567"], instagrams: ["cafeculturemx"], youtubes: [] },
    contactPerson: null,
    notes: "Specialty coffee and food culture content creator",
    engagementRate: 7.2, avgViews: 9500, analyses: [], emails: [],
    createdAt: "2026-08-06T00:00:00Z", updatedAt: "2026-08-06T00:00:00Z",
  },
  {
    id: "8",
    name: "SaaS Insider",
    type: "Media",
    platform: "YouTube",
    followers: 210000,
    niche: "SaaS & B2B Technology",
    region: "USA",
    engagement: "Medium",
    status: "Not Contacted",
    language: "English",
    tier: "Macro",
    priority: "High",
    source: "YouTube Search",
    profileUrl: "https://youtube.com/@saasinsider",
    website: null,
    contactInfo: { emails: ["partnerships@saasinsider.com"], phones: [], instagrams: ["saasinsider"], youtubes: ["@saasinsider"] },
    contactPerson: null,
    notes: "In-depth SaaS product reviews and B2B technology analysis",
    engagementRate: 4.5, avgViews: 35000, analyses: [], emails: [],
    createdAt: "2026-08-02T00:00:00Z", updatedAt: "2026-08-08T00:00:00Z",
  },
  {
    id: "9",
    name: "Belleza & Estilo",
    type: "KOL",
    platform: "YouTube",
    followers: 275000,
    niche: "Beauty & Cosmetics",
    region: "Colombia",
    engagement: "High",
    status: "Not Contacted",
    language: "Spanish",
    tier: "Macro",
    priority: "Medium",
    source: "YouTube Search",
    profileUrl: "https://youtube.com/@bellezayestilo",
    website: null,
    contactInfo: { emails: ["info@bellezayestilo.com"], phones: [], instagrams: ["bellezayestilo"], youtubes: ["@bellezayestilo"] },
    contactPerson: null,
    notes: "Beauty and cosmetics influencer with strong Latin American following",
    engagementRate: 5.8, avgViews: 42000, analyses: [], emails: [],
    createdAt: "2026-08-07T00:00:00Z", updatedAt: "2026-08-07T00:00:00Z",
  },
  {
    id: "10",
    name: "Home Design Pro",
    type: "Installer",
    platform: "Instagram",
    followers: 28000,
    niche: "Interior Design & Renovation",
    region: "Argentina",
    engagement: "High",
    status: "Not Contacted",
    language: "Spanish",
    tier: "Micro",
    priority: "Medium",
    source: "Instagram Search",
    profileUrl: "https://instagram.com/homedesignpro",
    website: null,
    contactInfo: { emails: ["lucas@homedesignpro.ar"], phones: ["+5491155554444"], instagrams: ["homedesignpro"], youtubes: [] },
    contactPerson: null,
    notes: "Interior design firm founder with strong project portfolio",
    engagementRate: 7.2, avgViews: 4500, analyses: [], emails: [],
    createdAt: "2026-08-06T00:00:00Z", updatedAt: "2026-08-06T00:00:00Z",
  },
  {
    id: "11",
    name: "Startup Nation Podcast",
    type: "Media",
    platform: "YouTube",
    followers: 890000,
    niche: "Entrepreneurship & Startups",
    region: "USA",
    engagement: "Medium",
    status: "Sent",
    language: "English",
    tier: "Mega",
    priority: "Critical",
    source: "YouTube Search",
    profileUrl: "https://youtube.com/@startupnationpod",
    website: null,
    contactInfo: { emails: ["sponsor@startupnationpod.com"], phones: [], instagrams: ["startupnationpod"], youtubes: ["@startupnationpod"] },
    contactPerson: null,
    notes: "Top entrepreneurship podcast with global audience",
    engagementRate: 2.8, avgViews: 150000, analyses: [], emails: [],
    createdAt: "2026-08-01T00:00:00Z", updatedAt: "2026-08-10T00:00:00Z",
  },
  {
    id: "12",
    name: "Craft & Make JP",
    type: "KOL",
    platform: "Instagram",
    followers: 15000,
    niche: "DIY & Handcraft",
    region: "Japan",
    engagement: "High",
    status: "Not Contacted",
    language: "Japanese",
    tier: "Nano",
    priority: "Low",
    source: "Instagram Search",
    profileUrl: "https://instagram.com/craftmakejp",
    website: null,
    contactInfo: { emails: [], phones: [], instagrams: ["craftmakejp"], youtubes: [] },
    contactPerson: null,
    notes: "Micro influencer with loyal DIY community",
    engagementRate: 8.1, avgViews: 2000, analyses: [], emails: [],
    createdAt: "2026-08-08T00:00:00Z", updatedAt: "2026-08-08T00:00:00Z",
  },
  {
    id: "13",
    name: "International Trade Association (ITA)",
    type: "Association",
    platform: "Website",
    followers: 0,
    niche: "International Trade",
    region: "USA",
    engagement: null,
    status: "Not Contacted",
    language: "English",
    tier: "Macro",
    priority: "Critical",
    source: "Industry Research",
    profileUrl: null,
    website: "https://www.itatrade.org/",
    contactInfo: { emails: ["info@itatrade.org"], phones: ["+12025551234"], instagrams: [], youtubes: [] },
    contactPerson: "John Smith (Executive Director)",
    notes: "Major international trade association with 500+ member companies. Offers sponsorship and event partnership opportunities.",
    analyses: [], emails: [],
    createdAt: "2026-08-18T00:00:00Z", updatedAt: "2026-08-18T00:00:00Z",
  },
  {
    id: "14",
    name: "E-Commerce Brazil Association",
    type: "Association",
    platform: "Website",
    followers: 0,
    niche: "E-Commerce & Digital Business",
    region: "Brazil",
    engagement: null,
    status: "Not Contacted",
    language: "Portuguese",
    tier: "Macro",
    priority: "Critical",
    source: "Industry Research",
    profileUrl: null,
    website: "https://www.ecommercebr.org/",
    contactInfo: { emails: ["institucional@ecommercebr.org"], phones: ["+5511932922294"], instagrams: [], youtubes: [] },
    contactPerson: "Maria Silva (Chair)",
    notes: "Largest e-commerce association in Brazil with 1400+ members. Great for market entry and networking.",
    analyses: [], emails: [],
    createdAt: "2026-08-18T00:00:00Z", updatedAt: "2026-08-18T00:00:00Z",
  },
  {
    id: "15",
    name: "Digital Marketing Institute",
    type: "Association",
    platform: "Website",
    followers: 0,
    niche: "Digital Marketing Education",
    region: "Europe",
    engagement: null,
    status: "Not Contacted",
    language: "English",
    tier: "Macro",
    priority: "Medium",
    source: "Industry Research",
    profileUrl: null,
    website: "https://www.digitalmarketinginstitute.eu/",
    contactInfo: { emails: ["partnerships@dmie.eu"], phones: [], instagrams: [], youtubes: [] },
    contactPerson: "Anna Mueller (CEO)",
    notes: "Leading digital marketing education body in Europe. Potential for co-branded content and certification partnerships.",
    analyses: [], emails: [],
    createdAt: "2026-08-18T00:00:00Z", updatedAt: "2026-08-18T00:00:00Z",
  },
  {
    id: "16",
    name: "LatAm Startup Network",
    type: "Association",
    platform: "Website",
    followers: 0,
    niche: "Startup Ecosystem",
    region: "Latin America",
    engagement: null,
    status: "Not Contacted",
    language: "Spanish",
    tier: "Macro",
    priority: "Medium",
    source: "Industry Research",
    profileUrl: null,
    website: "https://latamstartupnetwork.com/",
    contactInfo: { emails: ["hello@latamstartupnetwork.com"], phones: [], instagrams: [], youtubes: [] },
    contactPerson: null,
    notes: "Pan-regional startup network covering Mexico, Brazil, Argentina, Colombia. Hosts annual summit.",
    analyses: [], emails: [],
    createdAt: "2026-08-18T00:00:00Z", updatedAt: "2026-08-18T00:00:00Z",
  },
  {
    id: "17",
    name: "Global SaaS Alliance",
    type: "Association",
    platform: "Website",
    followers: 0,
    niche: "SaaS & Cloud Technology",
    region: "Global",
    engagement: null,
    status: "Not Contacted",
    language: "English",
    tier: "Macro",
    priority: "Low",
    source: "Industry Research",
    profileUrl: null,
    website: "https://globalsaasalliance.org/",
    contactInfo: { emails: [], phones: [], instagrams: [], youtubes: [] },
    contactPerson: null,
    notes: "Industry alliance for SaaS companies. Focus on standards, best practices, and cross-border collaboration.",
    analyses: [], emails: [],
    createdAt: "2026-08-18T00:00:00Z", updatedAt: "2026-08-18T00:00:00Z",
  },
  {
    id: "18",
    name: "Creator Economy Alliance",
    type: "Association",
    platform: "Website",
    followers: 0,
    niche: "Creator Economy & Influencer Marketing",
    region: "Global",
    engagement: null,
    status: "Not Contacted",
    language: "English",
    tier: "Macro",
    priority: "High",
    source: "Industry Research",
    profileUrl: null,
    website: "https://creatoralliance.io/",
    contactInfo: { emails: ["partnerships@creatoralliance.io"], phones: [], instagrams: [], youtubes: [] },
    contactPerson: null,
    notes: "New association focused on the creator economy. Directly relevant to KOL outreach and influencer marketing strategies.",
    analyses: [], emails: [],
    createdAt: "2026-08-18T00:00:00Z", updatedAt: "2026-08-18T00:00:00Z",
  },
  {
    id: "19",
    name: "Cross-Border Commerce Forum",
    type: "Association",
    platform: "Website",
    followers: 0,
    niche: "Cross-Border E-Commerce",
    region: "Global",
    engagement: null,
    status: "Not Contacted",
    language: "English",
    tier: "Macro",
    priority: "High",
    source: "Industry Research",
    profileUrl: null,
    website: null,
    contactInfo: { emails: [], phones: [], instagrams: [], youtubes: [] },
    contactPerson: null,
    notes: "Forum focused on cross-border e-commerce. Great for brands looking to expand internationally.",
    analyses: [], emails: [],
    createdAt: "2026-08-18T00:00:00Z", updatedAt: "2026-08-18T00:00:00Z",
  },
];

export const demoCampaigns: Campaign[] = [
  { id: "c1", name: "Q3 Product Launch", status: "Active", notes: "Targeting tech and lifestyle contacts for product launch", createdAt: "2026-07-15T00:00:00Z" },
  { id: "c2", name: "Latin America Expansion", status: "Planning", notes: "Expanding outreach to Mexico, Brazil, Argentina, Colombia", createdAt: "2026-08-01T00:00:00Z" },
  { id: "c3", name: "Media Partnership Pilot", status: "Completed", notes: "Initial outreach to industry media and publications", createdAt: "2026-06-01T00:00:00Z" },
];

export const demoSentMessages: EmailRecord[] = [
  { id: "e1", subject: "Partnership Opportunity", body: "Hi TechReview Global team,\n\nI've been following your channel and love your detailed product reviews.\n\nI'm from [Your Company]...", language: "English", status: "Sent", channel: "email", cooperationType: "gift", kolId: "1", createdAt: "2026-08-05T00:00:00Z" },
  { id: "e4", subject: "Collaboration Proposal", body: "Hi Wanderlust Diaries team,\n\nWe admire your travel content...", language: "English", status: "Sent", channel: "email", cooperationType: "paid", kolId: "4", createdAt: "2026-08-06T00:00:00Z" },
  { id: "e6", subject: "Strategic Partnership Inquiry", body: "Dear Sarah,\n\nAs a leading voice in international trade...", language: "English", status: "Sent", channel: "whatsapp", cooperationType: "paid", kolId: "6", createdAt: "2026-08-07T00:00:00Z" },
  { id: "e10", subject: "¡Hola! Propuesta de colaboración", body: "Hola Belleza & Estilo,\n\nMe encanta su contenido sobre belleza...", language: "Spanish", status: "Sent", channel: "instagram", cooperationType: "gift", kolId: "9", createdAt: "2026-08-09T00:00:00Z" },
  { id: "e11", subject: "Sponsorship Opportunity", body: "Hi Startup Nation team,\n\nYour podcast is the gold standard...", language: "English", status: "Sent", channel: "email", cooperationType: "paid", kolId: "11", createdAt: "2026-08-10T00:00:00Z" },
];

const SENT_MESSAGES_KEY = "sent_messages";

export function loadAllContacts(): Contact[] {
  if (typeof window === "undefined") return demoContacts;
  try {
    const data = localStorage.getItem("kol_contacts");
    const stored: Contact[] = data ? JSON.parse(data) : [];
    const storedIds = new Set(stored.map((c) => c.id));
    const newDemos = demoContacts.filter((k) => !storedIds.has(k.id));
    return [...stored, ...newDemos];
  } catch { return demoContacts; }
}

export function loadSentMessages(): EmailRecord[] {
  if (typeof window === "undefined") return demoSentMessages;
  try {
    const data = localStorage.getItem(SENT_MESSAGES_KEY);
    const stored: EmailRecord[] = data ? JSON.parse(data) : [];
    if (stored.length > 0) return stored;
    return demoSentMessages;
  } catch { return demoSentMessages; }
}

export function saveSentMessage(msg: EmailRecord) {
  if (typeof window === "undefined") return;
  const existing = loadSentMessages();
  if (existing.find((m) => m.id === msg.id)) return;
  const updated = [...existing, msg];
  localStorage.setItem(SENT_MESSAGES_KEY, JSON.stringify(updated));
}

export function updateContactStatus(contactId: string, status: OutreachStatus) {
  if (typeof window === "undefined") return;
  try {
    const data = localStorage.getItem("kol_contacts");
    const stored: Contact[] = data ? JSON.parse(data) : [];
    const updated = stored.map((c) => c.id === contactId ? { ...c, status, updatedAt: new Date().toISOString() } : c);
    localStorage.setItem("kol_contacts", JSON.stringify(updated));
  } catch {}
}

export function getDashboardStats() {
  const contacts = loadAllContacts();
  const sentMessages = loadSentMessages();
  const repliedCount = contacts.filter((c) => c.status === "Replied").length;
  const contactedCount = contacts.filter((c) => c.status !== "Not Contacted").length;
  const responseRate = contactedCount > 0 ? Math.round((repliedCount / contactedCount) * 100) : 0;
  return {
    kolCount: contacts.length,
    emailCount: sentMessages.length,
    sentEmails: sentMessages.length,
    repliedEmails: repliedCount,
    responseRate,
  };
}

export function getContactById(id: string): Contact | undefined {
  return loadAllContacts().find((k) => k.id === id);
}

export const typeIconMap: Record<string, string> = {
  KOL: "Users", Association: "Building2", Media: "Megaphone", Distributor: "Truck", Installer: "Wrench", Other: "HelpCircle",
};
