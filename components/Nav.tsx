"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent background scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // The coming-soon splash page is a standalone takeover with no nav/footer
  // chrome — see middleware.ts for the maintenance-mode rewrite that sends
  // visitors here.
  if (pathname === "/coming-soon") {
    return null;
  }

  return (
    <header className="sticky top-0 z-50">
      {/* backdrop-blur lives on this inner bar (not <header>) so it doesn't
          create a containing block for the fixed-position drawer below. */}
      <div className="border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="KLK Plumbing LLC"
              width={1750}
              height={2000}
              className="h-[76px] w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-10 md:flex">
            {LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative py-1 font-heading text-sm uppercase tracking-widest transition-colors hover:text-accent ${
                    isActive ? "text-accent" : "text-foreground"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 h-[2px] w-full bg-accent" />
                  )}
                </Link>
              );
            })}
            <Link
              href="/contact"
              className="rounded-sm border border-accent px-5 py-2 font-heading text-sm uppercase tracking-widest text-foreground transition-colors hover:bg-accent hover:text-background"
            >
              Get a Quote
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center text-foreground md:hidden"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 top-20 z-40 bg-background transition-transform duration-300 ease-out md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col gap-1 px-6 py-8">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`border-b border-border py-4 font-heading text-xl uppercase tracking-widest transition-colors hover:text-accent ${
                pathname === link.href ? "text-accent" : "text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="mt-6 rounded-sm border border-accent px-5 py-3 text-center font-heading text-sm uppercase tracking-widest text-foreground transition-colors hover:bg-accent hover:text-background"
          >
            Get a Quote
          </Link>
        </nav>
      </div>
    </header>
  );
}
