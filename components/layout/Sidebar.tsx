import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { LayoutDashboard, Plus, History, Settings } from "lucide-react";

export default async function Sidebar() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const sideBarLinks = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "New Audit",
      href: "/audit/new",
      icon: Plus,
    },
    {
      name: "Audit History",
      href: "/dashboard",
      icon: History,
    },
    {
      name: "Settings",
      href: "/dashboard",
      icon: Settings,
    },
  ];
  return (
    <aside className="w-64 border-r border-white/5 flex flex-col fixed h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/5">
        <Link href="/dashboard">
          <span className="font-bold text-lg tracking-tight">
            audit<span className="text-indigo-400">ly</span>
          </span>
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {sideBarLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <link.icon size={16} />
            <span>{link.name}</span>
          </Link>
        ))}
      </nav>
      {/* Palestine solidarity */}
      <div className="px-6 py-3 text-xs text-zinc-600 text-center border-t border-white/5">
        🇵🇸 We stand with Palestine
      </div>
      {/* User section */}
      <div className="px-6 py-4 border-t border-white/5 flex items-center gap-3">
        <UserButton afterSignOutUrl="/" />
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium truncate">
            {user.firstName} {user.lastName}
          </span>
          <span className="text-xs text-zinc-500 truncate">
            {user.emailAddresses[0].emailAddress}
          </span>
        </div>
      </div>
    </aside>
  );
}
