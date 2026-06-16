import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Adatkezelési tájékoztató | iparikalkulator.hu"
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Adatkezelési tájékoztató"
      lead="A kalkulátor használatához, a riport kiküldéséhez és a külön hozzájáruláson alapuló marketingcélú adatkezeléshez kapcsolódó kötelező tájékoztatás."
      sections={[
        {
          title: "Adatkezelő",
          items: [
            "Név: Földvári István egyéni vállalkozó",
            "Székhely: [kitöltendő]",
            "Nyilvántartási szám: [kitöltendő]",
            "Adószám: [kitöltendő]",
            "Kapcsolat adatvédelmi ügyekben: [kitöltendő email cím]"
          ]
        },
        {
          title: "Kezelt adatok",
          items: [
            "Kapcsolattartási adatok: név, email cím, telefonszám, opcionálisan cégnév.",
            "Kalkulációs adatok: iparág vagy tevékenység, kompresszor márkája, teljesítménye, kora, éves üzemóra, energiaár, terhelési profil és opcionális hővisszanyerési adatok.",
            "Technikai adatok: beküldés időpontja, böngésző által továbbított alapvető naplóadatok, kampányparaméterek, ha a látogató ilyen hivatkozásból érkezik.",
            "Hozzájárulási adatok: adatkezelési és marketing hozzájárulás ténye, időpontja és visszavonása."
          ]
        },
        {
          title: "Célok és jogalapok",
          items: [
            "Kalkuláció és riport elkészítése, emailben történő kiküldése, valamint a megkeresés kezelése. Jogalap: a kért szolgáltatás teljesítése és az érintett hozzájárulása.",
            "A weboldal biztonságos működtetése, hibák megelőzése és alapvető naplózás. Jogalap: jogos érdek.",
            "Marketingcélú megkeresés és marketingcélú adattovábbítás kizárólag külön, önkéntes hozzájárulás esetén. Jogalap: hozzájárulás."
          ]
        },
        {
          title: "Címzettek",
          items: [
            "A személyes adatokat a weboldal működtetésében, tárhelyszolgáltatásban, emailküldésben, adatbázis-kezelésben és adminisztrációban közreműködő szolgáltatók kezelhetik.",
            "Külön marketing hozzájárulás esetén az adatok marketingcélú megkeresés céljából továbbíthatók szerződött szakmai partnerek részére.",
            "A címzettek kategóriái: kompresszortechnikai, sűrítettlevegő-rendszerekkel, ipari karbantartással, energetikai tanácsadással, gépértékesítéssel vagy szervizszolgáltatással foglalkozó szakmai partnerek.",
            "A továbbított adatok köre: név, cégnév, email cím, telefonszám, iparág vagy tevékenység, valamint a kalkulációhoz vagy ajánlat-előkészítéshez megadott műszaki adatok."
          ]
        },
        {
          title: "Megőrzési idő",
          items: [
            "A kalkulációhoz és megkereséshez kapcsolódó adatok megőrzési ideje: [kitöltendő, például 12 hónap].",
            "Marketingcélú adatkezelés esetén az adatok a hozzájárulás visszavonásáig, de legfeljebb [kitöltendő időtartam]-ig kezelhetők.",
            "A hozzájárulás visszavonása nem érinti a visszavonás előtti adatkezelés jogszerűségét."
          ]
        },
        {
          title: "Érintetti jogok",
          items: [
            "Az érintett kérheti az adataihoz való hozzáférést, azok helyesbítését, törlését, kezelésének korlátozását, valamint tiltakozhat az adatkezelés ellen.",
            "Hozzájáruláson alapuló adatkezelés esetén a hozzájárulás bármikor, indokolás nélkül visszavonható az adatkezelő kapcsolati email címén.",
            "Panasz benyújtható a Nemzeti Adatvédelmi és Információszabadság Hatóságnál: 1055 Budapest, Falk Miksa utca 9-11.; ugyfelszolgalat@naih.hu; www.naih.hu."
          ]
        }
      ]}
    />
  );
}
