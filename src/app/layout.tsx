import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  metadataBase: new URL("https://csavarkompresszorkalkulator.hu"),
  title: "Ipari csavarkompresszor energiahatékonysági kalkulátor",
  description:
    "Számolja ki, mennyi villamosenergia-költséget takaríthat meg egy korszerű csavarkompresszorral.",
  openGraph: {
    title: "Ipari csavarkompresszor kalkulátor",
    description:
      "Energiahatékonysági előkalkuláció ipari csavarkompresszor cseréhez.",
    images: ["/images/industrial-compressor-hero.png"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
