import type { Metadata } from "next";
import { Oswald, Work_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KLK Plumbing LLC | Northeast Ohio Plumbing Services",
  description:
    "KLK Plumbing LLC provides reliable residential, commercial, and industrial plumbing services across Northeast Ohio. Licensed, insured, and ready to help.",
  keywords: [
    "Cleveland plumber",
    "plumbing services Cleveland",
    "commercial plumbing Ohio",
    "residential plumber Cleveland",
    "KLK Plumbing",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${oswald.variable} ${workSans.variable}`}>
      <body className="flex min-h-screen flex-col bg-background font-body text-foreground antialiased">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
