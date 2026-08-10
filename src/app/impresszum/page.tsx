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
            "Név: Földvári István EV",
            "Székhely: 5008 Szolnok, Körte utca 51.",
            "Nyilvántartási szám: 57818731",
            "Nyilvántartást vezető szerv: Nemzeti Adó- és Vámhivatal",
            "Adószám: 59775793-1-36",
            "Email: info@iparikalkulator.hu"
          ]
        },
        {
          title: "Tárhelyszolgáltató",
          items: [
            "Név: Rackhost Zrt.",
            "Székhely: 6722 Szeged, Tisza Lajos körút 41.",
            "Kapcsolat: info@rackhost.hu",
            "Ügyfélszolgálat: +36 1 445 1200"
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
