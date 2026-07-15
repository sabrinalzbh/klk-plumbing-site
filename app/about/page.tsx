import type { Metadata } from "next";
import { Wrench, Users, MapPin } from "lucide-react";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About Us | KLK Plumbing LLC",
  description:
    "Learn about KLK Plumbing LLC — a locally owned plumbing company serving Northeast Ohio with honest, reliable residential, commercial, and industrial service.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <Reveal>
        <p className="mb-3 font-heading text-sm uppercase tracking-[0.3em] text-accent">
          About KLK Plumbing LLC
        </p>
        <h1 className="max-w-3xl font-heading text-4xl uppercase tracking-wide text-foreground sm:text-5xl">
          Built on Honest Work and Dependable Service
        </h1>
      </Reveal>

      {/*
        PLACEHOLDER COPY — the paragraphs below are realistic, plausible
        plumbing-company "about us" content written for this build, but they
        are NOT the real company history. Replace with KLK Plumbing's actual
        founding story, mission, and details before launch. See README.md
        "Placeholder Content Checklist".
      */}
      <Reveal delay={100}>
        <div className="mt-14 grid grid-cols-1 gap-14 md:grid-cols-3">
          <div className="md:col-span-2">
            <h2 className="mb-4 font-heading text-2xl uppercase tracking-wide text-foreground">
              Our Story
            </h2>
            <p className="mb-5 leading-relaxed text-accent">
              KLK Plumbing LLC was founded on a simple idea: plumbing work
              should be done right the first time, explained in plain
              language, and priced fairly. What started as a single truck
              answering calls across the East Side has grown into a
              full-service plumbing company trusted by homeowners, property
              managers, and facility operators throughout Northeast Ohio.
            </p>
            <p className="mb-5 leading-relaxed text-accent">
              We&apos;ve worked in century-old Cleveland Heights bungalows,
              downtown high-rises, and sprawling warehouse floors along the
              industrial corridor — and we bring the same attention to detail
              to every job, regardless of size. Our crews are trained to
              handle everything from a running toilet to a full commercial
              repipe, and we stand behind every job we complete.
            </p>
            <p className="leading-relaxed text-accent">
              Today, KLK Plumbing LLC continues to grow the way it started:
              one satisfied customer, one referral, and one job done right at
              a time.
            </p>
          </div>

          <div className="flex flex-col gap-8">
            <div className="border border-border bg-surface p-6">
              <Wrench className="mb-3 text-accent" size={28} strokeWidth={1.75} />
              <h3 className="mb-2 font-heading text-lg uppercase tracking-wide text-foreground">
                Our Mission
              </h3>
              <p className="text-sm leading-relaxed text-accent">
                Deliver dependable plumbing solutions with honest pricing,
                clear communication, and workmanship that lasts.
              </p>
            </div>
            <div className="border border-border bg-surface p-6">
              <MapPin className="mb-3 text-accent" size={28} strokeWidth={1.75} />
              <h3 className="mb-2 font-heading text-lg uppercase tracking-wide text-foreground">
                Service Area
              </h3>
              <p className="text-sm leading-relaxed text-accent">
                Proudly serving Northeast Ohio — including Cuyahoga
                County and surrounding communities.
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={150}>
        <div className="mt-20 border-t border-border pt-16">
          <div className="flex flex-col items-start gap-8 md:flex-row">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-accent text-accent">
              <Users size={34} strokeWidth={1.75} />
            </div>
            <div>
              <h2 className="mb-2 font-heading text-2xl uppercase tracking-wide text-foreground">
                Meet the Owner
              </h2>
              {/* PLACEHOLDER — replace with the real owner's name, background, and bio. */}
              <p className="mb-2 font-heading text-base tracking-wide text-accent">
                [Owner Name], Founder &amp; Master Plumber
              </p>
              <p className="leading-relaxed text-accent">
                With years of hands-on experience in residential and
                commercial plumbing, our founder started KLK Plumbing LLC to
                bring a straightforward, no-surprises approach to a trade
                that too often feels confusing to customers. Licensed,
                insured, and personally involved in training every member of
                the crew, they still make time to jump on tough jobs
                alongside the team.
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
