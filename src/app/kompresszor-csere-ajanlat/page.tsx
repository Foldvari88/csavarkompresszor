import type { Metadata } from "next";
import { CustomerOfferPage } from "@/components/customer-offer-page";
import { compressorReplacementOffer } from "@/lib/customer-offers";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Csavarkompresszor-csere és műszaki előszűrés",
  description:
    "Kérjen előzetes műszaki és megtérülési irányt régi ipari csavarkompresszora cseréjéhez.",
  alternates: { canonical: "/kompresszor-csere-ajanlat" },
  openGraph: {
    title: "Csavarkompresszor-csere és műszaki előszűrés",
    description: compressorReplacementOffer.lead,
    url: absoluteUrl("/kompresszor-csere-ajanlat"),
    images: ["/images/industrial-compressor-og.jpg"]
  }
};

export default function CompressorReplacementOfferPage() {
  return <CustomerOfferPage config={compressorReplacementOffer} />;
}
