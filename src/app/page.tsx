import type { Metadata } from "next";
import { CalculatorApp } from "@/components/calculator-app";
import { buildHomeJsonLd } from "@/lib/home-seo";

export const metadata: Metadata = {
  title:
    "Energiamegtakarítás kalkulátor csavarkompresszorok esetén, sűrített levegő rendszereknél",
  description:
    "Számolja ki, mennyit csökkenthet az éves villamosenergia-költségen egy korszerű ipari csavarkompresszorral.",
  alternates: {
    canonical: "/"
  }
};

export default function Home() {
  const jsonLd = buildHomeJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <CalculatorApp />
    </>
  );
}
