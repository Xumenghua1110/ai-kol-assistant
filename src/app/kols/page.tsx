"use client";
import { useState, useEffect } from "react";
import { Plus, Search, Video, Camera, Globe, ChevronRight, Users, Mail, X, CheckSquare, Square, Send, Building2, Megaphone, Truck, Wrench, HelpCircle, Edit3, Trash2, Save } from "lucide-react";
import Link from "next/link";
import { demoKols, CONTACT_TYPES, OUTREACH_STATUS, type KOL, type ContactType, type OutreachStatus } from "@/lib/demoData";

const STORAGE_KEY = "kol_contacts";

function loadContacts(): KOL[] {
  if (typeof window === "undefined") return demoKols;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const stored: KOL[] = data ? JSON.parse(data) : [];
    const storedIds = new Set(stored.map((c) => c.id));
    const newDemos = demoKols.filter((k) => !storedIds.has(k.id));
    return [...stored, ...newDemos];
  } catch { return demoKols; }
}

const platformIcons: Record<string, typeof Video> = { YouTube: Video, Instagram: Camera, TikTok: Globe, Website: Globe };
const tierColors: Record<string, string> = {
  Mega: "bg-red-100 text-red-700", Macro: "bg-purple-100 text-purple-700",
  Micro: "bg-blue-100 text-blue-700", Nano: "bg-gray-100 text-gray-500",
};
const statusColors: Record<string, string> = {
  "Not Contacted": "bg-gray-100 text-gray-600", Sent: "bg-blue-100 text-blue-700",
  Replied: "bg-green-100 text-green-700", Meeting: "bg-purple-100 text-purple-700",
  Declined: "bg-red-100 text-red-700",
};
const priorityColors: Record<string, string> = {
  Critical: "bg-red-100 text-red-700", High: "bg-orange-100 text-orange-700",
  Medium: "bg-yellow-100 text-yellow-700", Low: "bg-gray-100 text-gray-500",
};
const priorityOrder: Record<string, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };

const typeIcons: Record<string, typeof Building2> = {
  KOL: Users, Association: Building2, Media: Megaphone, Distributor: Truck, Installer: Wrench, Other: HelpCircle,
};
const typeColors: Record<string, string> = {
  KOL: "bg-blue-100 text-blue-700", Association: "bg-purple-100 text-purple-700",
  Media: "bg-amber-100 text-amber-700", Distributor: "bg-green-100 text-green-700",
  Installer: "bg-teal-100 text-teal-700", Other: "bg-gray-100 text-gray-600",
};

export default function KOLDiscovery() {
  const [kols, setKols] = useState<KOL[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBatchPanel, setShowBatchPanel] = useState(false);
  const [showBatchEdit, setShowBatchEdit] = useState(false);
  const [batchEditFields, setBatchEditFields] = useState({ status: "", priority: "", type: "", source: "", niche: "" });
  const [editKol, setEditKol] = useState<KOL | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => { setKols(loadContacts()); }, []);

  const sources = [...new Set(kols.map((k) => k.source).filter(Boolean))];

  const filteredKOLs = kols
    .filter((kol) => {
      const matchSearch = !searchQuery || kol.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (kol.niche?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        (kol.region?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      const matchType = !typeFilter || kol.type === typeFilter;
      const matchStatus = !statusFilter || kol.status === statusFilter;
      const matchSource = !sourceFilter || kol.source === sourceFilter;
      const matchPriority = !priorityFilter || kol.priority === priorityFilter;
      return matchSearch && matchType && matchStatus && matchSource && matchPriority;
    })
    .sort((a, b) => (priorityOrder[a.priority || "Low"] ?? 4) - (priorityOrder[b.priority || "Low"] ?? 4));

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };

  const selectAll = () => {
    if (selectedIds.size === filteredKOLs.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filteredKOLs.map((k) => k.id)));
  };

  const updateStatus = (ids: string[], status: OutreachStatus) => {
    const updated = kols.map((k) => ids.includes(k.id) ? { ...k, status, updatedAt: new Date().toISOString() } : k);
    setKols(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.filter((k) => !demoKols.find((d) => d.id === k.id))));
    setSelectedIds(new Set());
    setShowBatchPanel(false);
  };

  const saveEdit = () => {
    if (!editKol) return;
    const updated = kols.map((k) => k.id === editKol.id ? { ...editKol, updatedAt: new Date().toISOString() } : k);
    setKols(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.filter((k) => !demoKols.find((d) => d.id === k.id))));
    setEditKol(null);
  };

  const deleteContact = (id: string) => {
    const updated = kols.filter((k) => k.id !== id);
    setKols(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.filter((k) => !demoKols.find((d) => d.id === k.id))));
    setDeleteConfirm(null);
  };

  const saveBatchEdit = () => {
    const updated = kols.map((k) => {
      if (!selectedIds.has(k.id)) return k;
      const next = { ...k, updatedAt: new Date().toISOString() };
      if (batchEditFields.status) next.status = batchEditFields.status as OutreachStatus;
      if (batchEditFields.priority) next.priority = batchEditFields.priority;
      if (batchEditFields.type) next.type = batchEditFields.type as ContactType;
      if (batchEditFields.source) next.source = batchEditFields.source;
      if (batchEditFields.niche) next.niche = batchEditFields.niche;
      return next;
    });
    setKols(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.filter((k) => !demoKols.find((d) => d.id === k.id))));
    setShowBatchEdit(false);
    setBatchEditFields({ status: "", priority: "", type: "", source: "", niche: "" });
    setSelectedIds(new Set());
  };

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Contacts</h1>
          <p className="text-[var(--muted)] mt-1">Manage KOLs, associations, media, distributors, and installers</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/import" className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
            <Plus className="w-4 h-4" /> Import
          </Link>
          <Link href="/email" className="flex items-center gap-2 bg-[var(--primary)] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors">
            <Send className="w-4 h-4" /> Outreach
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
          <input type="text" placeholder="Search by name, niche, or region..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]/50" />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg text-sm text-[var(--muted)] focus:outline-none focus:border-[var(--primary)]/50">
          <option value="">All Types</option>
          {CONTACT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg text-sm text-[var(--muted)] focus:outline-none focus:border-[var(--primary)]/50">
          <option value="">All Status</option>
          {OUTREACH_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}
          className="px-3 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg text-sm text-[var(--muted)] focus:outline-none focus:border-[var(--primary)]/50">
          <option value="">All Sources</option>
          {sources.map((s) => <option key={s} value={s || ""}>{s}</option>)}
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg text-sm text-[var(--muted)] focus:outline-none focus:border-[var(--primary)]/50">
          <option value="">All Priorities</option>
          <option value="Critical">Critical</option><option value="High">High</option>
          <option value="Medium">Medium</option><option value="Low">Low</option>
        </select>
      </div>

      {/* Batch Action Bar */}
      {selectedIds.size > 0 && (
        <div className="bg-[var(--primary)]/5 border border-[var(--primary)]/20 rounded-xl px-5 py-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckSquare className="w-4 h-4 text-[var(--primary)]" />
            <span className="text-sm font-medium">{selectedIds.size} selected</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowBatchEdit(true)} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors flex items-center gap-1">
              <Edit3 className="w-3 h-3" /> Batch Edit
            </button>
            <button onClick={() => setShowBatchPanel(true)} className="px-3 py-1.5 bg-[var(--primary)] text-white rounded-lg text-xs font-medium hover:bg-[var(--primary-hover)] transition-colors flex items-center gap-1">
              <Send className="w-3 h-3" /> Batch Outreach
            </button>
            <button onClick={() => setSelectedIds(new Set())} className="px-3 py-1.5 border border-[var(--card-border)] rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors">Clear</button>
          </div>
        </div>
      )}

      {/* Batch Status Panel */}
      {showBatchPanel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="bg-[var(--card-bg)] rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Update Status for {selectedIds.size} contacts</h2>
              <button onClick={() => setShowBatchPanel(false)} className="text-[var(--muted)] hover:text-[var(--foreground)]"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-2">
              {OUTREACH_STATUS.map((s) => (
                <button key={s} onClick={() => updateStatus([...selectedIds], s)} className={`w-full px-4 py-3 rounded-lg text-sm font-medium text-left flex items-center justify-between hover:bg-gray-50 transition-colors ${statusColors[s] || ""}`}>
                  {s} <ChevronRight className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Batch Edit Modal */}
      {showBatchEdit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="bg-[var(--card-bg)] rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">Batch Edit — {selectedIds.size} contacts</h2>
              <button onClick={() => { setShowBatchEdit(false); setBatchEditFields({ status: "", priority: "", type: "", source: "", niche: "" }); }} className="text-[var(--muted)] hover:text-[var(--foreground)]"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-xs text-[var(--muted)] mb-4">Only fill in the fields you want to update. Empty fields will be kept unchanged.</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-1">Status</label>
                <select value={batchEditFields.status} onChange={(e) => setBatchEditFields({ ...batchEditFields, status: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]/50">
                  <option value="">— Keep current —</option>
                  {OUTREACH_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-1">Priority</label>
                <select value={batchEditFields.priority} onChange={(e) => setBatchEditFields({ ...batchEditFields, priority: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]/50">
                  <option value="">— Keep current —</option>
                  <option value="Critical">Critical</option><option value="High">High</option>
                  <option value="Medium">Medium</option><option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-1">Type</label>
                <select value={batchEditFields.type} onChange={(e) => setBatchEditFields({ ...batchEditFields, type: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]/50">
                  <option value="">— Keep current —</option>
                  {CONTACT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-1">Source</label>
                <input type="text" value={batchEditFields.source} onChange={(e) => setBatchEditFields({ ...batchEditFields, source: e.target.value })} placeholder="e.g. 巴西光伏电工协会名单"
                  className="w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-1">Niche</label>
                <input type="text" value={batchEditFields.niche} onChange={(e) => setBatchEditFields({ ...batchEditFields, niche: e.target.value })} placeholder="e.g. Solar Energy"
                  className="w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]/50" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setShowBatchEdit(false); setBatchEditFields({ status: "", priority: "", type: "", source: "", niche: "" }); }} className="px-4 py-2 border border-[var(--card-border)] rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={saveBatchEdit} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1.5">
                <Save className="w-3.5 h-3.5" /> Apply to {selectedIds.size} contacts
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editKol && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="bg-[var(--card-bg)] rounded-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">Edit Contact</h2>
              <button onClick={() => setEditKol(null)} className="text-[var(--muted)] hover:text-[var(--foreground)]"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-1">Name</label>
                <input type="text" value={editKol.name} onChange={(e) => setEditKol({ ...editKol, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]/50" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--muted)] mb-1">Type</label>
                  <select value={editKol.type} onChange={(e) => setEditKol({ ...editKol, type: e.target.value as ContactType })}
                    className="w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]/50">
                    {CONTACT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--muted)] mb-1">Platform</label>
                  <input type="text" value={editKol.platform} onChange={(e) => setEditKol({ ...editKol, platform: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]/50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--muted)] mb-1">Region</label>
                  <input type="text" value={editKol.region || ""} onChange={(e) => setEditKol({ ...editKol, region: e.target.value || null })}
                    className="w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]/50" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--muted)] mb-1">Language</label>
                  <input type="text" value={editKol.language || ""} onChange={(e) => setEditKol({ ...editKol, language: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]/50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--muted)] mb-1">Priority</label>
                  <select value={editKol.priority || "Medium"} onChange={(e) => setEditKol({ ...editKol, priority: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]/50">
                    <option value="Critical">Critical</option><option value="High">High</option>
                    <option value="Medium">Medium</option><option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--muted)] mb-1">Status</label>
                  <select value={editKol.status} onChange={(e) => setEditKol({ ...editKol, status: e.target.value as OutreachStatus })}
                    className="w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]/50">
                    {OUTREACH_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-1">Niche</label>
                <input type="text" value={editKol.niche || ""} onChange={(e) => setEditKol({ ...editKol, niche: e.target.value || null })}
                  className="w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-1">Source</label>
                <input type="text" value={editKol.source || ""} onChange={(e) => setEditKol({ ...editKol, source: e.target.value || null })}
                  className="w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-1">Contact Person</label>
                <input type="text" value={editKol.contactPerson || ""} onChange={(e) => setEditKol({ ...editKol, contactPerson: e.target.value || null })}
                  className="w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-1">Website</label>
                <input type="text" value={editKol.website || ""} onChange={(e) => setEditKol({ ...editKol, website: e.target.value || null })}
                  className="w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]/50" />
              </div>
              <div className="border-t border-[var(--card-border)] pt-4">
                <h3 className="text-sm font-medium mb-3">Contact Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-[var(--muted)] mb-1">Emails (comma separated)</label>
                    <input type="text" value={editKol.contactInfo?.emails?.join(", ") || ""} onChange={(e) => setEditKol({ ...editKol, contactInfo: { ...editKol.contactInfo, emails: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) } })}
                      className="w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]/50" />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--muted)] mb-1">WhatsApp / Phone (comma separated)</label>
                    <input type="text" value={editKol.contactInfo?.phones?.join(", ") || ""} onChange={(e) => setEditKol({ ...editKol, contactInfo: { ...editKol.contactInfo, phones: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) } })}
                      className="w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]/50" />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--muted)] mb-1">Instagram (comma separated)</label>
                    <input type="text" value={editKol.contactInfo?.instagrams?.join(", ") || ""} onChange={(e) => setEditKol({ ...editKol, contactInfo: { ...editKol.contactInfo, instagrams: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) } })}
                      className="w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]/50" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-1">Notes</label>
                <textarea value={editKol.notes || ""} onChange={(e) => setEditKol({ ...editKol, notes: e.target.value })} rows={3}
                  className="w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]/50 resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setEditKol(null)} className="px-4 py-2 border border-[var(--card-border)] rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={saveEdit} className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors flex items-center gap-1.5">
                <Save className="w-3.5 h-3.5" /> Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="bg-[var(--card-bg)] rounded-xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Delete Contact</h2>
                <p className="text-sm text-[var(--muted)]">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-[var(--muted)] mb-5">
              Are you sure you want to delete <strong className="text-[var(--foreground)]">{kols.find((k) => k.id === deleteConfirm)?.name}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 border border-[var(--card-border)] rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => deleteContact(deleteConfirm)} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {filteredKOLs.length === 0 ? (
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-12 text-center">
          <Users className="w-12 h-12 text-[var(--muted)] mx-auto mb-3 opacity-40" />
          <p className="text-[var(--muted)]">No contacts match your filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <button onClick={selectAll} className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
              {selectedIds.size === filteredKOLs.length ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
            </button>
            <span className="text-xs text-[var(--muted)]">{filteredKOLs.length} contacts</span>
          </div>
          {filteredKOLs.map((kol) => {
            const PlatformIcon = platformIcons[kol.platform] || Globe;
            const TypeIcon = typeIcons[kol.type] || Users;
            const contactCount = (kol.contactInfo?.emails?.length || 0) + (kol.contactInfo?.phones?.length || 0) + (kol.contactInfo?.instagrams?.length || 0);
            const isSelected = selectedIds.has(kol.id);
            return (
              <div key={kol.id} className={`group bg-[var(--card-bg)] border rounded-xl p-5 hover:shadow-sm transition-all ${isSelected ? "border-[var(--primary)]/50 bg-[var(--primary)]/5" : "border-[var(--card-border)] hover:border-[var(--primary)]/30"}`}>
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleSelect(kol.id)} className="text-[var(--muted)] hover:text-[var(--primary)] transition-colors shrink-0">
                    {isSelected ? <CheckSquare className="w-4 h-4 text-[var(--primary)]" /> : <Square className="w-4 h-4" />}
                  </button>
                  <Link href={`/kols/${kol.id}`} className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <PlatformIcon className="w-5 h-5 text-[var(--muted)]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">{kol.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[kol.type] || typeColors.Other}`}>
                          <TypeIcon className="w-3 h-3 inline mr-1 -ml-0.5" />{kol.type}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--muted)] mt-0.5 truncate">{kol.niche || "Solar Energy"} · {kol.region || "No region"}{kol.language ? ` · ${kol.language}` : ""}</p>
                    </div>
                  </Link>
                  <div className="flex items-center gap-2 shrink-0">
                    {kol.source && <span className="text-xs text-[var(--muted)] bg-gray-50 px-2 py-0.5 rounded hidden md:inline">{kol.source}</span>}
                    {kol.priority && <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[kol.priority] || priorityColors.Medium}`}>{kol.priority}</span>}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[kol.status] || statusColors["Not Contacted"]}`}>{kol.status}</span>
                    {contactCount > 0 ? <span className="flex items-center gap-1 text-xs text-[var(--muted)]"><Mail className="w-3 h-3" />{contactCount}</span> : <span className="text-xs text-red-400 bg-red-50 px-1.5 py-0.5 rounded">No contact</span>}
                    <button onClick={(e) => { e.preventDefault(); setEditKol({ ...kol }); }} className="text-[var(--muted)] hover:text-[var(--primary)] transition-colors p-1" title="Edit">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={(e) => { e.preventDefault(); setDeleteConfirm(kol.id); }} className="text-[var(--muted)] hover:text-red-500 transition-colors p-1" title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <Link href={`/kols/${kol.id}`} className="text-[var(--muted)] hover:text-[var(--primary)] transition-colors"><ChevronRight className="w-4 h-4" /></Link>
                  </div>
                </div>
                {kol.followers > 0 && <div className="mt-2 ml-15 text-xs text-[var(--muted)]">{kol.followers.toLocaleString()} followers{kol.engagementRate ? ` · ${kol.engagementRate}% engagement` : ""}{kol.avgViews ? ` · ${kol.avgViews.toLocaleString()} avg views` : ""}</div>}
                {kol.contactPerson && <div className="mt-1 ml-15 text-xs text-[var(--muted)]">Contact: {kol.contactPerson}</div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
