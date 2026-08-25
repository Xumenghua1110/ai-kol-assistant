import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "AI Outreach Hub",
  description:
    "AI-powered multilingual outreach platform for global business development teams. Manage contacts, generate personalized messages, and track outreach across Email, WhatsApp, and Instagram.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full flex">
        <Sidebar />
        <main className="flex-1 ml-64 overflow-auto">{children}</main>
      </body>
    </html>
  );
}
