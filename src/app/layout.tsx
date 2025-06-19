import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import { AuthProvider } from "../Auth/AuthProvider";
import ClientWrapper from "./ClientWrapper";


export const metadata: Metadata = {
  title: "TravelXec",
  description: "Premium Travel Experience",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="w-full overflow-x-hidden scroll-smooth">
      <body className="w-full overflow-x-hidden m-0 p-0 min-h-screen bg-[#f0f0f0] text-gray-800 antialiased">
        <AuthProvider>
          <Navbar />
          {/* Wrap children in client-only component to avoid hydration errors */}
          <ClientWrapper>{children}</ClientWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
