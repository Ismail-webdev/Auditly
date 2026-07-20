import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { Plus, Globe, CheckCircle, Clock } from "lucide-react";

export default async function DashboardPage() {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  // Upsert user in database
  const user = await db.user.upsert({
    where: { clerkId: clerkUser.id },
    update: {},
    create: {
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0].emailAddress,
    },
  });

  // Fetch recent audits
  const audits = await db.audit.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const completedAudits = audits.filter((a) => a.status === "COMPLETE");
  const pendingAudits = audits.filter((a) =>
    ["PENDING", "CRAWLING", "ANALYZING"].includes(a.status),
  );

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {clerkUser.firstName} 👋
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Here's an overview of your audits
          </p>
        </div>
        <Link
          href="/audit/new"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 transition-colors px-4 py-2.5 rounded-lg text-sm font-medium"
        >
          <Plus size={16} />
          New Audit
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          {
            label: "Total Audits",
            value: audits.length,
            icon: Globe,
          },
          {
            label: "Completed",
            value: completedAudits.length,
            icon: CheckCircle,
          },
          {
            label: "In Progress",
            value: pendingAudits.length,
            icon: Clock,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[#13131A] border border-white/5 rounded-2xl p-5 flex items-center gap-4"
          >
            <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
              <stat.icon size={18} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono">{stat.value}</p>
              <p className="text-xs text-zinc-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Audits */}
      <div className="bg-[#13131A] border border-white/5 rounded-2xl">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="font-semibold">Recent Audits</h2>
        </div>

        {audits.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Globe size={32} className="text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-400 text-sm mb-4">
              No audits yet. Run your first one.
            </p>
            <Link
              href="/audit/new"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 transition-colors px-4 py-2 rounded-lg text-sm font-medium"
            >
              <Plus size={14} />
              Start your first audit
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {audits.map((audit) => (
              <div
                key={audit.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Globe size={16} className="text-zinc-500 shrink-0" />
                  <span className="text-sm text-zinc-300 truncate">
                    {audit.url}
                  </span>
                </div>
                <div className="flex items-center gap-4 shrink-0 ml-4">
                  {audit.score !== null && (
                    <span className="text-sm font-mono font-bold text-indigo-400">
                      {audit.score}
                    </span>
                  )}
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      audit.status === "COMPLETE"
                        ? "bg-green-500/10 text-green-400"
                        : audit.status === "FAILED"
                          ? "bg-red-500/10 text-red-400"
                          : audit.status === "BLOCKED"
                            ? "bg-orange-500/10 text-orange-400"
                            : "bg-indigo-500/10 text-indigo-400"
                    }`}
                  >
                    {audit.status}
                  </span>
                  {audit.status === "COMPLETE" && (
                    <Link
                      href={`/audit/${audit.id}`}
                      className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      View →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
