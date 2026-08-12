import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all campaigns
export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(campaigns);
  } catch (error) {
    // Return empty array if database is not available
    return NextResponse.json([]);
  }
}

// POST create campaign
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const campaign = await prisma.campaign.create({
      data: {
        name: body.name,
        status: body.status || "Planning",
        notes: body.notes || null,
      },
    });
    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create campaign" },
      { status: 500 }
    );
  }
}
