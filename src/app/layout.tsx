import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import ClientWrapper from "./ClientWrapper";
import { Providers } from "./providers"; // ✅ session + auth providers
import { Toaster } from "react-hot-toast";
import EmailPopup from "./components/Emailpopup"; // 👈 import the popup

export const metadata: Metadata = {
  title: "TravelXec",
  description: "Premium Travel Experience",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
