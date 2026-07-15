import type { Metadata } from "next";
import { Home as HomeIcon, Building2, Factory } from "lucide-react";
import Gallery from "@/components/Gallery";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Services & Gallery | KLK Plumbing LLC",
  description:
    "Browse photos of KLK Plumbing LLC's residential, commercial, and industrial plumbing work across Northeast Ohio.",
};

const CATEGORIES = [
  {
    id: "residential",
    icon: HomeIcon,
    title: "Residential",
    description:
      "Repairs, remodels, water heaters, and everyday fixes for homes across Northeast Ohio.",
  },
  {
    id: "commercial",
    icon: Building2,
    title: "Commercial",
    description:
      "Reliable service for restaurants, offices, retail spaces, and multi-unit properties.",
  },
  {
    id: "industrial",
    icon: Factory,
    title: "Industrial",
    description:
      "Heavy-duty installs, backflow prevention, and large-scale piping for industrial facilities.",
  },
] as const;

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-24">
      <Reveal>
        <p className="mb-3 font-heading text-sm uppercase tracking-[0.3em] text-accent">
          Our Work
        </p>
        <h1 className="max-w-2xl font-heading text-4xl uppercase tracking-wide text-foreground sm:text-5xl">
          Services &amp; Project Gallery
        </h1>
        <p className="mt-5 max-w-2xl text-accent">
          A look at recent residential, commercial, and industrial plumbing
          projects across Northeast Ohio. Jump to a category below.
        </p>
      </Reveal>

      {/* Quick "tab" nav — anchors match section ids so /#residential etc. work from the home page */}
      <Reveal delay={100}>
        <nav className="mt-10 flex flex-wrap gap-3 border-b border-border pb-8">
          {CATEGORIES.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="flex items-center gap-2 rounded-sm border border-border px-5 py-3 font-heading text-sm uppercase tracking-widest text-accent transition-colors hover:border-accent hover:text-foreground"
            >
              <cat.icon size={16} strokeWidth={1.75} />
              {cat.title}
            </a>
          ))}
        </nav>
      </Reveal>

      <div className="mt-16 flex flex-col gap-24">
        {CATEGORIES.map((cat) => (
          <section key={cat.id} id={cat.id} className="scroll-mt-28">
            <Reveal>
              <div className="mb-8 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-accent text-accent">
                  <cat.icon size={22} strokeWidth={1.75} />
                </div>
                <div>
                  <h2 className="font-heading text-2xl uppercase tracking-wide text-foreground">
                    {cat.title}
                  </h2>
                  <p className="text-sm text-accent">{cat.description}</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <Gallery category={cat.id} />
            </Reveal>
          </section>
        ))}
      </div>
    </div>
  );
}
