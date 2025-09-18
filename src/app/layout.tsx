import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import ClientWrapper from "./ClientWrapper";
import { Providers } from "./providers"; // ✅ session + auth providers
import { Toaster } from "react-hot-toast";
import EmailPopup from "./components/EmailPopup"; // 👈 import the popup
import Script from "next/script"; // 👈 import Script for GA

export const metadata: Metadata = {
  title: "TravelXec",
  description: "Premium Travel Experience",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Google Analytics (replace with env var if you want) */}
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
      </head>
      <body>
        <Providers>
          <Navbar />
          <ClientWrapper>{children}</ClientWrapper>

          {/* 👇 Add Popup here */}
          <EmailPopup />

          {/* Already global toaster for success/error */}
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        </Providers>
      </body>
    </html>
  );
}
