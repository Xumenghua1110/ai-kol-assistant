"use client";
import { useEffect, useState, useRef } from "react";
import { Plus, Search, Video, Camera, Globe, ChevronRight, Sparkles, X, Users, Upload, Mail } from "lucide-react";
import Link from "next/link";
import * as XLSX from "xlsx";

interface KOL {
  id: string; name: string; platform: string; followers: number;
  niche: string | null; region: string | null; engagement: string | null;
  status: string; profileUrl: string | null; priority?: string;
  language?: string; market?: string; contactInfo?: any;
  tier?: string; engagementRate?: number; avgViews?: number;
}

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

function parseContactInfo(contact: string): { emails: string[]; phones: string[]; instagrams: string[]; youtubes: string[] } {
  if (!contact) return { emails: [], phones: [], instagrams: [], youtubes: [] };
  const s = String(contact);
  const emails = s.match(/[\w\.-]+@[\w\.-]+\.\w+/g) || [];
  const phones = s.match(/\+?\d[\d\s\-]{8,}/g) || [];
  const instagrams: string[] = [];
  const igMatch = s.match(/Instagram:\s*@(\w+)/gi);
  if (igMatch) igMatch.forEach(m => { const u = m.match(/@(\w+)/); if (u) instagrams.push(u[1]); });
  const youtubes: string[] = [];
  const ytMatch = s.match(/YouTube:\s*(@?\w[\w\s\-]*)/gi);
  if (ytMatch) ytMatch.forEach(m => { const u = m.match(/YouTube:\s*(.+)/i); if (u) youtubes.push(u[1].trim()); });
  return { emails, phones, instagrams, youtubes };
}

function detectPlatform(contact: string, youtubes: string[], instagrams: string[]): string {
  if (youtubes.length > 0) return "YouTube";
  if (instagrams.length > 0) return "Instagram";
  const s = String(contact || "");
  if (s.match(/TikTok/i)) return "TikTok";
  if (s.match(/WhatsApp/i) && !s.match(/@/)) return "WhatsApp";
  return "YouTube";
}

function extractFollowers(notes: string): number {
  if (!notes) return 0;
  const wanMatch = notes.match(/(\d+(?:\.\d+)?)\s*万/);
  if (wanMatch) return Math.round(parseFloat(wanMatch[1]) * 10000);
  const subMatch = notes.match(/(\d+(?:\.\d+)?)\s*订阅/);
  if (subMatch) return Math.round(parseFloat(subMatch[1]) * 1000);
  const kMatch = notes.match(/(\d+(?:\.\d+)?)\s*[Kk]/);
  if (kMatch) return Math.round(parseFloat(kMatch[1]) * 1000);
  return 0;
}

function getTier(followers: number): string {
  if (followers >= 1000000) return "Mega";
  if (followers >= 100000) return "Macro";
  if (followers >= 10000) return "Micro";
  return "Nano";
}

function parseExcelKOLs(data: any[]): any[] {
  const priorityMap: Record<string, string> = { "最高": "Critical", "高": "High", "中": "Medium", "低": "Low" };
  const kols: any[] = [];
  let currentMarket = "";

  for (const row of data) {
    const seq = row["序号"] || row["市场"] || "";
    if (seq && String(seq).trim()) currentMarket = String(seq).trim();

    const name = row["KOL / 频道"] || row["KOL"] || row["Name"] || "";
    if (!name || String(name).trim() === "") continue;

    const language = String(row["语言"] || "").trim();
    const region = String(row["市场"] || row["Region"] || currentMarket).trim();
    const contact = String(row["联系渠道"] || row["Contact"] || "").trim();
    const priorityRaw = String(row["优先级"] || row["Priority"] || "").trim();
    const notes = String(row["备注"] || row["Notes"] || "").trim();
    const followUp = String(row["后续"] || row["Follow-up"] || "").trim();

    const priority = priorityMap[priorityRaw] || "Medium";
    const contactInfo = parseContactInfo(contact);
    const platform = detectPlatform(contact, contactInfo.youtubes, contactInfo.instagrams);
    const followers = extractFollowers(notes);
    const tier = getTier(followers);
    const isContacted = followUp.includes("已邮件") || followUp.includes("已联系");

    kols.push({
      name: String(name).trim(),
      platform,
      profileUrl: "",
      followers,
      niche: "Solar Energy",
      region,
      engagement: "",
      status: isContacted ? "Contacted" : "New",
      notes: notes && !notes.includes("DISPIMG") ? notes : "",
      priority,
      language,
      market: currentMarket,
      contactInfo,
      tier,
      followUp: followUp && !followUp.includes("DISPIMG") ? followUp : "",
    });
  }
  return kols;
}

export default function KOLDiscovery() {
  const [kols, setKols] = useState<KOL[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newKOL, setNewKOL] = useState({ name: "", platform: "YouTube", profileUrl: "", followers: 0, niche: "", region: "", engagementRate: 0, avgViews: 0, notes: "", language: "", priority: "Medium" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchKOLs(); }, []);

  const fetchKOLs = () => {
    fetch("/api/kols").then(r => r.json()).then(d => { setKols(d); setLoading(false); }).catch(() => setLoading(false));
  };

  const handleAddKOL = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/kols", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newKOL) });
      if (res.ok) { fetchKOLs(); setShowAddModal(false); setNewKOL({ name: "", platform: "YouTube", profileUrl: "", followers: 0, niche: "", region: "", engagementRate: 0, avgViews: 0, notes: "", language: "", priority: "Medium" }); }
    } catch (error) { console.error("Failed to add KOL:", error); }
    setSubmitting(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportResult("");
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: any[] = XLSX.utils.sheet_to_json(firstSheet, { defval: "" });
      const parsedKols = parseExcelKOLs(jsonData);

      if (parsedKols.length === 0) {
        setImportResult("No valid KOL data found in the file. Please check the column headers.");
        setImporting(false);
        return;
      }

      const res = await fetch("/api/kols/batch-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kols: parsedKols }),
      });
      const data = await res.json();
      if (data.success) {
        setImportResult(`Successfully imported ${data.count} KOLs from "${file.name}"!`);
        fetchKOLs();
      } else {
        setImportResult(`Import failed: ${data.error}`);
      }
    } catch (error) {
      setImportResult("Failed to parse file. Please upload a valid Excel file (.xlsx/.xls).");
    }
    setImporting(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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

  if (loading) return <div className="p-8 max-w-6xl"><div className="flex items-center justify-center h-64"><p className="text-[var(--muted)]">Loading KOLs...</p></div></div>;

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">KOL Discovery</h1>
          <p className="text-[var(--muted)] mt-1">Import, analyze, and manage your KOL database</p>
        </div>
        <div className="flex items-center gap-3">
          <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} disabled={importing} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50">
            <Upload className="w-4 h-4" /> {importing ? "Importing..." : "Import from Excel"}
          </button>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-[var(--primary)] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors">
            <Plus className="w-4 h-4" /> Add KOL
          </button>
        </div>
      </div>
      {importResult && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-center justify-between">
          <span>{importResult}</span>
          <button onClick={() => setImportResult("")} className="text-green-500 hover:text-green-700"><X className="w-4 h-4" /></button>
        </div>
      )}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
          <input type="text" placeholder="Search by name, niche, or region..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]/50" />
        </div>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg text-sm text-[var(--muted)] focus:outline-none focus:border-[var(--primary)]/50">
          <option value="">All Priorities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)}
          className="px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg text-sm text-[var(--muted)] focus:outline-none focus:border-[var(--primary)]/50">
          <option value="">All Tiers</option>
          <option value="Mega">Mega (1M+)</option>
          <option value="Macro">Macro (100K+)</option>
          <option value="Micro">Micro (10K+)</option>
          <option value="Nano">Nano (&lt;10K)</option>
        </select>
      </div>
      {filteredKOLs.length === 0 ? (
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-12 text-center">
          <Users className="w-12 h-12 text-[var(--muted)] mx-auto mb-3 opacity-40" />
          <p className="text-[var(--muted)]">{kols.length === 0 ? "No KOLs yet. Click \"Import from Excel\" to upload your spreadsheet, or add manually." : "No KOLs match your filters."}</p>
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
                      <p className="text-sm text-[var(--muted)] mt-0.5">{kol.niche || "Solar Energy"} · {translateText(kol.region) || "No region"}{kol.language ? ` · ${translateText(kol.language)}` : ""}</p>
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
      {/* Add KOL Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Add New KOL</h2>
              <button onClick={() => setShowAddModal(false)} className="text-[var(--muted)] hover:text-[var(--foreground)]"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <input placeholder="KOL Name *" value={newKOL.name} onChange={(e) => setNewKOL({...newKOL, name: e.target.value})} className="w-full px-3 py-2.5 border rounded-lg text-sm" />
              <div className="grid grid-cols-2 gap-3">
                <select value={newKOL.platform} onChange={(e) => setNewKOL({...newKOL, platform: e.target.value})} className="px-3 py-2.5 border rounded-lg text-sm">
                  <option>YouTube</option><option>Instagram</option><option>TikTok</option>
                </select>
                <select value={newKOL.priority} onChange={(e) => setNewKOL({...newKOL, priority: e.target.value})} className="px-3 py-2.5 border rounded-lg text-sm">
                  <option value="Critical">Critical</option><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option>
                </select>
              </div>
              <input placeholder="Profile URL" value={newKOL.profileUrl} onChange={(e) => setNewKOL({...newKOL, profileUrl: e.target.value})} className="w-full px-3 py-2.5 border rounded-lg text-sm" />
              <div className="grid grid-cols-3 gap-3">
                <input type="number" placeholder="Followers" value={newKOL.followers || ""} onChange={(e) => setNewKOL({...newKOL, followers: parseInt(e.target.value) || 0})} className="px-3 py-2.5 border rounded-lg text-sm" />
                <input type="number" placeholder="Engagement %" step="0.1" value={newKOL.engagementRate || ""} onChange={(e) => setNewKOL({...newKOL, engagementRate: parseFloat(e.target.value) || 0})} className="px-3 py-2.5 border rounded-lg text-sm" />
                <input type="number" placeholder="Avg Views" value={newKOL.avgViews || ""} onChange={(e) => setNewKOL({...newKOL, avgViews: parseInt(e.target.value) || 0})} className="px-3 py-2.5 border rounded-lg text-sm" />
              </div>
              <input placeholder="Niche" value={newKOL.niche} onChange={(e) => setNewKOL({...newKOL, niche: e.target.value})} className="w-full px-3 py-2.5 border rounded-lg text-sm" />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Region" value={newKOL.region} onChange={(e) => setNewKOL({...newKOL, region: e.target.value})} className="px-3 py-2.5 border rounded-lg text-sm" />
                <select value={newKOL.language} onChange={(e) => setNewKOL({...newKOL, language: e.target.value})} className="px-3 py-2.5 border rounded-lg text-sm">
                  <option value="">Language...</option><option>Portuguese</option><option>Spanish</option><option>English</option><option>Chinese</option>
                </select>
              </div>
              <textarea placeholder="Notes" rows={2} value={newKOL.notes} onChange={(e) => setNewKOL({...newKOL, notes: e.target.value})} className="w-full px-3 py-2.5 border rounded-lg text-sm resize-none" />
              <button onClick={handleAddKOL} disabled={submitting || !newKOL.name} className="w-full bg-[var(--primary)] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--primary-hover)] disabled:opacity-50">
                {submitting ? "Adding..." : "Add KOL"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
