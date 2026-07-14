import type { Metadata } from "next";
import Image from "next/image";
import { Phone, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Coming Soon | KLK Plumbing LLC",
  description:
    "KLK Plumbing LLC's website is under construction. Check back soon.",
  robots: { index: false, follow: false },
};

// PLACEHOLDER CONTACT INFO — matches components/Footer.tsx and
// app/contact/page.tsx. See README.md checklist.
const PHONE = "(216) 555-0142";
const PHONE_HREF = "tel:+12165550142";
const EMAIL = "info@klkplumbing.com";

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
        Greater Cleveland, Ohio
      </p>
      <h1 className="mt-4 max-w-2xl font-heading text-4xl uppercase leading-tight tracking-tight text-foreground sm:text-5xl">
        Our Website Is On The Way
      </h1>
      <p className="mt-6 max-w-md text-accent">
        We&apos;re putting the finishing touches on our new site. In the
        meantime, reach out directly — we&apos;re still taking calls and
        estimate requests.
      </p>

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <a
          href={PHONE_HREF}
          className="flex items-center gap-2 rounded-sm bg-accent px-8 py-4 font-heading text-sm uppercase tracking-widest text-background transition-colors hover:bg-accent-light"
        >
          <Phone size={18} /> {PHONE}
        </a>
        <a
          href={`mailto:${EMAIL}`}
          className="flex items-center gap-2 rounded-sm border border-accent px-8 py-4 font-heading text-sm uppercase tracking-widest text-foreground transition-colors hover:bg-foreground hover:text-background"
        >
          <Mail size={18} /> {EMAIL}
        </a>
      </div>

      <p className="mt-16 text-xs text-accent-dark">
        &copy; {new Date().getFullYear()} KLK Plumbing LLC. All rights
        reserved.
      </p>
    </div>
  );
}
