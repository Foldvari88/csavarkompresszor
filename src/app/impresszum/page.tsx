import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Impresszum | iparikalkulator.hu"
};

export default function ImpressumPage() {
  return (
    <LegalPage
      title="Impresszum"
      lead="A weboldal üzemeltetőjének és tárhelyszolgáltatójának kötelező adatai."
      sections={[
        {
          title: "Weboldal üzemeltetője",
          items: [
            "Név: Földvári István egyéni vállalkozó",
            "Székhely: [kitöltendő]",
            "Levelezési cím: [kitöltendő, ha eltér a székhelytől]",
            "Nyilvántartási szám: [kitöltendő]",
            "Adószám: [kitöltendő]",
            "Email: [kitöltendő]",
            "Telefon: [kitöltendő, ha van nyilvános ügyfélszolgálati telefonszám]"
          ]
        },
        {
          title: "Tárhelyszolgáltató",
          items: [
            "Név: [kitöltendő]",
            "Székhely: [kitöltendő]",
            "Kapcsolat: [kitöltendő email vagy ügyfélszolgálati elérhetőség]"
          ]
        },
        {
          title: "Panaszkezelés",
          items: [
            "A weboldallal kapcsolatos panasz vagy megkeresés az üzemeltető email címén nyújtható be.",
            "Fogyasztói jogvita esetén az illetékes békéltető testülethez lehet fordulni, ha a felhasználó fogyasztónak minősül."
          ]
        }
      ]}
    />
  );
}
