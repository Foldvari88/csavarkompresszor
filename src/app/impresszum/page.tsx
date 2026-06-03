import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Impresszum | CsavarkompresszorKalkulator.hu"
};

export default function ImpressumPage() {
  return (
    <LegalPage
      title="Impresszum"
      lead="A weboldal üzemeltetőjének és tárhelyszolgáltatójának kötelezően megjelenítendő adatai."
      sections={[
        {
          title: "Weboldal üzemeltetője",
          items: [
            "Cégnév: [kitöltendő]",
            "Székhely: [kitöltendő]",
            "Levelezési cím: [kitöltendő]",
            "Adószám: [kitöltendő]",
            "Cégjegyzékszám / nyilvántartási szám: [kitöltendő]",
            "Képviselő: [kitöltendő]",
            "Email: [kitöltendő]",
            "Telefon: [kitöltendő]"
          ]
        },
        {
          title: "Tárhelyszolgáltató",
          items: [
            "Név: [kitöltendő]",
            "Székhely: [kitöltendő]",
            "Email vagy ügyfélszolgálati elérhetőség: [kitöltendő]"
          ]
        },
        {
          title: "Hatósági és szakmai adatok",
          items: [
            "Engedélyező vagy nyilvántartó hatóság, ha releváns: [kitöltendő]",
            "Kamara vagy szakmai szervezet, ha releváns: [kitöltendő]",
            "Fogyasztói panaszkezelési elérhetőség: [kitöltendő]"
          ]
        }
      ]}
    />
  );
}
