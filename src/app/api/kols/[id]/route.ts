import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getTier(followers: number): string {
  if (followers >= 1000000) return "Mega";
  if (followers >= 100000) return "Macro";
  if (followers >= 10000) return "Micro";
  return "Nano";
}

// Demo KOL detail data for when database is not available
const demoKolDetails: Record<string, any> = {
  "1": {
    id: "1", name: "Energia Solar Master", platform: "YouTube", followers: 245000,
    niche: "Solar Energy", region: "Brazil", engagement: "High", status: "Contacted",
    language: "Portuguese", tier: "Macro", priority: "High",
    profileUrl: "https://youtube.com/@energiasolarmaster",
    contactInfo: { emails: ["contato@energiasolarmaster.com.br"], phones: ["+5511999998888"], instagrams: ["energiasolarmaster"], youtubes: ["@energiasolarmaster"] },
    analyses: [], emails: []
  },
  "2": {
    id: "2", name: "Solar Brasil", platform: "YouTube", followers: 180000,
    niche: "Solar Installation", region: "Brazil", engagement: "High", status: "New",
    language: "Portuguese", tier: "Macro", priority: "Medium",
    profileUrl: "https://youtube.com/@solarbrasil",
    contactInfo: { emails: ["contato@solarbrasil.com.br"], phones: [], instagrams: ["solarbrasil"], youtubes: ["@solarbrasil"] },
    analyses: [], emails: []
  },
  "3": {
    id: "3", name: "El profe chris", platform: "YouTube", followers: 95000,
    niche: "Solar Education", region: "Mexico", engagement: "Medium", status: "Analyzed",
    language: "Spanish", tier: "Micro", priority: "Medium",
    profileUrl: "https://youtube.com/@elprofechris",
    contactInfo: { emails: ["christian@elprofechris.com"], phones: [], instagrams: ["elprofechris"], youtubes: ["@elprofechris"] },
    analyses: [], emails: []
  },
  "4": {
    id: "4", name: "Solar Culture", platform: "Instagram", followers: 45000,
    niche: "Solar Installation", region: "Brazil", engagement: "High", status: "Contacted",
    language: "Portuguese", tier: "Micro", priority: "Medium",
    profileUrl: "https://instagram.com/solarculture",
    contactInfo: { emails: ["hello@solarculture.com.br"], phones: ["+5511888887777"], instagrams: ["solarculture"], youtubes: [] },
    analyses: [], emails: []
  },
  "5": {
    id: "5", name: "Jeff Bala", platform: "Instagram", followers: 32000,
    niche: "Solar Energy", region: "USA", engagement: "Medium", status: "New",
    language: "English", tier: "Micro", priority: "Low",
    profileUrl: "https://instagram.com/jeffbala",
    contactInfo: { emails: [], phones: [], instagrams: ["jeffbala"], youtubes: [] },
    analyses: [], emails: []
  },
};

// GET single KOL with analyses and emails
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Return demo data if database is not available
    if (!prisma) {
      const demoKol = demoKolDetails[id];
      if (demoKol) {
        return NextResponse.json(demoKol);
      }
      return NextResponse.json({ error: "KOL not found" }, { status: 404 });
    }
    
    const kol = await prisma.kOL.findUnique({
      where: { id },
      include: {
        analyses: { orderBy: { createdAt: "desc" } },
        emails: { orderBy: { createdAt: "desc" } },
      },
    });
    if (!kol) {
      return NextResponse.json({ error: "KOL not found" }, { status: 404 });
    }
    return NextResponse.json({
      ...kol,
      contactInfo: kol.contactInfo ? JSON.parse(kol.contactInfo) : { emails: [], phones: [], instagrams: [], youtubes: [] },
      tier: kol.tier || getTier(kol.followers),
    });
  } catch (error) {
    // Return demo data if database query fails
    const { id } = params;
    const demoKol = demoKolDetails[id];
    if (demoKol) {
      return NextResponse.json(demoKol);
    }
    return NextResponse.json(
      { error: "Failed to fetch KOL" },
      { status: 500 }
    );
  }
}

// PUT update KOL
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!prisma) return NextResponse.json({ error: "Database not available" }, { status: 503 });
    const { id } = params;
    const body = await request.json();
    const contactInfo = body.contactInfo
      ? (typeof body.contactInfo === 'string' ? body.contactInfo : JSON.stringify(body.contactInfo))
      : undefined;
    const kol = await prisma.kOL.update({
      where: { id },
      data: {
        name: body.name,
        platform: body.platform,
        profileUrl: body.profileUrl,
        followers: body.followers,
        niche: body.niche,
        region: body.region,
        engagement: body.engagement,
        status: body.status,
        notes: body.notes,
        language: body.language,
        ...(contactInfo !== undefined && { contactInfo }),
        priority: body.priority,
        tier: body.tier,
        engagementRate: body.engagementRate,
        avgViews: body.avgViews,
      },
    });
    return NextResponse.json({
      ...kol,
      contactInfo: kol.contactInfo ? JSON.parse(kol.contactInfo) : null,
      tier: kol.tier || getTier(kol.followers),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update KOL" },
      { status: 500 }
    );
  }
}

// DELETE KOL
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!prisma) return NextResponse.json({ error: "Database not available" }, { status: 503 });
    const { id } = params;
    await prisma.kOL.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete KOL" },
      { status: 500 }
    );
  }
}
