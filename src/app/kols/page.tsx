"use client";
import { useState } from "react";
import { Plus, Search, Video, Camera, Globe, ChevronRight, Users, Upload, Mail, X } from "lucide-react";
import Link from "next/link";
import { demoKols, type KOL } from "@/lib/demoData";

const platformIcons: Record<string, typeof Video> = { YouTube: Video, Instagram: Camera, TikTok: Globe };
const tierColors: Record<string, string> = {
  Mega: "bg-red-100 text-red-700", Macro: "bg-purple-100 text-purple-700",
  Micro: "bg-blue-100 text-blue-700", Nano: "bg-gray-100 text-gray-700",
};
const statusColors: Record<string, string> = {
  New: "bg-blue-100 text-blue-700", Analyzed: "bg-purple-100 text-purple-700",
  Contacted: "bg-amber-100 text-amber-700", Collaborating: "bg-green-100 text-green-700",
};
const priorityColors: Record<string, string> = {
  Critical: "bg-red-100 text-red-700", High: "bg-orange-100 text-orange-700",
  Medium: "bg-yellow-100 text-yellow-700", Low: "bg-gray-100 text-gray-500",
};
const priorityOrder: Record<string, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };

const regionMap: Record<string, string> = {
  "巴西": "Brazil", "哥伦比亚": "Colombia", "阿根廷": "Argentina", "智利": "Chile",
  "墨西哥": "Mexico", "西班牙（覆盖全拉美）": "Spain (covers Latin America)",
  "西班牙": "Spain", "秘鲁": "Peru", "拉美": "Latin America",
};
const languageMap: Record<string, string> = {
  "葡语": "Portuguese", "西语": "Spanish", "英语": "English", "中文": "Chinese",
};
function translateText(text: string): string {
  if (!text) return text;
  let result = text;
  for (const [cn, en] of Object.entries(regionMap)) { result = result.replace(cn, en); }
  for (const [cn, en] of Object.entries(languageMap)) { result = result.replace(cn, en); }
  return result;
}

export default function KOLDiscovery() {
  const [kols] = useState<KOL[]>(demoKols);
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const filteredKOLs = kols
    .filter(kol => {
      const matchSearch = kol.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (kol.niche?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        (kol.region?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      const matchTier = !tierFilter || kol.tier === tierFilter;
      const matchPriority = !priorityFilter || kol.priority === priorityFilter;
      return matchSearch && matchTier && matchPriority;
    })
    .sort((a, b) => (priorityOrder[a.priority || "Low"] ?? 4) - (priorityOrder[b.priority || "Low"] ?? 4));

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">KOL Discovery</h1>
          <p className="text-[var(--muted)] mt-1">Import, analyze, and manage your KOL database</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
            <Upload className="w-4 h-4" /> Import from Excel
          </button>
          <button className="flex items-center gap-2 bg-[var(--primary)] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors">
            <Plus className="w-4 h-4" /> Add KOL
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
          <input type="text" placeholder="Search by name, niche, or region..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]/50" />
        </div>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg text-sm text-[var(--muted)] focus:outline-none focus:border-[var(--primary)]/50">
          <option value="">All Priorities</option>
          <option value="Critical">Critical</option><option value="High">High</option>
          <option value="Medium">Medium</option><option value="Low">Low</option>
        </select>
        <select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)}
          className="px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg text-sm text-[var(--muted)] focus:outline-none focus:border-[var(--primary)]/50">
          <option value="">All Tiers</option>
          <option value="Mega">Mega (1M+)</option><option value="Macro">Macro (100K+)</option>
          <option value="Micro">Micro (10K+)</option><option value="Nano">Nano (&lt;10K)</option>
        </select>
      </div>

      {filteredKOLs.length === 0 ? (
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-12 text-center">
          <Users className="w-12 h-12 text-[var(--muted)] mx-auto mb-3 opacity-40" />
          <p className="text-[var(--muted)]">No KOLs match your filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredKOLs.map((kol) => {
            const PlatformIcon = platformIcons[kol.platform] || Globe;
            const contactCount = (kol.contactInfo?.emails?.length || 0) + (kol.contactInfo?.phones?.length || 0) + (kol.contactInfo?.instagrams?.length || 0);
            return (
              <Link key={kol.id} href={`/kols/${kol.id}`} className="group bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-5 hover:border-[var(--primary)]/30 hover:shadow-sm transition-all block">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <PlatformIcon className="w-5 h-5 text-[var(--muted)]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">{kol.name}</h3>
                      <p className="text-sm text-[var(--muted)] mt-0.5">{kol.niche || "Solar Energy"} · {translateText(kol.region || "") || "No region"}{kol.language ? ` · ${translateText(kol.language)}` : ""}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {kol.tier && <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tierColors[kol.tier] || tierColors.Nano}`}>{kol.tier}</span>}
                    {kol.priority && <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[kol.priority] || priorityColors.Medium}`}>{kol.priority}</span>}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[kol.status] || statusColors.New}`}>{kol.status}</span>
                    {contactCount > 0 && <span className="flex items-center gap-1 text-xs text-[var(--muted)]"><Mail className="w-3 h-3" />{contactCount}</span>}
                    <ChevronRight className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--primary)] transition-colors" />
                  </div>
                </div>
                {kol.followers > 0 && <div className="mt-2 text-xs text-[var(--muted)]">{kol.followers.toLocaleString()} followers{kol.engagementRate ? ` · ${kol.engagementRate}% engagement` : ""}{kol.avgViews ? ` · ${kol.avgViews.toLocaleString()} avg views` : ""}</div>}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
