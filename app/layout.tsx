import type { Metadata } from "next";
import { geistSans, geistMono, hindSiliguri } from "@/assets/font/font";
import { Toaster } from "sonner";
import { Navbar } from "@/features/common/components/navbar";
import "./globals.css";
import { Footer } from "@/features/common";

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
        <Navbar />
        {children}
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
