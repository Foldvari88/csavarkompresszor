import type { Metadata } from "next";
import { CustomerOfferPage } from "@/components/customer-offer-page";
import { serviceOffer } from "@/lib/customer-offers";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Kompresszorszerviz ajánlat ipari gépparkra",
  description:
    "Kérjen személyre szabott kompresszorszerviz-ajánlatot olajos, olajmentes vagy csavarkompresszorához, országos szakmai háttérrel.",
  alternates: { canonical: "/kompresszor-szerviz-ajanlat" },
  openGraph: {
    title: "Kompresszorszerviz ajánlat ipari gépparkra",
    description: serviceOffer.lead,
    url: absoluteUrl("/kompresszor-szerviz-ajanlat")
  }
};

export default function ServiceOfferPage() {
  return <CustomerOfferPage config={serviceOffer} />;
}
