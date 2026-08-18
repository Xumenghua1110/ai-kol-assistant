import { ArrowLeft, Video, Camera, Globe, Mail, Sparkles, TrendingUp, Users, Target, AlertTriangle, Lightbulb } from "lucide-react";
import Link from "next/link";
import { demoKols, getKolById } from "@/lib/demoData";

const platformIcons: Record<string, typeof Video> = { YouTube: Video, Instagram: Camera, TikTok: Globe };

export function generateStaticParams() {
  return demoKols.map((kol) => ({ id: kol.id }));
}

export default function KOLDetail({ params }: { params: { id: string } }) {
  const kol = getKolById(params.id);

  if (!kol) {
    return (
      <div className="p-8 max-w-4xl">
        <Link href="/kols" className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to KOLs
        </Link>
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-12 text-center">
          <p className="text-[var(--muted)]">KOL not found.</p>
        </div>
      </div>
    );
  }

  const PlatformIcon = platformIcons[kol.platform] || Globe;
  const latestAnalysis = kol.analyses?.[0] || null;
  const recommendations = latestAnalysis?.recommendations ? JSON.parse(latestAnalysis.recommendations) : [];
  const riskFactors = latestAnalysis?.riskFactors ? JSON.parse(latestAnalysis.riskFactors) : [];

  return (
    <div className="p-8 max-w-4xl">
      <Link href="/kols" className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to KOLs
      </Link>

      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <PlatformIcon className="w-7 h-7 text-red-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{kol.name}</h1>
              <p className="text-[var(--muted)] mt-0.5">{kol.platform} · {kol.niche || "No niche"} · {kol.region || "No region"}</p>
              <p className="text-sm text-[var(--primary)] mt-1">
                {kol.followers > 0 ? `${(kol.followers / 1000).toFixed(0)}K followers` : "No follower data"}
              </p>
            </div>
          </div>
          <Link href="/email" className="flex items-center gap-2 bg-[var(--primary)] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors">
            <Mail className="w-4 h-4" /> Generate Email
          </Link>
        </div>
      </div>

      {latestAnalysis ? (
        <div className="space-y-4">
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-[var(--primary)]" />
              <h2 className="text-lg font-semibold">Brand Fit Score</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-[var(--primary)]">{latestAnalysis.brandFitScore?.toFixed(1) || "N/A"}</div>
              <div className="text-sm text-[var(--muted)]">/10</div>
              <div className="flex-1 ml-4">
                <div className="w-full h-2 bg-gray-100 rounded-full">
                  <div className="h-2 bg-[var(--primary)] rounded-full" style={{ width: `${(latestAnalysis.brandFitScore || 0) * 10}%` }} />
                </div>
              </div>
            </div>
          </div>

          {latestAnalysis.contentStyle && (
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <h2 className="text-lg font-semibold">Content Style</h2>
              </div>
              <p className="text-sm text-[var(--foreground)] leading-relaxed">{latestAnalysis.contentStyle}</p>
            </div>
          )}

          {latestAnalysis.audienceProfile && (
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-semibold">Audience Profile</h2>
              </div>
              <p className="text-sm text-[var(--foreground)] leading-relaxed">{latestAnalysis.audienceProfile}</p>
            </div>
          )}

          {latestAnalysis.engagementQuality && (
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <h2 className="text-lg font-semibold">Engagement Quality</h2>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium ml-2">{latestAnalysis.engagementQuality}</span>
              </div>
            </div>
          )}

          {recommendations.length > 0 && (
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-semibold">Recommendations</h2>
              </div>
              <ul className="space-y-2">
                {recommendations.map((rec: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-medium shrink-0 mt-0.5">{i + 1}</span>
                    <span className="text-[var(--foreground)]">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {riskFactors.length > 0 && (
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-semibold">Risk Factors</h2>
              </div>
              <ul className="space-y-2">
                {riskFactors.map((risk: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0 mt-1.5" />
                    <span className="text-[var(--foreground)]">{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-12 text-center">
          <Sparkles className="w-12 h-12 text-[var(--muted)] mx-auto mb-3 opacity-40" />
          <p className="text-[var(--muted)] mb-4">No AI analysis yet for this KOL.</p>
          <button className="px-4 py-2.5 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors flex items-center gap-2 mx-auto">
            <Sparkles className="w-4 h-4" /> Analyze with AI
          </button>
        </div>
      )}

      {kol.emails && kol.emails.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Email History</h2>
          <div className="space-y-3">
            {kol.emails.map((email) => (
              <div key={email.id} className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{email.subject || "No subject"}</h3>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{email.status}</span>
                </div>
                <p className="text-sm text-[var(--muted)]">{email.language} · {new Date(email.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
