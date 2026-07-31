import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import MainLayout from "@/components/MainLayout";

export const metadata: Metadata = {
  title: "TruckLovers - Premium Dating for Drivers",
  description: "Premium dating experience for truck drivers, by piztolash",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ro" className="dark">
      <body className="bg-slate-950 text-slate-50 antialiased h-screen overflow-hidden">
        <AuthProvider>
          <MainLayout>
            {children}
          </MainLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
