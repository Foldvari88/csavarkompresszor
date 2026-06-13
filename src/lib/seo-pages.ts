import { absoluteUrl, siteName } from "@/lib/seo";

export type SeoFaq = {
  question: string;
  answer: string;
};

export type SeoPageData = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  lead: string;
  highlights: Array<{
    value: string;
    label: string;
  }>;
  formula?: {
    title: string;
    text: string;
  };
  sections: Array<{
    title: string;
    body?: string;
    items: string[];
  }>;
  examples: Array<{
    label: string;
    value: string;
    note: string;
  }>;
  faq: SeoFaq[];
  related: Array<{
    href: string;
    label: string;
  }>;
};

export const seoPages = [
  {
    slug: "csavarkompresszor-megtakaritas-kalkulator",
    title: "Csavarkompresszor megtakarítás kalkulátor",
    description:
      "Számolja ki, mennyi éves villamosenergia-költséget takaríthat meg egy korszerű ipari csavarkompresszorral.",
    eyebrow: "Energia-megtakarítás kalkulátor",
    h1: "Csavarkompresszor megtakarítás kalkulátor ipari levegőrendszerekhez",
    lead:
      "A kalkulátor a jelenlegi gép becsült felvett teljesítménye, az éves üzemóra és a villamosenergia ár alapján ad előzetes képet az éves kWh és forint megtakarításról.",
    highlights: [
      { value: "kWh/év", label: "energiahatás" },
      { value: "Ft/év", label: "költségbecslés" },
      { value: "RS/VSD", label: "modellajánlás" }
    ],
    formula: {
      title: "Alap számítási logika",
      text:
        "Becsült éves megtakarítás = régi és ajánlott gép felvett teljesítményének különbsége x éves üzemóra x villamosenergia ár."
    },
    sections: [
      {
        title: "Mikor hasznos a kalkulátor?",
        body:
          "A legnagyobb értéke csere vagy korszerűsítés előtt van, amikor gyorsan látni kell, hogy a jelenlegi kompresszor energiaigénye mekkora pénzügyi hatást okozhat.",
        items: [
          "Régi, 5-10 évnél idősebb csavarkompresszor vizsgálata előtt.",
          "Energiahatékonysági beruházás előszűréséhez.",
          "RS/VSD modell és fix fordulatú gép összevetéséhez.",
          "Beszerzési döntés előtti műszaki egyeztetéshez."
        ]
      },
      {
        title: "Milyen adatok kellenek?",
        items: [
          "Jelenlegi gép márkája vagy kategóriája.",
          "Névleges teljesítmény kW-ban.",
          "Gép kora és terhelési profilja.",
          "Éves üzemóra.",
          "Villamosenergia ár Ft/kWh értékben."
        ]
      }
    ],
    examples: [
      {
        label: "Tipikus bemenet",
        value: "37 kW",
        note: "közepes ipari gépméret"
      },
      {
        label: "Erős hatás",
        value: "4000+ óra/év",
        note: "magas futásnál gyorsabban látszik a különbség"
      },
      {
        label: "Legfontosabb költség",
        value: "Ft/kWh",
        note: "a villamosenergia ár mozgatja a megtérülést"
      }
    ],
    faq: [
      {
        question: "Pontos ajánlatot ad a csavarkompresszor megtakarítás kalkulátor?",
        answer:
          "Nem végleges ajánlatot ad, hanem előkalkulációt. A pontos döntéshez helyszíni műszaki felmérés, nyomásprofil, szivárgásvizsgálat és valós fogyasztási mérés is szükséges lehet."
      },
      {
        question: "Melyik adat befolyásolja legjobban az eredményt?",
        answer:
          "Általában az éves üzemóra, a villamosenergia ár és a régi gép tényleges felvett teljesítménye adja a legnagyobb hatást."
      },
      {
        question: "Mire jó az emailes riport?",
        answer:
          "Az emailes riport visszakereshető formában tartalmazza a megadott bemeneti adatokat, a becsült éves kWh megtakarítást és a javasolt géptípust."
      }
    ],
    related: [
      { href: "/kompresszor-aramfogyasztas-kalkulator", label: "Kompresszor áramfogyasztás számítása" },
      { href: "/csavarkompresszor-csere-megterules", label: "Csavarkompresszor csere megtérülése" },
      { href: "/rs-vsd-csavarkompresszor", label: "RS/VSD csavarkompresszor előnyei" }
    ]
  },
  {
    slug: "csavarkompresszor-csere-megterules",
    title: "Csavarkompresszor csere megtérülés",
    description:
      "Mikor éri meg lecserélni egy régi ipari csavarkompresszort? Megtérülési szempontok, üzemóra, energiaár és RS/VSD hatás.",
    eyebrow: "Csere előtti döntéstámogatás",
    h1: "Csavarkompresszor csere megtérülése: mikor éri meg korszerűsíteni?",
    lead:
      "A csere megtérülése akkor válik erőssé, ha a régi gép sokat fut, magas az energiaár, és a korszerű gép felvett teljesítménye érezhetően alacsonyabb.",
    highlights: [
      { value: "üzemóra", label: "fő tényező" },
      { value: "kWh", label: "mérhető hatás" },
      { value: "ROI", label: "beruházási döntés" }
    ],
    formula: {
      title: "Egyszerű megtérülési képlet",
      text:
        "Becsült megtérülési idő = beruházási költség / éves energia- és karbantartási megtakarítás."
    },
    sections: [
      {
        title: "Mikor erős a csere üzleti indoka?",
        items: [
          "A kompresszor több műszakban vagy folyamatosan fut.",
          "A gép 10 évnél idősebb, és romlott a hatásfoka.",
          "Változó a levegőigény, de a régi gép fix fordulaton dolgozik.",
          "Az energiaár emelkedése miatt a villamosenergia-költség lett a fő költségelem."
        ]
      },
      {
        title: "Mit kell ellenőrizni csere előtt?",
        items: [
          "Valós üzemi nyomás és nyomásveszteség.",
          "Szivárgások aránya a sűrített levegő rendszerben.",
          "Tartály, szárító és levegőkezelés állapota.",
          "A tényleges terhelési profil: folyamatos vagy ingadozó."
        ]
      }
    ],
    examples: [
      { label: "Gyorsabb megtérülés", value: "magas üzemóra", note: "több futás, több megtakarítás" },
      { label: "Kockázati jel", value: "10+ év", note: "idősebb gépnél nagyobb a veszteség esélye" },
      { label: "Döntési adat", value: "Ft/év", note: "a vezetőségnek pénzügyi nyelvre fordítja a műszaki hatást" }
    ],
    faq: [
      {
        question: "Hány év alatt térülhet meg egy csavarkompresszor csere?",
        answer:
          "Ez a gépmérettől, üzemórától, energiaártól és beruházási költségtől függ. Magas üzemóra mellett a megtérülés lényegesen rövidebb lehet."
      },
      {
        question: "Elég csak a kompresszort lecserélni?",
        answer:
          "Nem mindig. Ha a rendszerben nagy a szivárgás vagy rossz a nyomásszint, a csere mellett rendszeroldali javításokra is szükség lehet."
      }
    ],
    related: [
      { href: "/", label: "Megtakarítás számítása a kalkulátorral" },
      { href: "/suritett-levego-energiaaudit", label: "Sűrített levegő energiaaudit" },
      { href: "/ipari-kompresszor-energia-megtakaritas", label: "Ipari kompresszor energia-megtakarítás" }
    ]
  },
  {
    slug: "rs-vsd-csavarkompresszor",
    title: "RS/VSD csavarkompresszor előnyei",
    description:
      "Mikor éri meg fordulatszám-szabályozott RS vagy VSD csavarkompresszort választani fix fordulatú gép helyett?",
    eyebrow: "Fordulatszám-szabályozás",
    h1: "RS/VSD csavarkompresszor: mikor ad valódi energia-megtakarítást?",
    lead:
      "Az RS/VSD csavarkompresszor akkor különösen előnyös, ha a levegőigény nem állandó, hanem műszak, termelési ciklus vagy csúcsterhelés szerint változik.",
    highlights: [
      { value: "részterhelés", label: "fő előny" },
      { value: "stabil nyomás", label: "üzemi hatás" },
      { value: "kevesebb pazarlás", label: "energiaoldal" }
    ],
    formula: {
      title: "Lényeg röviden",
      text:
        "A fordulatszám-szabályozás a motor teljesítményét a levegőigényhez igazítja, ezért részterhelésen csökkentheti a felesleges energiafelhasználást."
    },
    sections: [
      {
        title: "Mikor jó választás az RS/VSD?",
        items: [
          "Változó termelési terhelésnél.",
          "Több műszakos, de nem folyamatosan azonos levegőigényű üzemben.",
          "Ha gyakori a részterhelés.",
          "Ha fontos a stabilabb nyomásszint és a finomabb szabályozás."
        ]
      },
      {
        title: "Mikor lehet elég a fix fordulatú gép?",
        items: [
          "Ha a levegőigény nagyon stabil és közel állandó.",
          "Ha a gép hosszú ideig azonos terhelésen fut.",
          "Ha a beruházási költség és az üzemeltetési profil alapján a VSD előnye kicsi."
        ]
      }
    ],
    examples: [
      { label: "Legjobb környezet", value: "ingadozó igény", note: "a szabályozás itt hasznosul a legtöbbet" },
      { label: "Tipikus cél", value: "nyomásstabilitás", note: "üzemeltetési komfortot is adhat" },
      { label: "Vizsgálandó adat", value: "terhelési profil", note: "ez dönti el a valódi előnyt" }
    ],
    faq: [
      {
        question: "Mindig jobb az RS/VSD kompresszor?",
        answer:
          "Nem mindig. Változó levegőigénynél általában erős, de stabil, folyamatos terhelésnél a fix fordulatú gép is megfelelő lehet."
      },
      {
        question: "Miért csökkentheti az RS/VSD gép az áramfogyasztást?",
        answer:
          "Mert a gép nem minden helyzetben teljes fordulaton dolgozik, hanem a pillanatnyi levegőigényhez igazítja a teljesítményt."
      }
    ],
    related: [
      { href: "/csavarkompresszor-megtakaritas-kalkulator", label: "Megtakarítás kalkulátor" },
      { href: "/kompresszor-aramfogyasztas-kalkulator", label: "Áramfogyasztás számítása" },
      { href: "/csavarkompresszor-csere-megterules", label: "Csere megtérülése" }
    ]
  },
  {
    slug: "kompresszor-aramfogyasztas-kalkulator",
    title: "Kompresszor áramfogyasztás kalkulátor",
    description:
      "Ipari kompresszor áramfogyasztás számítása kW, éves üzemóra és villamosenergia ár alapján, gyakorlati példákkal.",
    eyebrow: "Áramfogyasztás számítás",
    h1: "Kompresszor áramfogyasztás kalkulátor: kW, üzemóra és Ft/kWh alapján",
    lead:
      "A kompresszor éves áramköltsége a tényleges felvett teljesítményből, az éves üzemórából és az energiaárból becsülhető. Ez adja a megtakarítási számítás alapját is.",
    highlights: [
      { value: "kW", label: "felvett teljesítmény" },
      { value: "óra/év", label: "futási idő" },
      { value: "Ft/kWh", label: "energiaár" }
    ],
    formula: {
      title: "Áramköltség képlet",
      text:
        "Éves áramköltség = felvett teljesítmény kW x éves üzemóra x villamosenergia ár Ft/kWh."
    },
    sections: [
      {
        title: "Miért nem elég a névleges kW?",
        body:
          "A névleges teljesítmény jó kiindulás, de a valós fogyasztást a tényleges felvett teljesítmény, a terhelési profil és a szabályozási mód határozza meg.",
        items: [
          "A régi gép hatásfoka romolhat.",
          "Részterhelésen eltérő lehet a fogyasztás.",
          "A magasabb üzemi nyomás növelheti az energiaigényt.",
          "A rendszer szivárgása felesleges futást okozhat."
        ]
      },
      {
        title: "Milyen értékekkel érdemes számolni?",
        items: [
          "A villanyszámla vagy energiabeszerzési szerződés szerinti Ft/kWh értékkel.",
          "A valós termelési naptárból becsült éves üzemórával.",
          "A gép adatlapja vagy mérése alapján becsült felvett teljesítménnyel."
        ]
      }
    ],
    examples: [
      { label: "Példa képlet", value: "30 kW x 4000 h", note: "120 000 kWh/év energiaigény" },
      { label: "Költségadat", value: "Ft/kWh", note: "minden forint árkülönbség megszorozódik az éves kWh-val" },
      { label: "Pontosság", value: "mérés", note: "a legjobb adat valós fogyasztásmérésből jön" }
    ],
    faq: [
      {
        question: "Hogyan számolható ki egy kompresszor éves áramfogyasztása?",
        answer:
          "A felvett teljesítményt kW-ban meg kell szorozni az éves üzemórával. Az így kapott kWh értéket a Ft/kWh energiaárral szorozva adódik a becsült éves költség."
      },
      {
        question: "Miért lehet pontatlan a névleges kW alapján számolni?",
        answer:
          "Mert a névleges kW nem mindig azonos a valós, üzemi körülmények közötti felvett teljesítménnyel."
      }
    ],
    related: [
      { href: "/", label: "Élő kalkulátor használata" },
      { href: "/rs-vsd-csavarkompresszor", label: "RS/VSD szabályozás hatása" },
      { href: "/suritett-levego-energiaaudit", label: "Energiaaudit előkészítése" }
    ]
  },
  {
    slug: "suritett-levego-energiaaudit",
    title: "Sűrített levegő energiaaudit",
    description:
      "Sűrített levegő energiaaudit előkészítése: milyen adatok, mérések és vizsgálatok kellenek egy ipari kompresszor rendszerhez?",
    eyebrow: "Rendszerszintű vizsgálat",
    h1: "Sűrített levegő energiaaudit: mit kell mérni kompresszor csere előtt?",
    lead:
      "A kompresszor önmagában csak a rendszer egyik eleme. Egy energiaaudit feltárhatja a szivárgást, nyomásveszteséget, túlméretezést és a szabályozási veszteségeket is.",
    highlights: [
      { value: "szivárgás", label: "gyakori veszteség" },
      { value: "nyomás", label: "rendszerhatás" },
      { value: "mérés", label: "pontos döntés" }
    ],
    formula: {
      title: "Audit célja",
      text:
        "Az energiaaudit célja nem csak a gépcsere indoklása, hanem a teljes sűrített levegő rendszer veszteségeinek számszerűsítése."
    },
    sections: [
      {
        title: "Mit vizsgál egy jó audit?",
        items: [
          "Kompresszorok terhelési profilja.",
          "Hálózati nyomásszint és nyomásveszteség.",
          "Szivárgási arány.",
          "Levegőkezelő elemek és tartályok állapota.",
          "Felhasználási pontok és termelési ciklusok."
        ]
      },
      {
        title: "Milyen eredményt adhat?",
        items: [
          "Energia-megtakarítási potenciál kWh/év és Ft/év alapon.",
          "Javaslat gépcserére vagy szabályozási módosításra.",
          "Szivárgáscsökkentési és nyomásoptimalizálási javaslat.",
          "Beruházási prioritási sorrend."
        ]
      }
    ],
    examples: [
      { label: "Első lépés", value: "adatgyűjtés", note: "gép, üzemóra, ár, nyomás" },
      { label: "Második lépés", value: "mérés", note: "valós terhelés és fogyasztás" },
      { label: "Döntés", value: "prioritás", note: "először a legnagyobb veszteséget kell kezelni" }
    ],
    faq: [
      {
        question: "Miért kell audit, ha van kalkulátor?",
        answer:
          "A kalkulátor gyors előszűrésre jó, az audit pedig pontosabb, mért adatokra épülő rendszerdiagnózist ad."
      },
      {
        question: "A szivárgás tényleg ennyire fontos?",
        answer:
          "Igen, mert a szivárgás folyamatos felesleges kompresszorfutást okozhat, ami közvetlen villamosenergia-költségként jelenik meg."
      }
    ],
    related: [
      { href: "/kompresszor-aramfogyasztas-kalkulator", label: "Áramfogyasztás alapképlet" },
      { href: "/csavarkompresszor-csere-megterules", label: "Csere megtérülése" },
      { href: "/", label: "Gyors megtakarítási előkalkuláció" }
    ]
  },
  {
    slug: "ipari-kompresszor-energia-megtakaritas",
    title: "Ipari kompresszor energia-megtakarítás",
    description:
      "Ipari kompresszor energia-megtakarítás gyakorlati lépései: fogyasztás, szivárgás, nyomásoptimalizálás és korszerű csavarkompresszor.",
    eyebrow: "Ipari energiahatékonyság",
    h1: "Ipari kompresszor energia-megtakarítás: hol érdemes kezdeni?",
    lead:
      "Az ipari kompresszor energia-megtakarítás nem egyetlen gépadatból áll. A legjobb eredmény a fogyasztás, nyomás, szivárgás, szabályozás és gépválasztás együttes vizsgálatából jön.",
    highlights: [
      { value: "rendszer", label: "teljes kép" },
      { value: "költség", label: "üzleti hatás" },
      { value: "prioritás", label: "gyors döntés" }
    ],
    formula: {
      title: "Prioritási logika",
      text:
        "Először a legnagyobb, leggyorsabban csökkenthető veszteséget érdemes azonosítani: szivárgás, túl magas nyomás, rossz szabályozás vagy elavult gép."
    },
    sections: [
      {
        title: "Leggyakoribb megtakarítási területek",
        items: [
          "Régi kompresszor cseréje hatékonyabb gépre.",
          "Fordulatszám-szabályozott gép választása változó igényhez.",
          "Szivárgások csökkentése.",
          "Üzemi nyomás optimalizálása.",
          "Levegőkezelés és tartályozás rendbetétele."
        ]
      },
      {
        title: "Hogyan legyen üzleti döntés a műszaki adatból?",
        items: [
          "A kW-különbséget éves kWh-ra kell fordítani.",
          "Az éves kWh-t Ft/év értékre kell átszámolni.",
          "A megtakarítást össze kell vetni a beruházási költséggel.",
          "A legnagyobb hatású beavatkozás kapjon prioritást."
        ]
      }
    ],
    examples: [
      { label: "Műszaki adat", value: "kW", note: "felvett teljesítmény különbsége" },
      { label: "Energiaadat", value: "kWh/év", note: "üzemórával számolt hatás" },
      { label: "Vezetői adat", value: "Ft/év", note: "döntéshez szükséges költségnyelv" }
    ],
    faq: [
      {
        question: "Mi a leggyorsabb kompresszor energia-megtakarítási lépés?",
        answer:
          "Sok üzemben a szivárgások feltárása és a nyomásszint ellenőrzése gyors első lépés, gépcsere előtt is."
      },
      {
        question: "Mikor kell gépcserében gondolkodni?",
        answer:
          "Akkor, ha a régi gép sokat fut, gyenge a hatásfoka, magas a karbantartási kockázata, vagy a terhelési profilhoz nem illeszkedik a szabályozása."
      }
    ],
    related: [
      { href: "/suritett-levego-energiaaudit", label: "Energiaaudit lépései" },
      { href: "/csavarkompresszor-megtakaritas-kalkulator", label: "Megtakarítás kalkulátor" },
      { href: "/rs-vsd-csavarkompresszor", label: "RS/VSD megoldás változó igényhez" }
    ]
  }
] satisfies SeoPageData[];

export function getSeoPage(slug: string) {
  return seoPages.find((page) => page.slug === slug);
}

export function seoPageUrl(page: SeoPageData) {
  return absoluteUrl(`/${page.slug}`);
}

export function buildSeoPageJsonLd(page: SeoPageData) {
  const url = seoPageUrl(page);

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: page.title,
      headline: page.h1,
      description: page.description,
      url,
      inLanguage: "hu-HU",
      publisher: {
        "@type": "Organization",
        name: siteName,
        url: absoluteUrl("/")
      },
      mainEntity: page.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer
        }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer
        }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Kezdőlap",
          item: absoluteUrl("/")
        },
        {
          "@type": "ListItem",
          position: 2,
          name: page.title,
          item: url
        }
      ]
    }
  ];
}
