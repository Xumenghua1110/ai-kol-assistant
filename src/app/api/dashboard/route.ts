import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET dashboard stats
export async function GET() {
  try {
    const [
      kolCount,
      emailCount,
      sentEmails,
      repliedEmails,
    ] = await Promise.all([
      prisma.kOL.count(),
      prisma.email.count(),
      prisma.email.count({ where: { status: "Sent" } }),
      prisma.email.count({ where: { status: "Replied" } }),
    ]);

    const responseRate = sentEmails > 0 ? Math.round((repliedEmails / sentEmails) * 100) : 0;

    return NextResponse.json({
      kolCount,
      emailCount,
      sentEmails,
      repliedEmails,
      responseRate,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
