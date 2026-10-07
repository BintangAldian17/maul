import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://maulanarizky.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Maulana Rizky — Visual Designer & Photographer",
    template: "%s | Maulana Rizky",
  },
  description:
    "Portfolio Maulana Rizky, visual designer and photographer in Indonesia, working across graphic design, photography, image-making, and motion.",
  keywords: [
    "Maulana Rizky",
    "visual designer Indonesia",
    "photographer Indonesia",
    "graphic design",
    "photography portfolio",
  ],
  authors: [{ name: "Maulana Rizky" }],
  creator: "Maulana Rizky",
  publisher: "Maulana Rizky",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_ID",
    url: "/",
    siteName: "Maulana Rizky",
    title: "Maulana Rizky — Visual Designer & Photographer",
    description:
      "Visual design, photography, image-making, and motion by Maulana Rizky.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maulana Rizky — Visual Designer & Photographer",
    description:
      "Visual design, photography, image-making, and motion by Maulana Rizky.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#f2f0ea" };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  // No scroll-smooth here: scroll-behavior:smooth fights ScrollTrigger's snap.
  return (
    <html lang="en">
      <body className="bg-paper text-ink antialiased">{children}</body>
    </html>
  );
}
