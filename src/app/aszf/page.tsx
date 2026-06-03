import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "ÁSZF | CsavarkompresszorKalkulator.hu"
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Általános szerződési feltételek"
      lead="A weboldal és a kalkulátor használatának alapfeltételei, a szolgáltatás jellege és korlátai."
      sections={[
        {
          title: "Szolgáltató",
          items: [
            "Cégnév: [kitöltendő]",
            "Székhely: [kitöltendő]",
            "Cégjegyzékszám / nyilvántartási szám: [kitöltendő]",
            "Email: [kitöltendő]"
          ]
        },
        {
          title: "A szolgáltatás tárgya",
          items: [
            "A weboldal ipari csavarkompresszor energiahatékonysági előkalkulációt biztosít.",
            "Az eredmények becslésen és a felhasználó által megadott adatokon alapulnak.",
            "A kalkuláció nem minősül kötelező erejű műszaki szakvéleménynek vagy ajánlatnak."
          ]
        },
        {
          title: "Felhasználói felelősség",
          items: [
            "A felhasználó felel a megadott adatok pontosságáért.",
            "A kalkulációs eredmény értelmezéséhez helyszíni műszaki felmérés vagy részletes mérés szükséges lehet.",
            "A weboldal rendeltetésszerű használata elvárt."
          ]
        },
        {
          title: "Felelősségi korlátok",
          items: [
            "A szolgáltató nem vállal felelősséget a hibásan megadott adatokból eredő pontatlan eredményekért.",
            "A weboldal üzemeltetője törekszik a folyamatos elérhetőségre, de megszakítás vagy technikai hiba előfordulhat.",
            "A végleges műszaki döntéshez egyedi vizsgálat szükséges."
          ]
        }
      ]}
    />
  );
}
