import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Süti tájékoztató | CsavarkompresszorKalkulator.hu",
  description:
    "A CsavarkompresszorKalkulator.hu sütikezelési tájékoztatója ipari energiahatékonysági kalkulációkhoz."
};

export default function CookiesPage() {
  return (
    <LegalPage
      variant="industrial"
      eyebrow="Adatkezelési kontrollpanel"
      title="Süti tájékoztató"
      lead="Átlátható összefoglaló arról, milyen technikai, mérési és hozzájáruláshoz kötött sütiket használhat az ipari csavarkompresszor kalkulátor."
      highlights={[
        { value: "Alap", label: "technikai működés" },
        { value: "Opt-in", label: "analitika és kampánymérés" },
        { value: "Kontroll", label: "böngészőben bármikor törölhető" }
      ]}
      sections={[
        {
          title: "Üzembiztos működéshez szükséges sütik",
          items: [
            "Ezek a sütik a kalkulátor alapvető működéséhez, biztonságához, űrlap-kezeléséhez és munkamenet-stabilitásához szükségesek.",
            "Céljuk, hogy a megadott kompresszoradatok, kalkulációs lépések és adminisztratív funkciók megbízhatóan működjenek.",
            "Jogalap: a weboldal működtetéséhez fűződő jogos érdek vagy a kért online szolgáltatás biztosítása."
          ]
        },
        {
          title: "Teljesítménymérés és analitika",
          items: [
            "Analitikai eszköz csak akkor használható, ha az adott mérési megoldás ténylegesen be van kapcsolva és a látogató hozzájárulása szükség esetén megtörtént.",
            "Mérhető például az oldalbetöltés, a kalkulátor használati útvonala, a hibaarány és az, hogy mely lépéseknél kell javítani a felhasználói élményt.",
            "A mérési adatok célja az oldal ipari döntéstámogató minőségének javítása, nem pedig a megadott műszaki adatok rejtett továbbértékesítése."
          ]
        },
        {
          title: "Kampány és forrásazonosítás",
          items: [
            "A weboldal UTM paramétereket és hivatkozó forrást rögzíthet annak megértésére, hogy a látogató mely szakmai vagy hirdetési csatornából érkezett.",
            "Ezek az adatok a lead minőségének és a kampányok hatékonyságának elemzését segítik.",
            "Ha egy kampánymérési eszköz nem szükséges sütit helyez el, az csak megfelelő hozzájárulási beállítás mellett aktiválható."
          ]
        },
        {
          title: "Felhasználói kontroll",
          items: [
            "A nem szükséges sütik csak hozzájárulás után aktiválhatók.",
            "A látogató a böngésző beállításaiban bármikor törölheti, blokkolhatja vagy korlátozhatja a sütiket.",
            "Éles üzemben a használt mérő- és marketingeszközök pontos listáját a ténylegesen bekapcsolt szolgáltatások szerint kell véglegesíteni."
          ]
        }
      ]}
    />
  );
}
