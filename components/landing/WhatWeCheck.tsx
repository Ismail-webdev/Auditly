import { FileText, Search, Shield, Zap } from "lucide-react";

export default function WhatWeCheck() {
  const checks = [
    {
      icon: Search,
      title: "SEO",
      desc: "Meta tags, headings, canonical URLs, structured data, internal linking, and more.",
    },
    {
      icon: Zap,
      title: "Performance",
      desc: "Page speed, Core Web Vitals, image optimization, render-blocking resources.",
    },
    {
      icon: Shield,
      title: "Accessibility",
      desc: "WCAG compliance, keyboard navigation, color contrast, ARIA attributes.",
    },
    {
      icon: FileText,
      title: "Best Practices",
      desc: "HTTPS, security headers, mobile friendliness, broken links, redirects.",
    },
  ];
  return (
    <section className="border-t border-white/5 py-24 bg-[#0D0D14]">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-sm text-indigo-400 uppercase tracking-widest mb-4">
          What we check
        </p>
        <h2 className="text-3xl font-bold mb-16">
          Every dimension that affects your rankings
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {checks.map((check) => (
            <div
              key={check.title}
              className="bg-[#13131A] border border-white/5 rounded-2xl p-6 flex gap-5"
            >
              <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center shrink-0">
                <check.icon size={18} className="text-indigo-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">{check.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {check.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
