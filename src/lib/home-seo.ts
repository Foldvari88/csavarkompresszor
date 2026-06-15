import { absoluteUrl, siteName } from "@/lib/seo";

export const homeFaq = [
  {
    question: "Hogyan számolja a kalkulátor a csavarkompresszor megtakarítást?",
    answer:
      "A számítás a régi és az ajánlott gép becsült felvett teljesítményének különbségét szorozza az éves üzemórával és a villamosenergia árral."
  },
  {
    question: "Milyen adatok kellenek az előkalkulációhoz?",
    answer:
      "A jelenlegi gép márkája vagy kategóriája, névleges teljesítménye, kora, éves üzemórája, terhelési profilja és a villamosenergia ár szükséges."
  },
  {
    question: "Mikor érdemes csavarkompresszor cserében gondolkodni?",
    answer:
      "Akkor érdemes előszűrést végezni, ha a gép sokat fut, 5-10 évnél idősebb, magas az energiaköltség, vagy változó levegőigény mellett fix fordulaton dolgozik."
  },
  {
    question: "Mit jelent az RS vagy VSD csavarkompresszor?",
    answer:
      "Az RS/VSD fordulatszám-szabályozott gépet jelent, amely változó levegőigénynél a terheléshez igazíthatja a teljesítményt, így csökkentheti az energiafelhasználást."
  },
  {
    question: "Mi az a csavarkompresszor, és mire használják ipari környezetben?",
    answer:
      "A csavarkompresszor sűrített levegő előállítására szolgáló ipari gép. Gyártóüzemekben, műhelyekben, élelmiszeriparban, fémmegmunkálásban, autóiparban és gépgyártásban gyakran alapvető energiafogyasztó berendezés."
  },
  {
    question: "Mennyi áramot fogyaszt egy csavarkompresszor?",
    answer:
      "A csavarkompresszor áramfogyasztása főként a felvett teljesítménytől, az éves üzemórától, a terhelési profiltól és a villamosenergia díjától függ. Az éves becslés alapja jellemzően: felvett kW x éves üzemóra x Ft/kWh."
  },
  {
    question: "Hogyan csökkenthető egy ipari kompresszor energiaköltsége?",
    answer:
      "A kompresszor energiaköltsége csökkenthető korszerűbb géppel, megfelelő méretezéssel, fordulatszám-szabályozott technológiával, szivárgáscsökkentéssel, nyomásszint optimalizálással és rendszeres karbantartással."
  },
  {
    question: "Mikor éri meg fordulatszám-szabályozott csavarkompresszort választani?",
    answer:
      "Fordulatszám-szabályozott csavarkompresszor akkor lehet előnyös, ha a levegőigény ingadozó, több műszakban változik a terhelés, vagy a jelenlegi fix fordulatú gép sok időt tölt részterhelésen."
  },
  {
    question: "Miért fontos a felvett teljesítmény a csavarkompresszor megtakarítás számításánál?",
    answer:
      "A villamosenergia-költséget nem csak a névleges kW, hanem a ténylegesen felvett teljesítmény határozza meg. Két azonos névleges teljesítményű kompresszor éves fogyasztása eltérhet, ezért a kalkuláció a becsült felvett kW alapján számol."
  },
  {
    question: "Mit jelent a sűrített levegő energiaaudit?",
    answer:
      "A sűrített levegő energiaaudit a kompresszor, a csőhálózat, a nyomásszint, a szivárgások és a fogyasztási profil vizsgálata. Célja, hogy megmutassa, hol lehet csökkenteni a sűrített levegő rendszer energiaköltségét."
  },
  {
    question: "Milyen megtakarítást adhat a kompresszor hővisszanyerés?",
    answer:
      "A csavarkompresszor működés közben jelentős hulladékhőt termel. Ha ez a hő fűtésre vagy használati melegvíz előállítására hasznosítható, akkor a földgázköltség egy része kiváltható."
  },
  {
    question: "Mi alapján érdemes új csavarkompresszort választani?",
    answer:
      "Új csavarkompresszor választásánál a névleges teljesítmény, a tényleges felvett teljesítmény, az éves üzemóra, a terhelési profil, a levegőminőségi igény, a szervizháttér és a várható energiaköltség együtt számít."
  },
  {
    question: "Miért fontos a csavarkompresszor méretezése?",
    answer:
      "A túl kicsi kompresszor termelési kockázatot okozhat, a túl nagy gép pedig felesleges energiaköltséget eredményezhet. A jó méretezés a sűrített levegő igényhez, a csúcsterheléshez és a terhelési profilhoz igazodik."
  }
];

export const homeSeoLinks = [
  {
    href: "/csavarkompresszor-megtakaritas-kalkulator",
    label: "Csavarkompresszor megtakarítás kalkulátor"
  },
  {
    href: "/kompresszor-aramfogyasztas-kalkulator",
    label: "Kompresszor áramfogyasztás számítása"
  },
  {
    href: "/csavarkompresszor-csere-megterules",
    label: "Csavarkompresszor csere megtérülése"
  },
  {
    href: "/rs-vsd-csavarkompresszor",
    label: "RS/VSD csavarkompresszor előnyei"
  },
  {
    href: "/suritett-levego-energiaaudit",
    label: "Sűrített levegő energiaaudit"
  },
  {
    href: "/ipari-kompresszor-energia-megtakaritas",
    label: "Ipari kompresszor energia-megtakarítás"
  }
];

export function buildHomeJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteName,
      url: absoluteUrl("/"),
      inLanguage: "hu-HU"
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteName,
      url: absoluteUrl("/"),
      logo: absoluteUrl("/images/industrial-compressor-hero.png")
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name:
        "Energiamegtakarítás kalkulátor csavarkompresszorok esetén, sűrített levegő rendszereknél",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: absoluteUrl("/"),
      inLanguage: "hu-HU",
      description:
        "Ipari csavarkompresszor energiafogyasztás, éves kWh megtakarítás és villamosenergia-költség előkalkuláció.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "HUF"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: homeFaq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer
        }
      }))
    }
  ];
}
