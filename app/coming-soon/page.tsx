import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Coming Soon | KLK Plumbing LLC",
  description:
    "KLK Plumbing LLC's website is under construction. Check back soon.",
  robots: { index: false, follow: false },
};

export default function ComingSoonPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <Image
        src="/images/logo.png"
        alt="KLK Plumbing LLC"
        width={1750}
        height={2000}
        className="h-20 w-auto object-contain sm:h-24"
        priority
      />

      <p className="mt-10 font-heading text-sm uppercase tracking-[0.3em] text-accent">
        Northeast Ohio
      </p>
      <h1 className="mt-4 max-w-2xl font-heading text-4xl uppercase leading-tight tracking-tight text-foreground sm:text-5xl">
        Our Website Is On The Way
      </h1>
      <p className="mt-6 max-w-md text-accent">
        We&apos;re putting the finishing touches on our new site. Check back
        soon.
      </p>

      <p className="mt-16 text-xs text-accent-dark">
        &copy; {new Date().getFullYear()} KLK Plumbing LLC. All rights
        reserved.
      </p>
    </div>
  );
}
