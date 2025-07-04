"use client";

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "../Auth/AuthProvider"; // your JWT logic

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>{children}</AuthProvider>
    </SessionProvider>
  );
}
