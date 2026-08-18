"use client";

import { useState, useRef } from "react";
import { Upload, FileSpreadsheet, Check, AlertCircle, X, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import * as XLSX from "xlsx";
import { CONTACT_TYPES, OUTREACH_STATUS, type KOL, type ContactType, type OutreachStatus } from "@/lib/demoData";

interface ParsedRow {
  [key: string]: string | number | null;
}

interface ColumnMapping {
  name: string;
  type: string;
  source: string;
  email: string;
  phone: string;
  website: string;
  region: string;
  language: string;
  notes: string;
  contactPerson: string;
  niche: string;
  priority: string;
}

const DEFAULT_MAPPING: ColumnMapping = {
  name: "",
  type: "KOL",
  source: "",
  email: "",
  phone: "",
  website: "",
  region: "",
  language: "English",
  notes: "",
  contactPerson: "",
  niche: "",
  priority: "Medium",
};

const STORAGE_KEY = "kol_contacts";

function loadContacts(): KOL[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

function saveContacts(contacts: KOL[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
}

function detectLanguage(region: string): string {
  const r = (region || "").toLowerCase();
  if (r.includes("brazil") || r.includes("brasil")) return "Portuguese";
  if (r.includes("mexico") || r.includes("méxico")) return "Spanish";
  if (r.includes("argentina") || r.includes("chile") || r.includes("colombia") || r.includes("peru") || r.includes("spain")) return "Spanish";
  if (r.includes("china") || r.includes("中文")) return "Chinese";
  return "English";
}

function detectType(name: string, niche: string): ContactType {
  const text = `${name} ${niche}`.toLowerCase();
  if (text.includes("associa") || text.includes("association") || text.includes("federac") || text.includes("federation") || text.includes("câmara") || text.includes("chamber")) return "Association";
  if (text.includes("media") || text.includes("news") || text.includes("review") || text.includes("magazine") || text.includes("journal")) return "Media";
  if (text.includes("distribut") || text.includes("dealer") || text.includes("wholesale")) return "Distributor";
  if (text.includes("install") || text.includes("installer") || text.includes("contractor")) return "Installer";
  return "KOL";
}

export default function ImportPage() {
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>(DEFAULT_MAPPING);
  const [fileName, setFileName] = useState("");
  const [step, setStep] = useState<"upload" | "map" | "preview" | "done">("upload");
  const [importedCount, setImportedCount] = useState(0);
  const [sourceName, setSourceName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setSourceName(file.name.replace(/\.(xlsx?|csv)$/i, ""));

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target?.result;
      const wb = XLSX.read(data, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json<ParsedRow>(ws, { defval: null });
      if (json.length > 0) {
        setHeaders(Object.keys(json[0]));
        setRows(json);
        setStep("map");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const autoMapColumns = () => {
    const h = headers.map((x) => x.toLowerCase());
    const find = (keywords: string[]) => headers[h.findIndex((x) => keywords.some((k) => x.includes(k)))] || "";
    const m: ColumnMapping = { ...DEFAULT_MAPPING };
    m.name = find(["姓名", "名称", "name", "机构", "全称", "简称"]);
    m.email = find(["邮箱", "email", "e-mail", "邮件"]);
    m.phone = find(["电话", "phone", "tel", "手机", "whatsapp"]);
    m.website = find(["官网", "website", "url", "网站", "链接"]);
    m.region = find(["地区", "region", "国家", "country", "地址"]);
    m.notes = find(["备注", "notes", "note", "说明"]);
    m.contactPerson = find(["联系人", "contact", "负责人"]);
    m.niche = find(["类型", "type", "niche", "定位", "职能", "核心"]);
    setMapping(m);
  };

  const handleImport = () => {
    const existing = loadContacts();
    const maxId = existing.reduce((max, c) => {
      const n = parseInt(c.id);
      return n > max ? n : max;
    }, 12);

    const newContacts: KOL[] = rows.map((row, i) => {
      const name = String(row[mapping.name] || `Contact ${i + 1}`);
      const niche = mapping.niche ? String(row[mapping.niche] || "") : "";
      const region = mapping.region ? String(row[mapping.region] || "") : "";
      const emailVal = mapping.email ? String(row[mapping.email] || "") : "";
      const phoneVal = mapping.phone ? String(row[mapping.phone] || "") : "";
      const websiteVal = mapping.website ? String(row[mapping.website] || "") : "";

      return {
        id: String(maxId + i + 1),
        name,
        type: detectType(name, niche),
        platform: "Website",
        followers: 0,
        niche: niche || null,
        region: region || null,
        engagement: null,
        status: "Not Contacted" as OutreachStatus,
        language: mapping.language || detectLanguage(region),
        tier: "Macro",
        priority: (mapping.priority as any) || "Medium",
        source: sourceName || "Manual Import",
        profileUrl: null,
        website: websiteVal || null,
        contactInfo: {
          emails: emailVal ? emailVal.split(/[,;，；]/).map((e) => e.trim()).filter(Boolean) : [],
          phones: phoneVal ? phoneVal.split(/[,;，；]/).map((p) => p.trim()).filter(Boolean) : [],
          instagrams: [],
          youtubes: [],
        },
        contactPerson: mapping.contactPerson ? String(row[mapping.contactPerson] || "") : null,
        notes: mapping.notes ? String(row[mapping.notes] || "") : undefined,
        analyses: [],
        emails: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });

    saveContacts([...existing, ...newContacts]);
    setImportedCount(newContacts.length);
    setStep("done");
  };

  const resetImport = () => {
    setHeaders([]);
    setRows([]);
    setMapping(DEFAULT_MAPPING);
    setFileName("");
    setSourceName("");
    setStep("upload");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Link href="/kols" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] flex items-center gap-1 transition-colors">
            <ArrowRight className="w-4 h-4 rotate-180" /> Back to Contacts
          </Link>
        </div>
        <h1 className="text-2xl font-bold">Import Contacts</h1>
        <p className="text-[var(--muted)] mt-1">Upload Excel or CSV files to batch import contacts from associations, trade shows, referrals, and more.</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-8">
        {["Upload", "Map Columns", "Import"].map((s, i) => {
          const stepNum = i + 1;
          const active = (step === "upload" && i === 0) || (step === "map" && i === 1) || ((step === "preview" || step === "done") && i === 2);
          const done = (step === "map" && i === 0) || (step === "preview" && i <= 1) || (step === "done" && i <= 2);
          return (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${done ? "bg-green-500 text-white" : active ? "bg-[var(--primary)] text-white" : "bg-gray-200 text-gray-500"}`}>
                {done ? <Check className="w-4 h-4" /> : stepNum}
              </div>
              <span className={`text-sm ${active || done ? "text-[var(--foreground)] font-medium" : "text-[var(--muted)]"}`}>{s}</span>
              {i < 2 && <div className={`w-12 h-0.5 ${done ? "bg-green-500" : "bg-gray-200"}`} />}
            </div>
          );
        })}
      </div>

      {/* Step 1: Upload */}
      {step === "upload" && (
        <div
          className="border-2 border-dashed border-[var(--card-border)] rounded-xl p-16 text-center hover:border-[var(--primary)]/50 transition-colors cursor-pointer"
          onClick={() => fileRef.current?.click()}
        >
          <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} className="hidden" />
          <Upload className="w-12 h-12 text-[var(--muted)] mx-auto mb-4 opacity-40" />
          <p className="text-lg font-medium text-[var(--foreground)] mb-2">Drop your file here or click to browse</p>
          <p className="text-sm text-[var(--muted)]">Supports .xlsx, .xls, .csv files</p>
        </div>
      )}

      {/* Step 2: Map Columns */}
      {step === "map" && (
        <div className="space-y-6">
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-5 h-5 text-[var(--primary)]" />
                <div>
                  <p className="font-medium">{fileName}</p>
                  <p className="text-sm text-[var(--muted)]">{rows.length} rows detected</p>
                </div>
              </div>
              <button onClick={autoMapColumns} className="text-sm text-[var(--primary)] hover:underline font-medium">Auto-detect columns</button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Source / Batch Name</label>
                <input type="text" value={sourceName} onChange={(e) => setSourceName(e.target.value)} className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]/50" placeholder="e.g., 巴西光伏电工协会名单" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Default Language</label>
                <select value={mapping.language} onChange={(e) => setMapping({ ...mapping, language: e.target.value })} className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]/50">
                  <option>English</option><option>Portuguese</option><option>Spanish</option><option>Chinese</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Default Priority</label>
                <select value={mapping.priority} onChange={(e) => setMapping({ ...mapping, priority: e.target.value })} className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]/50">
                  <option>Critical</option><option>High</option><option>Medium</option><option>Low</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-5">
            <h3 className="font-medium mb-4">Column Mapping</h3>
            <div className="space-y-3">
              {([
                ["name", "Name *", true],
                ["email", "Email"],
                ["phone", "Phone"],
                ["website", "Website"],
                ["region", "Region"],
                ["contactPerson", "Contact Person"],
                ["niche", "Type / Niche"],
                ["notes", "Notes"],
              ] as [keyof ColumnMapping, string, boolean?][]).map(([key, label, required]) => (
                <div key={key} className="flex items-center gap-4">
                  <span className="text-sm text-[var(--muted)] w-36 shrink-0">{label}{required && <span className="text-red-500 ml-1">*</span>}</span>
                  <select value={mapping[key] as string} onChange={(e) => setMapping({ ...mapping, [key]: e.target.value })} className="flex-1 px-3 py-2 bg-[var(--background)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]/50">
                    <option value="">-- Skip --</option>
                    {headers.map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={resetImport} className="px-4 py-2.5 border border-[var(--card-border)] rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
            <button onClick={() => setStep("preview")} disabled={!mapping.name} className="px-4 py-2.5 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50 flex items-center gap-2">
              Preview Import <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Preview */}
      {step === "preview" && (
        <div className="space-y-6">
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Preview ({rows.length} contacts)</h3>
              <button onClick={() => setStep("map")} className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Edit mapping</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--card-border)]">
                    <th className="text-left py-2 px-3 text-[var(--muted)] font-medium">Name</th>
                    <th className="text-left py-2 px-3 text-[var(--muted)] font-medium">Type</th>
                    <th className="text-left py-2 px-3 text-[var(--muted)] font-medium">Email</th>
                    <th className="text-left py-2 px-3 text-[var(--muted)] font-medium">Phone</th>
                    <th className="text-left py-2 px-3 text-[var(--muted)] font-medium">Region</th>
                    <th className="text-left py-2 px-3 text-[var(--muted)] font-medium">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 10).map((row, i) => {
                    const name = String(row[mapping.name] || `Contact ${i + 1}`);
                    const niche = mapping.niche ? String(row[mapping.niche] || "") : "";
                    const region = mapping.region ? String(row[mapping.region] || "") : "";
                    return (
                      <tr key={i} className="border-b border-[var(--card-border)]/50">
                        <td className="py-2 px-3 font-medium">{name}</td>
                        <td className="py-2 px-3"><span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">{detectType(name, niche)}</span></td>
                        <td className="py-2 px-3 text-[var(--muted)]">{mapping.email ? String(row[mapping.email] || "—") : "—"}</td>
                        <td className="py-2 px-3 text-[var(--muted)]">{mapping.phone ? String(row[mapping.phone] || "—") : "—"}</td>
                        <td className="py-2 px-3 text-[var(--muted)]">{region || "—"}</td>
                        <td className="py-2 px-3 text-[var(--muted)]">{sourceName || "Import"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {rows.length > 10 && <p className="text-sm text-[var(--muted)] mt-3">...and {rows.length - 10} more</p>}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep("map")} className="px-4 py-2.5 border border-[var(--card-border)] rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Back</button>
            <button onClick={handleImport} className="px-6 py-2.5 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors flex items-center gap-2">
              <Users className="w-4 h-4" /> Import {rows.length} Contacts
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Done */}
      {step === "done" && (
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold mb-2">Import Complete!</h2>
          <p className="text-[var(--muted)] mb-6">{importedCount} contacts imported from &quot;{sourceName}&quot;</p>
          <div className="flex gap-3 justify-center">
            <Link href="/kols" className="px-4 py-2.5 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors">View Contacts</Link>
            <button onClick={resetImport} className="px-4 py-2.5 border border-[var(--card-border)] rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Import Another File</button>
          </div>
        </div>
      )}
    </div>
  );
}
