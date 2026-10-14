import type { Metadata } from "next";
import { CustomerOfferPage } from "@/components/customer-offer-page";
import { nitrogenOffer } from "@/lib/customer-offers";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Nitrogéngenerátor felülvizsgálat és ajánlat",
  description:
    "Kérjen műszaki előszűrést meglévő nitrogéngenerátorához vagy helyi PSA és membrános nitrogén-előállításhoz.",
  alternates: { canonical: "/nitrogen-generator-felulvizsgalat" },
  openGraph: {
    title: "Nitrogéngenerátor felülvizsgálat és ajánlat",
    description: nitrogenOffer.lead,
    url: absoluteUrl("/nitrogen-generator-felulvizsgalat")
  }
};

export default function NitrogenOfferPage() {
  return <CustomerOfferPage config={nitrogenOffer} />;
}
