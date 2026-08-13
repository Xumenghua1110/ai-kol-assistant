import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getTier(followers: number): string {
  if (followers >= 1000000) return "Mega";
  if (followers >= 100000) return "Macro";
  if (followers >= 10000) return "Micro";
  return "Nano";
}

// Demo KOLs for when database is not available
const demoKols = [
  { id: "1", name: "Energia Solar Master", platform: "YouTube", followers: 245000, niche: "Solar Energy", region: "Brazil", engagement: "High", status: "Contacted", language: "Portuguese", tier: "Macro", contactInfo: { emails: ["contato@energiasolarmaster.com.br"], phones: ["+5511999998888"], instagrams: ["energiasolarmaster"], youtubes: [] } },
  { id: "2", name: "Solar Brasil", platform: "YouTube", followers: 180000, niche: "Solar Installation", region: "Brazil", engagement: "High", status: "New", language: "Portuguese", tier: "Macro", contactInfo: { emails: ["contato@solarbrasil.com.br"], phones: [], instagrams: ["solarbrasil"], youtubes: [] } },
  { id: "3", name: "El profe chris", platform: "YouTube", followers: 95000, niche: "Solar Education", region: "Mexico", engagement: "Medium", status: "Analyzed", language: "Spanish", tier: "Micro", contactInfo: { emails: ["christian@elprofechris.com"], phones: [], instagrams: ["elprofechris"], youtubes: [] } },
  { id: "4", name: "Solar Culture", platform: "Instagram", followers: 45000, niche: "Solar Installation", region: "Brazil", engagement: "High", status: "Contacted", language: "Portuguese", tier: "Micro", contactInfo: { emails: ["hello@solarculture.com.br"], phones: ["+5511888887777"], instagrams: ["solarculture"], youtubes: [] } },
  { id: "5", name: "Jeff Bala", platform: "Instagram", followers: 32000, niche: "Solar Energy", region: "USA", engagement: "Medium", status: "New", language: "English", tier: "Micro", contactInfo: { emails: [], phones: [], instagrams: ["jeffbala"], youtubes: [] } },
];

// GET all KOLs
export async function GET() {
  try {
    if (!prisma) return NextResponse.json(demoKols);
    const kols = await prisma.kOL.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        analyses: { orderBy: { createdAt: "desc" }, take: 1 },
        emails: { orderBy: { createdAt: "desc" } },
      },
    });
    // Parse contactInfo JSON and compute tier
    const result = kols.map(k => ({
      ...k,
      contactInfo: k.contactInfo ? JSON.parse(k.contactInfo) : { emails: [], phones: [], instagrams: [], youtubes: [] },
      tier: k.tier || getTier(k.followers),
    }));
    return NextResponse.json(result);
  } catch (error) {
    // Return demo data if database is not available
    return NextResponse.json(demoKols);
  }
}

// POST create new KOL
export async function POST(request: Request) {
  try {
    if (!prisma) return NextResponse.json({ error: "Database not available" }, { status: 503 });
    const body = await request.json();
    const contactInfo = body.contactInfo
      ? (typeof body.contactInfo === 'string' ? body.contactInfo : JSON.stringify(body.contactInfo))
      : null;
    const tier = body.tier || getTier(body.followers || 0);

    const kol = await prisma.kOL.create({
      data: {
        name: body.name,
        platform: body.platform || "YouTube",
        profileUrl: body.profileUrl || null,
        followers: body.followers || 0,
        niche: body.niche || null,
        region: body.region || null,
        engagement: body.engagement || null,
        status: body.status || "New",
        notes: body.notes || null,
        language: body.language || null,
        contactInfo,
        priority: body.priority || "Medium",
        tier,
        engagementRate: body.engagementRate || null,
        avgViews: body.avgViews || null,
      },
    });
    return NextResponse.json({ ...kol, contactInfo: contactInfo ? JSON.parse(contactInfo) : null, tier }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create KOL" },
      { status: 500 }
    );
  }
}
