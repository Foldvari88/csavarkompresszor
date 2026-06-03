import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Süti tájékoztató | CsavarkompresszorKalkulator.hu"
};

export default function CookiesPage() {
  return (
    <LegalPage
      title="Süti tájékoztató"
      lead="A weboldalon használt sütik és hasonló technológiák céljainak összefoglalása."
      sections={[
        {
          title: "Szükséges sütik",
          items: [
            "A weboldal alapvető működéséhez, biztonságához és munkamenet-kezeléséhez szükséges technikai sütik.",
            "Ezek nélkül a kalkulátor vagy az adminisztratív funkciók nem minden esetben működnek megfelelően.",
            "Jogalap: a weboldal működtetéséhez fűződő jogos érdek vagy a szolgáltatás biztosítása."
          ]
        },
        {
          title: "Analitika és mérés",
          items: [
            "Analitikai eszköz használata esetén itt kell feltüntetni az eszköz nevét, szolgáltatóját és célját.",
            "Példa: látogatottság, konverziós arány és hibakeresési információk mérése.",
            "Nem szükséges analitikai sütit engedélyezni, ha ilyen eszköz nincs bekapcsolva."
          ]
        },
        {
          title: "Hozzájárulás kezelése",
          items: [
            "Nem szükséges sütik csak hozzájárulás után aktiválhatók.",
            "A felhasználó a böngésző beállításaiban is törölheti vagy korlátozhatja a sütiket.",
            "Élesítéskor érdemes külön süti-hozzájárulási bannert bekapcsolni, ha nem szükséges sütik is futnak."
          ]
        }
      ]}
    />
  );
}
