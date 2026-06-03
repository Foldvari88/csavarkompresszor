import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Adatkezelési tájékoztató | CsavarkompresszorKalkulator.hu"
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Adatkezelési tájékoztató"
      lead="A kalkulátor használata során megadott adatok kezelésének céljai, jogalapjai és a felhasználói jogok összefoglalása."
      sections={[
        {
          title: "Adatkezelő",
          items: [
            "Cégnév: [kitöltendő]",
            "Székhely: [kitöltendő]",
            "Adószám / cégjegyzékszám: [kitöltendő]",
            "Kapcsolattartási email: [kitöltendő]"
          ]
        },
        {
          title: "Kezelt adatok",
          items: [
            "Cégnév, email cím, opcionálisan kapcsolattartó neve és telefonszáma.",
            "A kalkulációhoz megadott műszaki adatok: jelenlegi gép kategóriája, teljesítménye, kora, üzemóra és energiaár.",
            "Technikai adatok: beküldés időpontja, böngésző által küldött alapvető naplóadatok."
          ]
        },
        {
          title: "Cél és jogalap",
          items: [
            "A részletes kalkuláció elkészítése és emailben történő kézbesítése.",
            "A szolgáltatás működtetése, biztonsága és a visszaélések megelőzése.",
            "Jogalap: a felhasználó hozzájárulása és a kért szolgáltatás teljesítéséhez szükséges adatkezelés."
          ]
        },
        {
          title: "Megőrzés és jogok",
          items: [
            "A beküldött adatok megőrzési ideje: [kitöltendő, például 12 hónap].",
            "A felhasználó kérheti a hozzáférést, helyesbítést, törlést, korlátozást és tiltakozhat az adatkezelés ellen.",
            "Panasz benyújtható a Nemzeti Adatvédelmi és Információszabadság Hatóságnál."
          ]
        }
      ]}
    />
  );
}
