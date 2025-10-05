import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import ClientWrapper from "./ClientWrapper";
import { Providers } from "./providers"; // ✅ session + auth providers
import { Toaster } from "react-hot-toast";
import EmailPopup from "./components/EmailPopup"; // 👈 Popup component
import Script from "next/script"; // 👈 For GA + structured data
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "TravelXec | Premium Travel Experiences",
  description:
    "TravelXec crafts curated, cinematic journeys that go beyond destinations. Experience luxury, authenticity, and personalized adventures worldwide.",
  keywords: [
    "TravelXec",
    "luxury travel",
    "custom itineraries",
    "premium travel agency",
    "curated experiences",
    "bespoke travel",
    "exclusive journeys",
  ],
  authors: [{ name: "TravelXec" }],
  openGraph: {
    title: "TravelXec | Premium Travel Experiences",
    description:
      "Discover TravelXec — where every journey is tailored to inspire transformation. Curated, cinematic travel experiences built around your passions.",
    url: "https://www.travelxec.com",
    siteName: "TravelXec",
    images: [
      {
        url: "https://www.travelxec.com/og-image.jpg", // ✅ Replace with your banner or hero image
        width: 1200,
        height: 630,
        alt: "TravelXec – Premium Travel Experiences",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TravelXec | Premium Travel Experiences",
    description:
      "Crafting bespoke, cinematic travel journeys designed around your passions.",
    images: ["https://www.travelxec.com/og-image.jpg"],
    creator: "@travelxec", // ✅ Update to your handle
  },
  alternates: {
    canonical: "https://www.travelxec.com",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-S8DL2GV5K6"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-S8DL2GV5K6');
          `}
        </Script>

        {/* ✅ Structured Data for SEO */}
        <Script id="structured-data" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TravelAgency",
            name: "TravelXec",
            url: "https://www.travelxec.com",
            logo: "https://www.travelxec.com/logo.png",
            description:
              "TravelXec crafts curated, cinematic journeys beyond destinations — luxury, authenticity, and personalization.",
            sameAs: [
              "https://www.instagram.com/travelxec",
              "https://www.linkedin.com/company/travelxec",
            ],
          })}
        </Script>
      </head>

      <body>
        <Providers>
          <Analytics />
          <SpeedInsights />

          {/* ✅ Global navigation */}
          <Navbar />

          {/* ✅ Page content */}
          <ClientWrapper>{children}</ClientWrapper>

          {/* ✅ Newsletter / popup */}
          <EmailPopup />

          {/* ✅ Toast notifications */}
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        </Providers>
      </body>
    </html>
  );
}
