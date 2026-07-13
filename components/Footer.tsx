import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

// PLACEHOLDER CONTACT INFO — replace before launch. Same values are used on
// the Contact page and the Home page trust section; see README.md checklist.
const PHONE = "(216) 555-0142";
const PHONE_HREF = "tel:+12165550142";
const EMAIL = "info@klkplumbing.com";
const SERVICE_AREA = "Greater Cleveland, OH";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo.png"
                alt="KLK Plumbing LLC"
                width={1750}
                height={2000}
                className="h-24 w-auto object-contain"
              />
            </Link>
            <p className="max-w-xs text-sm text-accent">
              Reliable residential, commercial, and industrial plumbing
              services built on honest work and dependable service.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-heading text-sm uppercase tracking-widest text-foreground">
              Contact
            </h3>
            <a
              href={PHONE_HREF}
              className="flex items-center gap-2 text-sm text-accent transition-colors hover:text-foreground"
            >
              <Phone size={16} /> {PHONE}
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="flex items-center gap-2 text-sm text-accent transition-colors hover:text-foreground"
            >
              <Mail size={16} /> {EMAIL}
            </a>
            <span className="flex items-center gap-2 text-sm text-accent">
              <MapPin size={16} /> Serving {SERVICE_AREA}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-heading text-sm uppercase tracking-widest text-foreground">
              Quick Links
            </h3>
            <Link
              href="/services"
              className="text-sm text-accent transition-colors hover:text-foreground"
            >
              View Our Work
            </Link>
            <Link
              href="/contact"
              className="text-sm text-accent transition-colors hover:text-foreground"
            >
              Request a Quote
            </Link>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-xs text-accent-dark">
          &copy; {year} KLK Plumbing LLC. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
