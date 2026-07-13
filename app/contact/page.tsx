import type { Metadata } from "next";
import { Phone, Mail, MapPin } from "lucide-react";
import EstimateForm from "@/components/EstimateForm";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Contact Us | KLK Plumbing LLC",
  description:
    "Request a plumbing estimate from KLK Plumbing LLC. Call, email, or submit a project for a quote — serving Greater Cleveland, OH.",
};

// PLACEHOLDER CONTACT INFO — replace before launch (matches Footer.tsx and
// the Home page trust section). See README.md checklist.
const PHONE = "(216) 555-0142";
const PHONE_HREF = "tel:+12165550142";
const EMAIL = "info@klkplumbing.com";
const SERVICE_AREA = "Greater Cleveland, OH";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-24">
      <Reveal>
        <p className="mb-3 font-heading text-sm uppercase tracking-[0.3em] text-accent">
          Get In Touch
        </p>
        <h1 className="max-w-2xl font-heading text-4xl uppercase tracking-wide text-foreground sm:text-5xl">
          Request a Quote
        </h1>
        <p className="mt-5 max-w-2xl text-accent">
          Tell us about your project and your preferred start date, and
          we&apos;ll follow up promptly with an estimate. For urgent issues,
          call us directly.
        </p>
      </Reveal>

      <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-5">
        <Reveal delay={100} className="lg:col-span-3">
          <EstimateForm />
        </Reveal>

        <Reveal delay={150} className="lg:col-span-2">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-5">
              <h2 className="font-heading text-xl uppercase tracking-wide text-foreground">
                Contact Info
              </h2>
              <a
                href={PHONE_HREF}
                className="flex items-center gap-3 text-accent transition-colors hover:text-foreground"
              >
                <Phone size={18} /> {PHONE}
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-3 text-accent transition-colors hover:text-foreground"
              >
                <Mail size={18} /> {EMAIL}
              </a>
              <span className="flex items-center gap-3 text-accent">
                <MapPin size={18} /> Serving {SERVICE_AREA}
              </span>
            </div>

            <div className="aspect-video w-full overflow-hidden border border-border grayscale">
              <iframe
                title="KLK Plumbing service area map — Cleveland, OH"
                src="https://www.google.com/maps?q=Cleveland,OH&output=embed"
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0 }}
              />
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
