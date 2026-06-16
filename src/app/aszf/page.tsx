import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Felhasználási feltételek | iparikalkulator.hu"
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Felhasználási feltételek"
      lead="A weboldal és a kalkulátor használatának alapvető feltételei."
      sections={[
        {
          title: "Szolgáltató",
          items: [
            "Név: Földvári István egyéni vállalkozó",
            "Székhely: [kitöltendő]",
            "Nyilvántartási szám: [kitöltendő]",
            "Adószám: [kitöltendő]",
            "Email: [kitöltendő]"
          ]
        },
        {
          title: "A szolgáltatás tárgya",
          items: [
            "A weboldal csavarkompresszorok energiafelhasználásához és megtakarítási lehetőségeihez kapcsolódó előkalkulációt biztosít.",
            "A kalkuláció a felhasználó által megadott adatokból és általános számítási feltételekből készül.",
            "Az eredmény tájékoztató jellegű, nem minősül ajánlatnak, mérnöki szakvéleménynek vagy megtakarítási garanciának."
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
            "A weboldallal, riporttal vagy adatkezeléssel kapcsolatos megkeresések az alábbi email címen tehetők meg: [kitöltendő]."
          ]
        }
      ]}
    />
  );
}
