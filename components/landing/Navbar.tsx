import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-white/5 px-6 py-4 bg-[#0A0A0F]">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <span className="font-bold text-lg tracking-tight">
          audit<span className="text-indigo-400">ly</span>
        </span>
        <div className="flex items-center gap-4">
          <Link
            href="/sign-in"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="text-sm bg-indigo-600 hover:bg-indigo-500 transition-colors px-4 py-2 rounded-lg font-medium"
          >
            Get started free
          </Link>
        </div>
      </div>
    </nav>
  );
}
