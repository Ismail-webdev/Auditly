export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Paste your URL",
      desc: "Enter any website URL. No installation, no browser extension, no setup required.",
    },
    {
      step: "02",
      title: "We crawl and analyse",
      desc: "Our engine checks SEO, performance, accessibility, and best practices automatically.",
    },
    {
      step: "03",
      title: "Get your AI report",
      desc: "Receive a plain-English report with every issue ranked by impact and exact fix instructions.",
    },
  ];
  return (
    <section className="border-t border-white/5 py-20">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-sm text-indigo-400 uppercase tracking-widest mb-4">
          How It Works
        </p>
        <h2 className="text-3xl font-bold mb-16">
          From URL to full report in seconds
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.step}
              className="relative bg-white/[0.02] backdrop-blur-sm border border-white/5 rounded-2xl p-8 overflow-hidden group hover:border-indigo-500/30 transition-colors duration-300"
            >
              {/* Card glow on hover */}
              <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/[0.03] transition-colors duration-300 rounded-2xl" />

              {/* Step number — big watermark */}
              <span className="text-8xl font-bold text-white/[0.03] font-mono absolute -top-2 -right-2 select-none">
                {step.step}
              </span>

              {/* Step badge */}
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 mb-6">
                  <span className="text-xs font-bold font-mono text-indigo-400">
                    {step.step}
                  </span>
                </div>

                <h3 className="text-lg font-semibold mb-3 text-white">
                  {step.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
