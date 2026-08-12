import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Demo data for when database is not available
const demoData = {
  kolCount: 12,
  emailCount: 8,
  sentEmails: 5,
  repliedEmails: 2,
  responseRate: 40,
};

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
    // Return demo data if database is not available
    return NextResponse.json(demoData);
  }
}
