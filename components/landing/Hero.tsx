import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  const scores = [
    { label: "SEO", score: 94, color: "text-green-400" },
    { label: "Performance", score: 78, color: "text-yellow-400" },
    { label: "Accessibility", score: 91, color: "text-green-400" },
    { label: "Best Practices", score: 85, color: "text-green-400" },
  ];
  const issues = [
    { issue: "Missing meta descriptions on 4 pages", severity: "high" },
    { issue: "Images missing alt attributes", severity: "medium" },
    { issue: "No structured data found", severity: "low" },
  ];
  return (
    <section className="max-w-6xl mx-auto px-6 pt-24 pb-20">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-sm text-indigo-300 mb-8">
            <Zap size={14} />
            AI-powered website audits
          </div>
          <h1 className="text-5xl font-bold leading-tight tracking-tight mb-6">
            Know exactly what's
            <span className="text-indigo-400"> breaking </span>
            your website
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed mb-10">
            Paste any URL and get a detailed SEO, performance, and accessibility
            audit — with an AI-written report that tells you exactly how to fix
            every issue.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 transition-colors px-6 py-3 rounded-lg font-medium"
            >
              Audit your website free
              <ArrowRight size={16} />
            </Link>
            <span className="text-sm text-zinc-500">
              No credit card required
            </span>
          </div>
        </div>
        <div className="bg-[#13131A] border border-white/5 rounded-2xl p-6 space-y-5">
          {/* URL bar */}
          <div className="flex items-center gap-3 bg-[#0A0A0F] rounded-lg px-4 py-3">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-sm text-zinc-400 font-mono">
              https://example-agency.com
            </span>
          </div>
          {/* Scores */}
          <div className="grid grid-cols-2 gap-3">
            {scores.map((score) => (
              <div
                key={score.label}
                className="bg-[#0A0A0F] rounded-xl p-4 flex flex-col gap-1"
              >
                <span className="text-sm text-zinc-500 uppercase tracking-widest">
                  {score.label}
                </span>
                <span className={`text-3xl font-bold font-mono ${score.color}`}>
                  {score.score}
                </span>
              </div>
            ))}
          </div>
          {/* Issues */}
          <div className="space-y-2">
            <p className="text-xs text-zinc-500 uppercase tracking-widest">
              Top Issues
            </p>
            {issues.map((issue) => (
              <div
                key={issue.issue}
                className="flex items-center gap-3 bg-[#0A0A0F] rounded-lg px-4 py-3"
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    issue.severity === "high"
                      ? "bg-red-400"
                      : issue.severity === "medium"
                        ? "bg-yellow-400"
                        : "bg-blue-400"
                  }`}
                />
                <span className="text-sm text-zinc-300">{issue.issue}</span>
              </div>
            ))}
          </div>

          {/* AI report preview */}
          <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4">
            <p className="text-sm text-indigo-300 uppercase tracking-widest mb-2">
              AI Report
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              "Your site has strong fundamentals but is losing rankings due to
              missing meta descriptions. Adding them to your top 4 pages could
              improve click-through rates by up to 30%..."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
