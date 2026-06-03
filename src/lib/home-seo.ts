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
      "Akkor érdemes előszűrést végezni, ha a gép sokat fut, 5-10 évnél idősebb, magas az energiaár, vagy változó levegőigény mellett fix fordulaton dolgozik."
  },
  {
    question: "Mit jelent az RS vagy VSD csavarkompresszor?",
    answer:
      "Az RS/VSD fordulatszám-szabályozott gépet jelent, amely változó levegőigénynél a terheléshez igazíthatja a teljesítményt, így csökkentheti az energiafelhasználást."
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
      name: "Csavarkompresszor megtakarítás kalkulátor",
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

