"use client";
import { useEffect, useState } from "react";
import { Send, Mail, Phone, Camera, ArrowLeft, ExternalLink, Copy, Check } from "lucide-react";
import Link from "next/link";

interface SentMessage {
  id: string;
  subject: string | null;
  body: string;
  language: string;
  cooperationType: string;
  channel: string;
  status: string;
  createdAt: string;
  kol: {
    id: string;
    name: string;
    platform: string;
    contactInfo: string | null;
  } | null;
}

function getChannelType(msg: SentMessage): string {
  return msg.channel || "email";
}

function getChannelIcon(type: string) {
  if (type === "whatsapp") return <Phone className="w-4 h-4" />;
  if (type === "instagram") return <Camera className="w-4 h-4" />;
  return <Mail className="w-4 h-4" />;
}

function getChannelColor(type: string) {
  if (type === "whatsapp") return "bg-green-100 text-green-700";
  if (type === "instagram") return "bg-pink-100 text-pink-700";
  return "bg-blue-100 text-blue-700";
}

function getChannelLabel(type: string) {
  if (type === "whatsapp") return "WhatsApp";
  if (type === "instagram") return "Instagram DM";
  return "Email";
}

export default function SentMessages() {
  const [messages, setMessages] = useState<SentMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "email" | "whatsapp" | "instagram">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/emails?status=Sent")
      .then((r) => r.json())
      .then((data) => {
        setMessages(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCopy = (id: string, body: string) => {
    navigator.clipboard.writeText(body);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = messages.filter((m) => {
    if (filter === "all") return true;
    return getChannelType(m) === filter;
  });

  const counts = {
    all: messages.length,
    email: messages.filter((m) => getChannelType(m) === "email").length,
    whatsapp: messages.filter((m) => getChannelType(m) === "whatsapp").length,
    instagram: messages.filter((m) => getChannelType(m) === "instagram").length,
  };

  if (loading) {
    return (
      <div className="p-8 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <p className="text-[var(--muted)]">Loading sent messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] mb-3 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Send className="w-6 h-6 text-[var(--primary)]" />
          Sent Messages
        </h1>
        <p className="text-[var(--muted)] mt-1">
          {messages.length} message{messages.length !== 1 ? "s" : ""} sent to KOLs
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-5 bg-gray-100 rounded-lg p-1 w-fit">
        {(["all", "email", "whatsapp", "instagram"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
              filter === tab
                ? "bg-white text-[var(--foreground)] shadow-sm"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {tab === "all" ? "All" : tab === "email" ? <><Mail className="w-3.5 h-3.5" /> Email</> : tab === "whatsapp" ? <><Phone className="w-3.5 h-3.5" /> WhatsApp</> : <><Camera className="w-3.5 h-3.5" /> Instagram</>}
            <span className="text-xs opacity-60">({counts[tab]})</span>
          </button>
        ))}
      </div>

      {/* Messages List */}
      {filtered.length === 0 ? (
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-12 text-center">
          <Send className="w-12 h-12 text-[var(--muted)] mx-auto mb-3 opacity-40" />
          <p className="text-[var(--muted)]">No sent messages yet.</p>
          <p className="text-sm text-[var(--muted)] mt-1">Messages you send via Email, WhatsApp or Instagram will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((msg) => {
            const channel = getChannelType(msg);
            const isExpanded = expandedId === msg.id;
            const isCopied = copiedId === msg.id;

            return (
              <div
                key={msg.id}
                className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl overflow-hidden hover:border-[var(--primary)]/30 transition-all"
              >
                {/* Summary Row */}
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : msg.id)}
                >
                  <div className="flex items-center gap-3">
                    {/* Channel Badge */}
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${getChannelColor(channel)}`}>
                      {getChannelIcon(channel)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm truncate">
                          {msg.kol?.name || "Unknown KOL"}
                        </h3>
                        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getChannelColor(channel)}`}>
                          {getChannelLabel(channel)}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--muted)] mt-0.5 truncate">
                        {msg.subject || msg.body.substring(0, 80)}
                      </p>
                    </div>

                    {/* Meta */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-[var(--muted)]">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-[var(--muted)]">
                        {msg.language}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-[var(--card-border)] p-4 bg-gray-50/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-[var(--muted)]">Message Content</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleCopy(msg.id, msg.body); }}
                        className="flex items-center gap-1 text-xs text-[var(--primary)] hover:underline"
                      >
                        {isCopied ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy</>}
                      </button>
                    </div>
                    <pre className="text-sm whitespace-pre-wrap font-sans text-[var(--foreground)] leading-relaxed max-h-64 overflow-y-auto">
                      {msg.body}
                    </pre>
                    {msg.kol && (
                      <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-4 text-xs text-[var(--muted)]">
                        <span>Platform: {msg.kol.platform}</span>
                        <span>Cooperation: {msg.cooperationType}</span>
                        <Link
                          href={`/kols/${msg.kol.id}`}
                          className="flex items-center gap-1 text-[var(--primary)] hover:underline ml-auto"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View KOL Profile <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
