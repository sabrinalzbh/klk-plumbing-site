import { Home as HomeIcon, Building2, Factory } from "lucide-react";
import Hero from "@/components/Hero";
import ServiceCard from "@/components/ServiceCard";
import TrustSection from "@/components/TrustSection";
import Reveal from "@/components/Reveal";

const SERVICES = [
  {
    icon: HomeIcon,
    title: "Residential",
    description:
      "From leaky faucets and clogged drains to full bathroom remodels and water heater installs, we keep Cleveland-area homes running smoothly.",
    href: "/services#residential",
  },
  {
    icon: Building2,
    title: "Commercial",
    description:
      "Restaurants, retail, and office buildings rely on us for fast, code-compliant repairs and planned maintenance that keeps business open.",
    href: "/services#commercial",
  },
  {
    icon: Factory,
    title: "Industrial",
    description:
      "Heavy-duty piping, backflow prevention, and large-scale system installs handled by crews experienced with industrial-grade demands.",
    href: "/services#industrial",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="mx-auto max-w-7xl px-6 py-24">
        <Reveal>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-3 font-heading text-sm uppercase tracking-[0.3em] text-accent">
              What We Do
            </p>
            <h2 className="font-heading text-3xl uppercase tracking-wide text-foreground sm:text-4xl">
              Full-Service Plumbing, Every Scale
            </h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.title} {...service} delay={i * 100} />
          ))}
        </div>
      </section>

      <TrustSection />

      <section className="mx-auto max-w-7xl px-6 py-24 text-center">
        <Reveal>
          <h2 className="font-heading text-3xl uppercase tracking-wide text-foreground sm:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-accent">
            Tell us about your project and we&apos;ll get back to you with a
            straightforward quote — no surprises.
          </p>
          <a
            href="/contact"
            className="mt-8 inline-block rounded-sm bg-accent px-8 py-4 font-heading text-sm uppercase tracking-widest text-background transition-colors hover:bg-accent-light"
          >
            Request a Quote
          </a>
        </Reveal>
      </section>
    </>
  );
}
