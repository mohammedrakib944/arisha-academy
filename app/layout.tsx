import type { Metadata } from "next";
import { geistSans, geistMono, hindSiliguri } from "@/assets/font/font";
import PProviders from "@/components/progress-bar-provider";
import { Toaster } from "sonner";
import { Navbar } from "@/features/common/components/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arisha Academy",
  description:
    "Arisha Academy is a school for children aged 3 to 18 years old.",
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
        <PProviders>
          <Navbar />
          {children}
        </PProviders>
        <Toaster />
      </body>
    </html>
  );
}
