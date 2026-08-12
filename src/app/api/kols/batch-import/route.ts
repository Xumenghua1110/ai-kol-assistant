import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getTier(followers: number): string {
  if (followers >= 1000000) return "Mega";
  if (followers >= 100000) return "Macro";
  if (followers >= 10000) return "Micro";
  return "Nano";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const kols = body.kols || [];

    if (!Array.isArray(kols) || kols.length === 0) {
      return NextResponse.json({ error: "No KOL data provided" }, { status: 400 });
    }

    const created = [];
    for (const kol of kols) {
      const contactInfo = kol.contactInfo
        ? (typeof kol.contactInfo === 'string' ? kol.contactInfo : JSON.stringify(kol.contactInfo))
        : null;
      const tier = kol.tier || getTier(kol.followers || 0);

      const created_kol = await prisma.kOL.create({
        data: {
          name: kol.name || "Unknown",
          platform: kol.platform || "YouTube",
          profileUrl: kol.profileUrl || null,
          followers: kol.followers || 0,
          niche: kol.niche || "Solar Energy",
          region: kol.region || null,
          engagement: kol.engagement || null,
          status: kol.status || "New",
          notes: kol.notes || null,
          language: kol.language || null,
          contactInfo,
          priority: kol.priority || "Medium",
          tier,
          engagementRate: kol.engagementRate || null,
          avgViews: kol.avgViews || null,
        },
      });
      created.push(created_kol);
    }

    return NextResponse.json({ success: true, count: created.length });
  } catch (error: any) {
    console.error("Batch import error:", error);
    return NextResponse.json({ error: error.message || "Failed to import KOLs" }, { status: 500 });
  }
}
