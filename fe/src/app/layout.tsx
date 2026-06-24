import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import PublicChrome from "@/components/PublicChrome";
import PopupAnnouncement from "@/components/PopupAnnouncement";
import { Toaster } from "react-hot-toast";
import { getThemePreset, buildThemeStyle } from "@/lib/theme";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

async function fetchThemeStyle(): Promise<CSSProperties> {
  try {
    const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000";
    const res = await fetch(`${API}/api/settings/theme_color`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return buildThemeStyle(getThemePreset("red"));
    const data = await res.json();
    return buildThemeStyle(getThemePreset(data?.value ?? "red"));
  } catch {
    return buildThemeStyle(getThemePreset("red"));
  }
}

export const viewport: Viewport = {
  themeColor: "#dc2626",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeStyle = await fetchThemeStyle();
  return (
    <html lang="vi" suppressHydrationWarning style={themeStyle}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "ZCOMPUTER",
              "alternateName": ["ZComputer", "zcomputer"],
              "url": "https://zcomputer.site/",
            }),
          }}
        />
      </head>
      <body
        className={`${inter.className} antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <PublicChrome>
          <Header />
        </PublicChrome>
        <main className="flex-1 w-full overflow-x-hidden">{children}</main>
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
