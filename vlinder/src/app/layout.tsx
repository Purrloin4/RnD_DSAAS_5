import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { HotJar } from "@/src/components/Hotjar";
import ConditionalNavbar from "Components/Navbar/ConditionalNavbar"; // New Client Component
import { NextUIProvider } from "@nextui-org/react";

import { Toaster } from "sonner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Vlinder",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <HotJar />
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
        <NextUIProvider>
          <ConditionalNavbar /> {/* Render Client Component for Navbar logic */}
          {children}
        </NextUIProvider>
      </body>
      <Toaster />
    </html>
  );
}
