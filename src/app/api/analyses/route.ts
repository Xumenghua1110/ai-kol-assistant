import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { analyzeKOLProfile } from "@/lib/openai";

// GET analyses for a KOL
export async function GET(request: Request) {
  try {
    if (!prisma) return NextResponse.json([]);
    const { searchParams } = new URL(request.url);
    const kolId = searchParams.get("kolId");
    if (!kolId) {
      return NextResponse.json(
        { error: "kolId is required" },
        { status: 400 }
      );
    }
    const analyses = await prisma.analysis.findMany({
      where: { kolId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(analyses);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch analyses" },
      { status: 500 }
    );
  }
}

// POST create analysis (calls OpenAI)
export async function POST(request: Request) {
  try {
    if (!prisma) return NextResponse.json({ error: "Database not available" }, { status: 503 });
    const body = await request.json();
    const { kolId, kolData } = body;

    if (!kolId || !kolData) {
      return NextResponse.json(
        { error: "kolId and kolData are required" },
        { status: 400 }
      );
    }

    // Call OpenAI to analyze KOL
    const analysis = await analyzeKOLProfile(kolData);

    // Save to database
    const savedAnalysis = await prisma.analysis.create({
      data: {
        kolId,
        contentStyle: analysis.contentStyle || null,
        audienceProfile: analysis.audienceProfile || null,
        engagementQuality: analysis.engagementQuality || null,
        brandFitScore: analysis.brandFitScore || null,
        recommendations: JSON.stringify(analysis.recommendations || []),
        riskFactors: JSON.stringify(analysis.riskFactors || []),
        rawResponse: JSON.stringify(analysis),
      },
    });

    // Update KOL status to "Analyzed"
    await prisma.kOL.update({
      where: { id: kolId },
      data: { status: "Analyzed" },
    });

    return NextResponse.json(savedAnalysis, { status: 201 });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze KOL" },
      { status: 500 }
    );
  }
}
