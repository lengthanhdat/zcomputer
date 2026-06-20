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
  metadataBase: new URL(process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'),
  title: "ZCOMPUTER - PC Gaming, Laptop, Workstation",
  description: "ZCOMPUTER chuyên cung cấp PC Gaming, Laptop, Workstation uy tín giá rẻ.",
  openGraph: {
    title: "ZCOMPUTER - PC Gaming, Laptop, Workstation",
    description: "ZCOMPUTER chuyên cung cấp PC Gaming, Laptop, Workstation uy tín giá rẻ.",
    url: '/',
    siteName: 'ZCOMPUTER',
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "ZCOMPUTER - PC Gaming, Laptop, Workstation",
    description: "ZCOMPUTER chuyên cung cấp PC Gaming, Laptop, Workstation uy tín giá rẻ.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
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
