import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getTier(followers: number): string {
  if (followers >= 1000000) return "Mega";
  if (followers >= 100000) return "Macro";
  if (followers >= 10000) return "Micro";
  return "Nano";
}

// GET all KOLs
export async function GET() {
  try {
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
    return NextResponse.json(
      { error: "Failed to fetch KOLs" },
      { status: 500 }
    );
  }
}

// POST create new KOL
export async function POST(request: Request) {
  try {
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
