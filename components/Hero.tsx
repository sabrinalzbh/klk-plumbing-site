import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative flex h-[90vh] min-h-[560px] w-full items-center overflow-hidden">
      <Image
        src="/images/hero-skyline.jpg"
        alt="Cleveland riverfront skyline"
        fill
        priority
        className="object-cover object-top"
      />
      {/* Darkening overlay for text legibility, kept within the black/silver palette */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/40" />
      <div className="absolute inset-0 bg-background/30" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
        <div className="max-w-2xl animate-fade-up">
          <p className="mb-4 font-heading text-sm uppercase tracking-[0.3em] text-accent">
            Northeast Ohio
          </p>
          <h1 className="font-heading text-5xl font-semibold uppercase leading-tight tracking-tight text-foreground sm:text-6xl md:text-7xl">
            Trustworthy Plumbing for Northeast Ohio
          </h1>
          <p className="mt-6 max-w-xl text-lg text-accent">
            We plan and execute every project with precision — from
            blueprint to walkthrough.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="rounded-sm bg-accent px-8 py-4 font-heading text-sm uppercase tracking-widest text-background transition-colors hover:bg-accent-light"
            >
              Request a Quote
            </Link>
            <Link
              href="/services"
              className="rounded-sm border border-accent px-8 py-4 font-heading text-sm uppercase tracking-widest text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
