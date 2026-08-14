import { NextResponse } from "next/server";

// Simple demo data - no database dependency
const demoKols: Record<string, any> = {
  "1": {
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
      youtubes: ["@energiasolarmaster"]
    },
    analyses: [],
    emails: [],
    createdAt: "2026-08-01T00:00:00Z",
    updatedAt: "2026-08-01T00:00:00Z"
  },
  "2": {
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
      youtubes: ["@solarbrasil"]
    },
    analyses: [],
    emails: [],
    createdAt: "2026-08-01T00:00:00Z",
    updatedAt: "2026-08-01T00:00:00Z"
  },
  "3": {
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
      youtubes: ["@elprofechris"]
    },
    analyses: [],
    emails: [],
    createdAt: "2026-08-01T00:00:00Z",
    updatedAt: "2026-08-01T00:00:00Z"
  },
  "4": {
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
      youtubes: []
    },
    analyses: [],
    emails: [],
    createdAt: "2026-08-01T00:00:00Z",
    updatedAt: "2026-08-01T00:00:00Z"
  },
  "5": {
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
      youtubes: []
    },
    analyses: [],
    emails: [],
    createdAt: "2026-08-01T00:00:00Z",
    updatedAt: "2026-08-01T00:00:00Z"
  }
};

// GET single KOL
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const kol = demoKols[id];
  
  if (!kol) {
    return NextResponse.json({ error: "KOL not found" }, { status: 404 });
  }
  
  return NextResponse.json(kol);
}

// PUT update KOL - placeholder for demo mode
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({ error: "Database not available in demo mode" }, { status: 503 });
}

// DELETE KOL - placeholder for demo mode
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({ error: "Database not available in demo mode" }, { status: 503 });
}
