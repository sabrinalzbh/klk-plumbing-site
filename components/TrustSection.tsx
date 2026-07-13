import { ShieldCheck, Clock, MapPinned } from "lucide-react";
import Reveal from "./Reveal";

/**
 * PLACEHOLDER CONTENT — DEV NOTE
 * --------------------------------
 * The stats below (years in business, jobs completed, etc.) are realistic
 * placeholder copy, not verified figures. Replace with real numbers before
 * launch. See README.md "Placeholder Content Checklist" for the full list.
 */
const STATS = [
  {
    icon: Clock,
    value: "15+ Years",
    label: "Serving Greater Cleveland families and businesses",
  },
  {
    icon: MapPinned,
    value: "Greater Cleveland, OH",
    label: "Cuyahoga County and surrounding communities",
  },
  {
    icon: ShieldCheck,
    value: "Licensed & Insured",
    label: "Fully licensed, bonded, and insured for your protection",
  },
];

export default function TrustSection() {
  return (
    <section className="border-y border-border bg-surface py-20">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <h2 className="mb-14 text-center font-heading text-3xl uppercase tracking-wide text-foreground sm:text-4xl">
            Why Greater Cleveland Trusts KLK Plumbing
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {STATS.map((stat, i) => (
            <Reveal key={stat.value} delay={i * 100}>
              <div className="flex flex-col items-center text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-accent text-accent">
                  <stat.icon size={28} strokeWidth={1.75} />
                </div>
                <p className="font-heading text-xl uppercase tracking-wide text-foreground">
                  {stat.value}
                </p>
                <p className="mt-2 max-w-xs text-sm text-accent">
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
