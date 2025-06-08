import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import { AuthProvider } from "@/Auth/AuthProvider";

export const metadata: Metadata = {
  title: "TravelXec",
  description: "Premium Travel Experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f0f0f0] text-gray-800 antialiased">
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
