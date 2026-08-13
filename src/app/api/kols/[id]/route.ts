import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getTier(followers: number): string {
  if (followers >= 1000000) return "Mega";
  if (followers >= 100000) return "Macro";
  if (followers >= 10000) return "Micro";
  return "Nano";
}

// GET single KOL with analyses and emails
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!prisma) return NextResponse.json({ error: "Database not available" }, { status: 503 });
    const { id } = params;
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
