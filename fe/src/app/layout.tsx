import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import PublicChrome from "@/components/PublicChrome";
import PopupAnnouncement from "@/components/PopupAnnouncement";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: "ZCOMPUTER - PC Gaming, Laptop, Workstation",
  description: "ZCOMPUTER chuyên cung cấp PC Gaming, Laptop, Workstation uy tín giá rẻ.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${inter.className} antialiased min-h-screen flex flex-col`}
      >
        <PublicChrome>
          <Header />
        </PublicChrome>
        <main className="flex-1 w-full">{children}</main>
        <PublicChrome>
          <Footer />
          <FloatingContact />
          <PopupAnnouncement />
        </PublicChrome>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
