import type { Metadata } from "next";
import { geistSans, geistMono, hindSiliguri } from "@/assets/font/font";
import { Toaster } from "sonner";
import { Navbar } from "@/features/common/components/navbar";
import "./globals.css";
import { Footer } from "@/features/common";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "আরিশা একাডেমি",
  description: "আরিশা একাডেমি is a school for children aged 3 to 18 years old.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${hindSiliguri.variable} antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
        <Toaster />
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-RHG9PG5N24"} />
    </html>
  );
}
