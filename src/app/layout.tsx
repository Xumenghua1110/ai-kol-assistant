import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "AI Solar Connect",
  description:
    "AI-powered contact discovery, profile analysis, and personalized outreach for solar industry global marketing teams.",
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
