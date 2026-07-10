import { Check } from "lucide-react";
import Link from "next/link";

export default function Pricing() {
  const plans = [
    {
      plan: "Free",
      price: "€0",
      desc: "Perfect for trying it out",
      features: [
        "5 audits per month",
        "SEO + Performance checks",
        "Basic report",
      ],
      cta: "Get started",
      highlight: false,
    },
    {
      plan: "Pro",
      price: "€29",
      desc: "For freelancers and consultants",
      features: [
        "Unlimited audits",
        "All checks including WCAG",
        "Full AI report",
        "PDF export",
      ],
      cta: "Start free trial",
      highlight: true,
    },
    {
      plan: "Agency",
      price: "€79",
      desc: "For teams and agencies",
      features: [
        "Everything in Pro",
        "White-label PDF reports",
        "Priority support",
        "API access",
      ],
      cta: "Contact us",
      highlight: false,
    },
  ];
  return (
    <section className="border-t border-white/5 py-24">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-sm text-indigo-400 uppercase tracking-widest mb-4">
          Pricing
        </p>
        <h2 className="text-3xl font-bold mb-16"> Simple, honest pricing</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.plan}
              className={`rounded-2xl p-6 border ${plan.highlight ? "bg-indigo-600 border-indigo-500" : "bg-[#13131A] border-white/5 "}`}
            >
              <p className="text-sm font-medium mb-1 opacity-70">{plan.plan}</p>
              <p className="font-mono text-4xl font-bold mb-1">
                {plan.price}
                <span className="text-xl">/month</span>
              </p>
              <p
                className={`text-sm mb-6 ${plan.highlight ? "text-indigo-200" : "text-zinc-500"}`}
              >
                {plan.desc}
              </p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <Check
                      size={14}
                      className={
                        plan.highlight ? "text-white" : "text-indigo-400"
                      }
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className={`block capitalize text-center py-2.5 rounded-lg text-sm font-medium transition-colors ${plan.highlight ? "bg-white text-indigo-600 hover:bg-indigo-50" : "bg-indigo-600 hover:bg-indigo-500 text-white"}`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
