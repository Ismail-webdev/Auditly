import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function FooterCTA() {
  return (
    <section className="border-t border-white/5 py-24 text-center">
      <div className="max-w-2xl mx-auto px-6">
        <h2 className="text-4xl font-bold mb-4">Ready to fix your website?</h2>
        <p className="text-zinc-400 mb-8">
          Join hundreds of freelancers and agencies who use Auditly to deliver
          better websites.
        </p>
        <Link
          href="/sign-up"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 transition-colors px-8 py-4 rounded-lg font-medium text-lg"
        >
          Audit your first website free <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
