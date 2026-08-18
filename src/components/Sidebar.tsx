"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Mail,
  BarChart3,
  Zap,
  Upload,
  Send,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Contacts", href: "/kols", icon: Users },
  { name: "Import", href: "/import", icon: Upload },
  { name: "Outreach", href: "/email", icon: Mail },
  { name: "Sent", href: "/sent", icon: Send },
  { name: "Campaigns", href: "/campaigns", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[var(--sidebar-bg)] flex flex-col z-50">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
        <div className="w-9 h-9 rounded-lg bg-[var(--primary)] flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-white text-sm font-semibold tracking-wide">
            AI KOL Assistant
          </h1>
          <p className="text-[var(--sidebar-text)] text-xs">
            Outreach Powered by AI
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-white/10 text-white"
                  : "text-[var(--sidebar-text)] hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="w-[18px] h-[18px]" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="rounded-lg bg-white/5 px-3 py-3">
          <p className="text-[var(--sidebar-text)] text-xs leading-relaxed">
            MVP v0.1 — Built with Vibe Coding
          </p>
          <p className="text-[var(--sidebar-text)] text-xs mt-1 opacity-60">
            Next.js + OpenAI + Prisma
          </p>
        </div>
      </div>
    </aside>
  );
}
