import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import MainLayout from "@/components/MainLayout";

export const metadata: Metadata = {
  title: "TruckLovers - Premium Dating for Drivers",
  description: "Premium dating experience for truck drivers, by piztolash",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ro" className="dark">
      <body className="bg-black text-slate-50 antialiased h-screen overflow-hidden flex justify-center">
        <div className="w-full max-w-md bg-black relative h-full flex flex-col shadow-2xl">
          <MainLayout>
            {children}
          </MainLayout>
        </div>
      </body>
    </html>
  );
}
