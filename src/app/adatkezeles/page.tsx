import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Adatkezelési tájékoztató | iparikalkulator.hu"
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Adatkezelési tájékoztató"
      lead="A kalkulátor használatához, az automatikus emailes riport kiküldéséhez és a külön hozzájáruláson alapuló marketingcélú adatkezeléshez kapcsolódó tájékoztatás."
      sections={[
        {
          title: "Adatkezelő",
          items: [
            "Név: Földvári István EV",
            "Székhely: 5008 Szolnok, Körte utca 51.",
            "Nyilvántartási szám: 57818731",
            "Adószám: 59775793-1-36",
            "Kapcsolat adatvédelmi ügyekben: info@iparikalkulator.hu",
            "Marketing leiratkozás és hozzájárulás visszavonása: info@iparikalkulator.hu"
          ]
        },
        {
          title: "Kezelt adatok",
          items: [
            "Üzleti/B2B kapcsolattartási adatok: név, email cím, telefonszám, opcionálisan cégnév.",
            "Kalkulációs adatok: iparág vagy tevékenység, kompresszor márkája, teljesítménye, kora, éves üzemóra, energiaár, terhelési profil és opcionális hővisszanyerési adatok.",
            "Technikai és mérési adatok: beküldés időpontja, böngésző által továbbított alapvető naplóadatok, süti- és online azonosítók, kampányparaméterek, ha a látogató ilyen hivatkozásból érkezik.",
            "Hozzájárulási adatok: adatkezelési és marketing hozzájárulás ténye, időpontja és visszavonása."
          ]
        },
        {
          title: "Célok és jogalapok",
          items: [
            "Kalkuláció elkészítése, automatikus emailes riport kiküldése, valamint a megkeresés kezelése. Jogalap: a kért szolgáltatás teljesítése és az érintett hozzájárulása.",
            "A weboldal biztonságos működtetése, hibák megelőzése és alapvető naplózás. Jogalap: jogos érdek.",
            "Marketingcélú megkeresés emailben és telefonon, valamint marketingcélú adattovábbítás kizárólag külön, önkéntes hozzájárulás esetén. Jogalap: hozzájárulás."
          ]
        },
        {
          title: "Címzettek",
          items: [
            "Tárhelyszolgáltatás: Rackhost Zrt., 6722 Szeged, Tisza Lajos körút 41., info@rackhost.hu.",
            "Emailküldés: Resend Inc., az automatikus emailes riportok és hozzájáruláson alapuló utánkövető üzenetek kézbesítéséhez.",
            "Adatbázis-kezelés: Supabase, a leadek és kalkulációs adatok tárolásához.",
            "A leadekhez az adatkezelő, Földvári István EV fér hozzá; külön CRM rendszer nem kerül használatra.",
            "Mérés és címkekezelés: Google Tag Manager és Google Analytics, a látogatottság, használat és technikai teljesítmény méréséhez.",
            "Hirdetési és remarketing mérés: Google Ads conversion tracking, Google Ads remarketing és Meta Pixel, kizárólag a látogató hozzájárulása esetén.",
            "A Google-szolgáltatásokhoz kapcsolódó adatkezelésben érintett szolgáltató: Google Ireland Limited. A Meta Pixelhez kapcsolódó adatkezelésben érintett szolgáltató: Meta Platforms Ireland Limited.",
            "A Google és Meta szolgáltatások használata során az adatok az Európai Gazdasági Térségen kívüli országba is továbbításra kerülhetnek; ilyen esetben a szolgáltatók által alkalmazott adattovábbítási garanciák irányadók.",
            "Külön marketing hozzájárulás esetén az adatok marketingcélú megkeresés céljából továbbíthatók szerződött szakmai partnerek részére.",
            "A szakmai partnerek részére történő adattovábbítás nem automatikus; az adatkezelő kézi előszűrés után dönt a továbbításról.",
            "A címzettek kategóriái: kompresszortechnikai, sűrítettlevegő-rendszerekkel, ipari karbantartással, energetikai tanácsadással, gépértékesítéssel vagy szervizszolgáltatással foglalkozó szakmai partnerek.",
            "A továbbított adatok köre: név, cégnév, email cím, telefonszám, iparág vagy tevékenység, valamint a kalkulációhoz vagy ajánlat-előkészítéshez megadott műszaki adatok."
          ]
        },
        {
          title: "Megőrzési idő",
          items: [
            "A kalkulációhoz és megkereséshez kapcsolódó adatok megőrzési ideje: 12 hónap.",
            "Marketingcélú adatkezelés esetén az adatok a hozzájárulás visszavonásáig, de legfeljebb 24 hónapig kezelhetők.",
            "A hozzájárulás visszavonása nem érinti a visszavonás előtti adatkezelés jogszerűségét."
          ]
        },
        {
          title: "Érintetti jogok",
          items: [
            "Az érintett kérheti az adataihoz való hozzáférést, azok helyesbítését, törlését, kezelésének korlátozását, valamint tiltakozhat az adatkezelés ellen.",
            "Hozzájáruláson alapuló adatkezelés esetén a hozzájárulás bármikor, indokolás nélkül visszavonható az info@iparikalkulator.hu email címen.",
            "Marketingcélú megkeresésről ugyanitt, az info@iparikalkulator.hu email címen lehet leiratkozni.",
            "Panasz benyújtható a Nemzeti Adatvédelmi és Információszabadság Hatóságnál: 1055 Budapest, Falk Miksa utca 9-11.; ugyfelszolgalat@naih.hu; www.naih.hu."
          ]
        }
      ]}
    />
  );
}
