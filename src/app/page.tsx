"use client";

import { useEffect, useState } from "react";
import {
  Users,
  MessageSquare,
  Send,
  TrendingUp,
  ArrowRight,
  Zap,
  Globe,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  kolCount: number;
  emailCount: number;
  sentEmails: number;
  repliedEmails: number;
  responseRate: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    kolCount: 0,
    emailCount: 0,
    sentEmails: 0,
    repliedEmails: 0,
    responseRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const statsData = [
    {
      label: "KOLs Tracked",
      value: loading ? "—" : stats.kolCount.toString(),
      icon: Users,
      change: stats.kolCount === 0 ? "Add your first KOL" : `${stats.kolCount} KOLs in database`,
      link: "/kols",
    },
    {
      label: "Messages Generated",
      value: loading ? "—" : stats.emailCount.toString(),
      icon: MessageSquare,
      change: stats.emailCount === 0 ? "Start generating" : `${stats.emailCount} messages created`,
      link: "/email",
    },
    {
      label: "Messages Sent",
      value: loading ? "—" : stats.sentEmails.toString(),
      icon: Send,
      change: stats.sentEmails === 0 ? "No messages sent yet" : `${stats.sentEmails} sent`,
      link: "/sent",
    },
    {
      label: "Response Rate",
      value: loading ? "—" : `${stats.responseRate}%`,
      icon: TrendingUp,
      change: stats.responseRate === 0 ? "Awaiting data" : `${stats.repliedEmails} replies`,
      link: null,
    },
  ];

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          Dashboard
        </h1>
        <p className="text-[var(--muted)] mt-1">
          Welcome to AI KOL Outreach Assistant — your AI-powered KOL management
          toolkit.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsData.map((stat) => {
          const Icon = stat.icon;
          const inner = (
            <>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[var(--muted)]" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {stat.value}
              </p>
              <p className="text-sm text-[var(--muted)] mt-1">{stat.label}</p>
              <p className="text-xs text-[var(--primary)] mt-2">
                {stat.change}
              </p>
            </>
          );

          const cardClass = "bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-5";

          if (stat.link) {
            return (
              <Link key={stat.label} href={stat.link} className={`${cardClass} block hover:border-[var(--primary)]/30 transition-all hover:shadow-sm cursor-pointer`}>
                {inner}
              </Link>
            );
          }

          return (
            <div key={stat.label} className={cardClass}>
              {inner}
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/kols"
            className="group bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-5 hover:border-[var(--primary)]/30 transition-all hover:shadow-sm"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-[var(--foreground)] flex items-center gap-2">
              Add a KOL
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-sm text-[var(--muted)] mt-1">
              Import a KOL by their social media profile URL
            </p>
          </Link>
          <Link
            href="/email"
            className="group bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-5 hover:border-[var(--primary)]/30 transition-all hover:shadow-sm"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-[var(--foreground)] flex items-center gap-2">
              Generate Outreach
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-sm text-[var(--muted)] mt-1">
              Create personalized messages for Email, WhatsApp or Instagram
            </p>
          </Link>
          <Link
            href="/campaigns"
            className="group bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-5 hover:border-[var(--primary)]/30 transition-all hover:shadow-sm"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-[var(--foreground)] flex items-center gap-2">
              View Campaigns
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-sm text-[var(--muted)] mt-1">
              Track your outreach campaigns and results
            </p>
          </Link>
        </div>
      </div>

      {/* Features Overview */}
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-[var(--primary)]" />
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold shrink-0">
              1
            </div>
            <div>
              <h3 className="font-medium text-sm">Discover & Import KOLs</h3>
              <p className="text-sm text-[var(--muted)] mt-1">
                Add KOLs from YouTube, Instagram, TikTok. AI analyzes their
                content style and audience.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold shrink-0">
              2
            </div>
            <div>
              <h3 className="font-medium text-sm">Generate Outreach with AI</h3>
              <p className="text-sm text-[var(--muted)] mt-1">
                Personalized messages for Email, WhatsApp or Instagram in any
                language, tailored to each KOL&apos;s profile.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold shrink-0">
              3
            </div>
            <div>
              <h3 className="font-medium text-sm">Track & Optimize</h3>
              <p className="text-sm text-[var(--muted)] mt-1">
                Monitor response rates, manage follow-ups, and refine your
                outreach strategy.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack Badge */}
      <div className="mt-8 flex items-center gap-3 text-xs text-[var(--muted)]">
        <Globe className="w-4 h-4" />
        <span>Built with Next.js + OpenAI + Prisma</span>
        <span className="opacity-40">|</span>
        <span>MVP v0.1</span>
      </div>
    </div>
  );
}
