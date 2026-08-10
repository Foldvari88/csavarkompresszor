import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Felhasználási feltételek | iparikalkulator.hu"
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Felhasználási feltételek"
      lead="A weboldal és az ingyenes B2B kalkulátor használatának alapvető feltételei."
      sections={[
        {
          title: "Szolgáltató",
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
          title: "A szolgáltatás tárgya",
          items: [
            "A weboldal csavarkompresszorok energiafelhasználásához és megtakarítási lehetőségeihez kapcsolódó előkalkulációt biztosít céges, B2B érdeklődőknek.",
            "A kalkuláció a felhasználó által megadott adatokból és általános számítási feltételekből készül.",
            "A beküldés után a rendszer automatikus emailes riportot küld a megadott email címre.",
            "Az eredmény tájékoztató jellegű, nem minősül ajánlatnak, mérnöki szakvéleménynek vagy megtakarítási garanciának."
          ]
        },
        {
          title: "Díj, rendelés és szerződéskötés",
          items: [
            "A kalkulátor használata ingyenes.",
            "A weboldalon nincs online fizetés és nincs online rendelés.",
            "A kalkuláció beküldése és az automatikus riport kiküldése önmagában nem minősül megrendelésnek vagy szerződéskötésnek, és nem hoz létre fizetési kötelezettséget.",
            "Egyedi ajánlat, helyszíni felmérés, gépértékesítés vagy szervizszolgáltatás csak külön egyeztetés alapján jöhet létre."
          ]
        },
        {
          title: "B2B felhasználás",
          items: [
            "A kalkulátor cégek, intézmények és egyéni vállalkozók üzleti, B2B tájékozódását támogatja.",
            "A szolgáltatás nem fogyasztói online rendelési felület, és fogyasztói szerződéskötésre nem irányul.",
            "A felhasználó a beküldéssel tudomásul veszi, hogy az eredmény üzleti előkalkuláció és ajánlat-előkészítési célú megkeresés alapja lehet."
          ]
        },
        {
          title: "Felhasználói kötelezettségek",
          items: [
            "A felhasználó felel a megadott adatok pontosságáért és jogszerű megadásáért.",
            "A kalkulátor rendeltetésszerűen, a weboldal működését nem zavaró módon használható.",
            "A riport és a kalkuláció eredménye üzleti döntés előtt helyszíni felméréssel vagy egyedi szakmai vizsgálattal ellenőrizhető."
          ]
        },
        {
          title: "Felelősségi korlátok",
          items: [
            "A szolgáltató nem felel a hibás, hiányos vagy pontatlanul megadott adatokból eredő eltérésekért.",
            "A szolgáltató törekszik a weboldal elérhetőségére, de az időszakos technikai hiba, karbantartás vagy kiesés lehetőségét nem zárja ki.",
            "A weboldalon szereplő információk nem helyettesítik az egyedi műszaki, energetikai vagy gazdasági vizsgálatot."
          ]
        },
        {
          title: "Kapcsolat",
          items: [
            "A weboldallal, riporttal vagy adatkezeléssel kapcsolatos megkeresések az info@iparikalkulator.hu email címen tehetők meg."
          ]
        }
      ]}
    />
  );
}
