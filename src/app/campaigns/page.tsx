"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  TrendingUp,
  Plus,
  X,
} from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  status: string;
  notes: string | null;
  createdAt: string;
}

const statusConfig: Record<
  string,
  { color: string; icon: typeof CheckCircle2 }
> = {
  Active: { color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  Planning: { color: "bg-blue-100 text-blue-700", icon: Clock },
  Completed: { color: "bg-gray-100 text-gray-600", icon: CheckCircle2 },
};

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "completed">(
    "all"
  );
  const [showNewModal, setShowNewModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    status: "Planning",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = () => {
    fetch("/api/campaigns")
      .then((res) => res.json())
      .then((data) => {
        setCampaigns(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleCreateCampaign = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCampaign),
      });
      if (res.ok) {
        fetchCampaigns();
        setShowNewModal(false);
        setNewCampaign({ name: "", status: "Planning", notes: "" });
      }
    } catch (error) {
      console.error("Failed to create campaign:", error);
    }
    setSubmitting(false);
  };

  const filteredCampaigns =
    activeTab === "all"
      ? campaigns
      : campaigns.filter((c) =>
          activeTab === "active"
            ? c.status === "Active" || c.status === "Planning"
            : c.status === "Completed"
        );

  if (loading) {
    return (
      <div className="p-8 max-w-6xl">
        <div className="flex items-center justify-center h-64">
          <p className="text-[var(--muted)]">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Campaigns</h1>
          <p className="text-[var(--muted)] mt-1">
            Track outreach campaigns and measure results
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 bg-[var(--primary)] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Campaign
        </button>
      </div>

      {/* Empty State */}
      {campaigns.length === 0 ? (
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-12 text-center">
          <BarChart3 className="w-12 h-12 text-[var(--muted)] mx-auto mb-3 opacity-40" />
          <p className="text-[var(--muted)] mb-4">
            No campaigns yet. Create your first campaign to start tracking.
          </p>
          <button
            onClick={() => setShowNewModal(true)}
            className="px-4 py-2.5 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors"
          >
            Create Campaign
          </button>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1 w-fit">
            {(["all", "active", "completed"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-white text-[var(--foreground)] shadow-sm"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Campaign List */}
          <div className="space-y-3">
            {filteredCampaigns.map((campaign) => {
              const config = statusConfig[campaign.status];
              const StatusIcon = config.icon;

              return (
                <div
                  key={campaign.id}
                  className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-5 hover:border-[var(--primary)]/30 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-[var(--muted)]" />
                      </div>
                      <div>
                        <h3 className="font-medium">{campaign.name}</h3>
                        <p className="text-sm text-[var(--muted)] mt-0.5">
                          Created{" "}
                          {new Date(campaign.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {campaign.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* New Campaign Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="bg-[var(--card-bg)] rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[var(--primary)]" />
                <h2 className="text-lg font-semibold">New Campaign</h2>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Campaign Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Brazil Solar Launch"
                  value={newCampaign.name}
                  onChange={(e) =>
                    setNewCampaign({ ...newCampaign, name: e.target.value })
                  }
                  className="w-full px-3 py-2.5 bg-[var(--background)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Status
                </label>
                <select
                  value={newCampaign.status}
                  onChange={(e) =>
                    setNewCampaign({ ...newCampaign, status: e.target.value })
                  }
                  className="w-full px-3 py-2.5 bg-[var(--background)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]/50"
                >
                  <option>Planning</option>
                  <option>Active</option>
                  <option>Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Notes
                </label>
                <textarea
                  placeholder="Campaign goals, target KOLs, timeline..."
                  rows={3}
                  value={newCampaign.notes}
                  onChange={(e) =>
                    setNewCampaign({ ...newCampaign, notes: e.target.value })
                  }
                  className="w-full px-3 py-2.5 bg-[var(--background)] border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]/50 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowNewModal(false)}
                  className="flex-1 px-4 py-2.5 border border-[var(--card-border)] rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCampaign}
                  disabled={submitting || !newCampaign.name}
                  className="flex-1 px-4 py-2.5 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50"
                >
                  {submitting ? "Creating..." : "Create Campaign"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
