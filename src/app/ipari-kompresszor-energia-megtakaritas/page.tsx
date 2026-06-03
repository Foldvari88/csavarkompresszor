import type { Metadata } from "next";
import { SeoLandingPage } from "@/components/seo-landing-page";
import { getSeoPage, seoPageUrl } from "@/lib/seo-pages";

const page = getSeoPage("ipari-kompresszor-energia-megtakaritas")!;

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: {
    canonical: `/${page.slug}`
  },
  openGraph: {
    title: page.title,
    description: page.description,
    url: seoPageUrl(page),
    images: ["/images/industrial-compressor-hero.png"]
  }
};

export default function IndustrialCompressorSavingsPage() {
  return <SeoLandingPage page={page} />;
}

