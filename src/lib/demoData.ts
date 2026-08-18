export const CONTACT_TYPES = ["KOL", "Association", "Media", "Distributor", "Installer", "Other"] as const;
export type ContactType = typeof CONTACT_TYPES[number];

export const OUTREACH_STATUS = ["Not Contacted", "Sent", "Replied", "Meeting", "Declined"] as const;
export type OutreachStatus = typeof OUTREACH_STATUS[number];

export interface KOL {
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

export const demoKols: KOL[] = [
  {
    id: "1",
    name: "Energia Solar Master",
    type: "KOL",
    platform: "YouTube",
    followers: 245000,
    niche: "Solar Energy",
    region: "Brazil",
    engagement: "High",
    status: "Sent",
    language: "Portuguese",
    tier: "Macro",
    priority: "High",
    source: "YouTube Search",
    profileUrl: "https://youtube.com/@energiasolarmaster",
    website: null,
    contactInfo: { emails: ["contato@energiasolarmaster.com.br"], phones: ["+5511999998888"], instagrams: ["energiasolarmaster"], youtubes: ["@energiasolarmaster"] },
    contactPerson: null,
    notes: "Leading solar education channel in Brazil",
    engagementRate: 4.2,
    avgViews: 35000,
    analyses: [{ id: "a1", contentStyle: "Professional tutorials with hands-on installation demos.", audienceProfile: "Brazilian solar installers and homeowners.", engagementQuality: "High", brandFitScore: 8.5, recommendations: '["Partner for product review video"]', riskFactors: '["Very selective about brand partnerships"]', createdAt: "2026-08-01T00:00:00Z" }],
    emails: [{ id: "e1", subject: "Partnership Opportunity - Ktech Solar Inverters", body: "Hi Energia Solar Master team...", language: "Portuguese", status: "Sent", channel: "email", cooperationType: "gift", kolId: "1", createdAt: "2026-08-05T00:00:00Z" }],
    createdAt: "2026-08-01T00:00:00Z", updatedAt: "2026-08-05T00:00:00Z",
  },
  {
    id: "2",
    name: "Solar Brasil",
    type: "KOL",
    platform: "YouTube",
    followers: 180000,
    niche: "Solar Installation",
    region: "Brazil",
    engagement: "High",
    status: "Not Contacted",
    language: "Portuguese",
    tier: "Macro",
    priority: "Medium",
    source: "YouTube Search",
    profileUrl: "https://youtube.com/@solarbrasil",
    website: null,
    contactInfo: { emails: ["contato@solarbrasil.com.br"], phones: [], instagrams: ["solarbrasil"], youtubes: ["@solarbrasil"] },
    contactPerson: null,
    notes: "Focus on commercial solar installations",
    engagementRate: 3.8, avgViews: 22000, analyses: [], emails: [],
    createdAt: "2026-08-02T00:00:00Z", updatedAt: "2026-08-02T00:00:00Z",
  },
  {
    id: "3",
    name: "El profe chris",
    type: "KOL",
    platform: "YouTube",
    followers: 95000,
    niche: "Solar Education",
    region: "Mexico",
    engagement: "Medium",
    status: "Not Contacted",
    language: "Spanish",
    tier: "Micro",
    priority: "Medium",
    source: "YouTube Search",
    profileUrl: "https://youtube.com/@elprofechris",
    website: null,
    contactInfo: { emails: ["christian@elprofechris.com"], phones: [], instagrams: ["elprofechris"], youtubes: ["@elprofechris"] },
    contactPerson: null,
    notes: "Educational content creator",
    engagementRate: 5.1, avgViews: 15000,
    analyses: [{ id: "a3", contentStyle: "Engaging educational content.", audienceProfile: "Spanish-speaking homeowners.", engagementQuality: "Medium", brandFitScore: 7.2, recommendations: '["Sponsor an educational series"]', riskFactors: '["Prefers long-term partnerships"]', createdAt: "2026-08-03T00:00:00Z" }],
    emails: [], createdAt: "2026-08-03T00:00:00Z", updatedAt: "2026-08-03T00:00:00Z",
  },
  {
    id: "4",
    name: "Solar Culture",
    type: "KOL",
    platform: "Instagram",
    followers: 45000,
    niche: "Solar Installation",
    region: "Brazil",
    engagement: "High",
    status: "Sent",
    language: "Portuguese",
    tier: "Micro",
    priority: "Medium",
    source: "Instagram Search",
    profileUrl: "https://instagram.com/solarculture",
    website: null,
    contactInfo: { emails: ["hello@solarculture.com.br"], phones: ["+5511888887777"], instagrams: ["solarculture"], youtubes: [] },
    contactPerson: null,
    notes: "Instagram-first content creator",
    engagementRate: 6.3, avgViews: 8000, analyses: [],
    emails: [{ id: "e4", subject: "Collaboration Proposal", body: "Hi Solar Culture team...", language: "Portuguese", status: "Sent", channel: "email", cooperationType: "paid", kolId: "4", createdAt: "2026-08-06T00:00:00Z" }],
    createdAt: "2026-08-04T00:00:00Z", updatedAt: "2026-08-06T00:00:00Z",
  },
  {
    id: "5",
    name: "Jeff Bala",
    type: "KOL",
    platform: "Instagram",
    followers: 32000,
    niche: "Solar Energy",
    region: "USA",
    engagement: "Medium",
    status: "Not Contacted",
    language: "English",
    tier: "Micro",
    priority: "Low",
    source: "Instagram Search",
    profileUrl: "https://instagram.com/jeffbala",
    website: null,
    contactInfo: { emails: [], phones: [], instagrams: ["jeffbala"], youtubes: [] },
    contactPerson: null,
    notes: "US-based solar enthusiast",
    engagementRate: 3.5, avgViews: 5000, analyses: [], emails: [],
    createdAt: "2026-08-05T00:00:00Z", updatedAt: "2026-08-05T00:00:00Z",
  },
  {
    id: "6",
    name: "Marcio Takata",
    type: "KOL",
    platform: "YouTube",
    followers: 520000,
    niche: "Solar Industry News",
    region: "Brazil",
    engagement: "High",
    status: "Sent",
    language: "Portuguese",
    tier: "Macro",
    priority: "Critical",
    source: "Industry Referral",
    profileUrl: "https://youtube.com/@marciotakata",
    website: null,
    contactInfo: { emails: ["contato@marciotakata.com.br"], phones: ["+5511777776666"], instagrams: ["marciotakata"], youtubes: ["@marciotakata"] },
    contactPerson: null,
    notes: "Industry leader, strategic cooperation opportunity",
    engagementRate: 3.9, avgViews: 80000, analyses: [], emails: [],
    createdAt: "2026-08-01T00:00:00Z", updatedAt: "2026-08-07T00:00:00Z",
  },
  {
    id: "7",
    name: "Lucas Mannelli",
    type: "Installer",
    platform: "Instagram",
    followers: 28000,
    niche: "Solar Installation",
    region: "Argentina",
    engagement: "High",
    status: "Not Contacted",
    language: "Spanish",
    tier: "Micro",
    priority: "Medium",
    source: "Instagram Search",
    profileUrl: "https://instagram.com/lucasmannelli",
    website: null,
    contactInfo: { emails: ["lucas@solarinstall.ar"], phones: ["+5491155554444"], instagrams: ["lucasmannelli"], youtubes: [] },
    contactPerson: null,
    notes: "Installation company founder",
    engagementRate: 7.2, avgViews: 4500, analyses: [], emails: [],
    createdAt: "2026-08-06T00:00:00Z", updatedAt: "2026-08-06T00:00:00Z",
  },
  {
    id: "8",
    name: "Solar Tech Review",
    type: "Media",
    platform: "YouTube",
    followers: 156000,
    niche: "Solar Product Reviews",
    region: "USA",
    engagement: "Medium",
    status: "Not Contacted",
    language: "English",
    tier: "Macro",
    priority: "High",
    source: "YouTube Search",
    profileUrl: "https://youtube.com/@solartechreview",
    website: null,
    contactInfo: { emails: ["reviews@solartechreview.com"], phones: [], instagrams: ["solartechreview"], youtubes: ["@solartechreview"] },
    contactPerson: null,
    notes: "Detailed product review channel",
    engagementRate: 4.5, avgViews: 25000, analyses: [], emails: [],
    createdAt: "2026-08-02T00:00:00Z", updatedAt: "2026-08-08T00:00:00Z",
  },
  {
    id: "9",
    name: "Energia Limpia MX",
    type: "KOL",
    platform: "YouTube",
    followers: 67000,
    niche: "Clean Energy",
    region: "Mexico",
    engagement: "Medium",
    status: "Not Contacted",
    language: "Spanish",
    tier: "Micro",
    priority: "Low",
    source: "YouTube Search",
    profileUrl: "https://youtube.com/@energialimpiamx",
    website: null,
    contactInfo: { emails: ["info@energialimpia.mx"], phones: [], instagrams: ["energialimpiamx"], youtubes: ["@energialimpiamx"] },
    contactPerson: null,
    notes: "Clean energy advocacy channel",
    engagementRate: 3.2, avgViews: 8000, analyses: [], emails: [],
    createdAt: "2026-08-07T00:00:00Z", updatedAt: "2026-08-07T00:00:00Z",
  },
  {
    id: "10",
    name: "Green Energy Colombia",
    type: "KOL",
    platform: "Instagram",
    followers: 38000,
    niche: "Renewable Energy",
    region: "Colombia",
    engagement: "High",
    status: "Sent",
    language: "Spanish",
    tier: "Micro",
    priority: "Medium",
    source: "Instagram Search",
    profileUrl: "https://instagram.com/greenenergyco",
    website: null,
    contactInfo: { emails: ["hello@greenenergyco.com"], phones: ["+573001234567"], instagrams: ["greenenergyco"], youtubes: [] },
    contactPerson: null,
    notes: "Growing presence in Colombian market",
    engagementRate: 5.8, avgViews: 6000, analyses: [], emails: [],
    createdAt: "2026-08-03T00:00:00Z", updatedAt: "2026-08-09T00:00:00Z",
  },
  {
    id: "11",
    name: "Solar Power Daily",
    type: "Media",
    platform: "YouTube",
    followers: 890000,
    niche: "Solar News & Reviews",
    region: "USA",
    engagement: "Medium",
    status: "Sent",
    language: "English",
    tier: "Mega",
    priority: "Critical",
    source: "YouTube Search",
    profileUrl: "https://youtube.com/@solarpowerdaily",
    website: null,
    contactInfo: { emails: ["partnerships@solarpowerdaily.com"], phones: [], instagrams: ["solarpowerdaily"], youtubes: ["@solarpowerdaily"] },
    contactPerson: null,
    notes: "Mega influencer in solar space",
    engagementRate: 2.8, avgViews: 150000, analyses: [], emails: [],
    createdAt: "2026-08-01T00:00:00Z", updatedAt: "2026-08-10T00:00:00Z",
  },
  {
    id: "12",
    name: "Instalador Solar Pro",
    type: "Installer",
    platform: "Instagram",
    followers: 15000,
    niche: "Solar Installation Tips",
    region: "Chile",
    engagement: "High",
    status: "Not Contacted",
    language: "Spanish",
    tier: "Nano",
    priority: "Low",
    source: "Instagram Search",
    profileUrl: "https://instagram.com/instaladorsolarpro",
    website: null,
    contactInfo: { emails: [], phones: ["+56987654321"], instagrams: ["instaladorsolarpro"], youtubes: [] },
    contactPerson: null,
    notes: "Micro influencer with loyal following",
    engagementRate: 8.1, avgViews: 2000, analyses: [], emails: [],
    createdAt: "2026-08-08T00:00:00Z", updatedAt: "2026-08-08T00:00:00Z",
  },
  {
    id: "13",
    name: "ABSOLAR",
    type: "Association",
    platform: "Website",
    followers: 0,
    niche: "Solar Energy Association",
    region: "Brazil",
    engagement: null,
    status: "Not Contacted",
    language: "Portuguese",
    tier: "Macro",
    priority: "Critical",
    source: "巴西光伏电工协会名单",
    profileUrl: null,
    website: "https://www.absolar.org.br/",
    contactInfo: { emails: ["absolar@absolar.org.br"], phones: ["+551131974560", "+5511966496269"], instagrams: [], youtubes: [] },
    contactPerson: "Bárbara Rubim (Chair), Rodrigo Pedroso (VP)",
    notes: "巴西最大光伏全产业链协会，550+会员企业。含中文页面。",
    analyses: [], emails: [],
    createdAt: "2026-08-18T00:00:00Z", updatedAt: "2026-08-18T00:00:00Z",
  },
  {
    id: "14",
    name: "ABGD",
    type: "Association",
    platform: "Website",
    followers: 0,
    niche: "Distributed Generation Association",
    region: "Brazil",
    engagement: null,
    status: "Not Contacted",
    language: "Portuguese",
    tier: "Macro",
    priority: "Critical",
    source: "巴西光伏电工协会名单",
    profileUrl: null,
    website: "https://www.abgd.com.br/portal/",
    contactInfo: { emails: ["institucional@abgd.com.br"], phones: ["+5511932922294"], instagrams: [], youtubes: [] },
    contactPerson: "Luiz Fernando Vianna (Chair)",
    notes: "巴西最大分布式发电协会，1450+会员。Ktech已于2026年3月加入。PSQ认证对逆变器厂商是差异化卖点。",
    analyses: [], emails: [],
    createdAt: "2026-08-18T00:00:00Z", updatedAt: "2026-08-18T00:00:00Z",
  },
  {
    id: "15",
    name: "ABRAGE",
    type: "Association",
    platform: "Website",
    followers: 0,
    niche: "Power Generation Association",
    region: "Brazil",
    engagement: null,
    status: "Not Contacted",
    language: "Portuguese",
    tier: "Macro",
    priority: "Medium",
    source: "巴西光伏电工协会名单",
    profileUrl: null,
    website: "https://www.abrage.com.br/",
    contactInfo: { emails: [], phones: [], instagrams: [], youtubes: [] },
    contactPerson: "Marisete Pereira (CEO), Bruna Bonelli (Comms)",
    notes: "代表巴西大型发电企业。2026年新设储能委员会。与Ktech直接关联度较低但储能委员会值得关注。",
    analyses: [], emails: [],
    createdAt: "2026-08-18T00:00:00Z", updatedAt: "2026-08-18T00:00:00Z",
  },
  {
    id: "16",
    name: "ABRADEE",
    type: "Association",
    platform: "Website",
    followers: 0,
    niche: "Electricity Distribution Association",
    region: "Brazil",
    engagement: null,
    status: "Not Contacted",
    language: "Portuguese",
    tier: "Macro",
    priority: "Medium",
    source: "巴西光伏电工协会名单",
    profileUrl: null,
    website: "https://www.abradee.com.br/",
    contactInfo: { emails: [], phones: [], instagrams: [], youtubes: [] },
    contactPerson: null,
    notes: "代表巴西所有主要电力分销商，覆盖99.6%人口。逆变器并网需与分销商打交道。",
    analyses: [], emails: [],
    createdAt: "2026-08-18T00:00:00Z", updatedAt: "2026-08-18T00:00:00Z",
  },
  {
    id: "17",
    name: "APINE",
    type: "Association",
    platform: "Website",
    followers: 0,
    niche: "Independent Power Producers",
    region: "Brazil",
    engagement: null,
    status: "Not Contacted",
    language: "Portuguese",
    tier: "Macro",
    priority: "Low",
    source: "巴西光伏电工协会名单",
    profileUrl: null,
    website: "https://www.apine.com.br/",
    contactInfo: { emails: [], phones: [], instagrams: [], youtubes: [] },
    contactPerson: null,
    notes: "代表独立发电商，推动电力市场自由化、PPA机制。与大型光伏项目投资商关联度高。",
    analyses: [], emails: [],
    createdAt: "2026-08-18T00:00:00Z", updatedAt: "2026-08-18T00:00:00Z",
  },
  {
    id: "18",
    name: "ABEEólica",
    type: "Association",
    platform: "Website",
    followers: 0,
    niche: "Wind Energy & New Technologies",
    region: "Brazil",
    engagement: null,
    status: "Not Contacted",
    language: "Portuguese",
    tier: "Macro",
    priority: "Low",
    source: "巴西光伏电工协会名单",
    profileUrl: null,
    website: "https://www.abeolica.org.br/",
    contactInfo: { emails: [], phones: [], instagrams: [], youtubes: [] },
    contactPerson: null,
    notes: "代表巴西风能产业，同时覆盖储能、氢能。2026年与多个协会联合推动储能立法。",
    analyses: [], emails: [],
    createdAt: "2026-08-18T00:00:00Z", updatedAt: "2026-08-18T00:00:00Z",
  },
  {
    id: "19",
    name: "ABSAE",
    type: "Association",
    platform: "Website",
    followers: 0,
    niche: "Energy Storage Solutions",
    region: "Brazil",
    engagement: null,
    status: "Not Contacted",
    language: "Portuguese",
    tier: "Macro",
    priority: "High",
    source: "巴西光伏电工协会名单",
    profileUrl: null,
    website: null,
    contactInfo: { emails: [], phones: [], instagrams: [], youtubes: [] },
    contactPerson: null,
    notes: "专注储能解决方案的新协会。Ktech储能产品线的直接相关协会，建议关注入会机会。",
    analyses: [], emails: [],
    createdAt: "2026-08-18T00:00:00Z", updatedAt: "2026-08-18T00:00:00Z",
  },
];

export const demoCampaigns: Campaign[] = [
  { id: "c1", name: "Brazil Solar Launch Q3", status: "Active", notes: "Targeting Brazilian solar KOLs for product launch", createdAt: "2026-07-15T00:00:00Z" },
  { id: "c2", name: "Latin America Expansion", status: "Planning", notes: "Expanding outreach to Mexico, Argentina, Colombia", createdAt: "2026-08-01T00:00:00Z" },
  { id: "c3", name: "US Market Pilot", status: "Completed", notes: "Initial outreach to US-based solar influencers", createdAt: "2026-06-01T00:00:00Z" },
];

export const demoSentMessages: EmailRecord[] = [
  { id: "e1", subject: "Partnership Opportunity - Ktech Solar Inverters", body: "Hi Energia Solar Master team,\n\nI've been following your channel and love your detailed installation tutorials.\n\nI'm Eaea from Ktech Solar...", language: "Portuguese", status: "Sent", channel: "email", cooperationType: "gift", kolId: "1", createdAt: "2026-08-05T00:00:00Z" },
  { id: "e4", subject: "Collaboration Proposal", body: "Hi Solar Culture team,\n\nWe admire your Instagram content...", language: "Portuguese", status: "Sent", channel: "email", cooperationType: "paid", kolId: "4", createdAt: "2026-08-06T00:00:00Z" },
  { id: "e6", subject: "Strategic Partnership Inquiry", body: "Dear Marcio,\n\nAs a leading voice in the Brazilian solar industry...", language: "Portuguese", status: "Sent", channel: "whatsapp", cooperationType: "paid", kolId: "6", createdAt: "2026-08-07T00:00:00Z" },
  { id: "e10", subject: "Hola! Propuesta de colaboración", body: "Hola Green Energy Colombia,\n\nMe encanta su contenido sobre energía renovable...", language: "Spanish", status: "Sent", channel: "instagram", cooperationType: "gift", kolId: "10", createdAt: "2026-08-09T00:00:00Z" },
  { id: "e11", subject: "Product Review Opportunity", body: "Hi Solar Power Daily team,\n\nYour channel is the gold standard...", language: "English", status: "Sent", channel: "email", cooperationType: "paid", kolId: "11", createdAt: "2026-08-10T00:00:00Z" },
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

export const typeIconMap: Record<string, string> = {
  KOL: "Users", Association: "Building2", Media: "Megaphone", Distributor: "Truck", Installer: "Wrench", Other: "HelpCircle",
};
