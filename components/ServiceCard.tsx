import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import Reveal from "./Reveal";

type ServiceCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  delay?: number;
};

export default function ServiceCard({
  icon: Icon,
  title,
  description,
  href,
  delay = 0,
}: ServiceCardProps) {
  return (
    <Reveal delay={delay} className="h-full">
      <div className="group flex h-full flex-col border border-border bg-surface p-8 transition-colors duration-300 hover:border-accent">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-accent text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-background">
          <Icon size={26} strokeWidth={1.75} />
        </div>
        <h3 className="mb-3 font-heading text-2xl uppercase tracking-wide text-foreground">
          {title}
        </h3>
        <p className="mb-6 flex-1 text-sm leading-relaxed text-accent">
          {description}
        </p>
        <Link
          href={href}
          className="inline-flex w-fit items-center gap-2 font-heading text-sm uppercase tracking-widest text-foreground transition-colors hover:text-accent"
        >
          View Photos
          <span aria-hidden className="transition-transform group-hover:translate-x-1">
            &rarr;
          </span>
        </Link>
      </div>
    </Reveal>
  );
}
