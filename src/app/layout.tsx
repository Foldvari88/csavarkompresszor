import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CookieBanner } from "@/components/cookie-banner";
import { defaultDescription, siteName, siteUrl } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

const verification = {
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : {}),
  ...(process.env.BING_SITE_VERIFICATION
    ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } }
    : {})
} satisfies Metadata["verification"];

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: ["/icon.svg"]
  },
  title: {
    default:
      "Energiamegtakarítás kalkulátor csavarkompresszorok esetén, sűrített levegő rendszereknél",
    template: `%s | ${siteName}`
  },
  description: defaultDescription,
  keywords: [
    "csavarkompresszor kalkulátor",
    "kompresszor áramfogyasztás",
    "csavarkompresszor megtakarítás",
    "sűrített levegő energiaaudit",
    "ipari kompresszor csere",
    "RS csavarkompresszor",
    "VSD csavarkompresszor"
  ],
  alternates: {
    canonical: "/"
  },
  verification,
  openGraph: {
    type: "website",
    locale: "hu_HU",
    siteName,
    title:
      "Energiamegtakarítás kalkulátor csavarkompresszorok esetén, sűrített levegő rendszereknél",
    description: defaultDescription,
    images: [
      {
        url: "/images/industrial-compressor-og.jpg",
        width: 1200,
        height: 630,
        alt: "Ipari csavarkompresszor energiahatékonysági kalkulátor"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Energiamegtakarítás kalkulátor csavarkompresszorok esetén, sűrített levegő rendszereknél",
    description: defaultDescription,
    images: ["/images/industrial-compressor-og.jpg"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
