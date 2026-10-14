import type { CampaignInquiryKind } from "@/lib/campaign-inquiries/types";

export type CustomerOfferConfig = {
  kind: CampaignInquiryKind;
  pageSource: string;
  eyebrow: string;
  title: string;
  lead: string;
  primaryCta: string;
  formTitle: string;
  formLead: string;
  benefits: Array<{ title: string; text: string }>;
  proofPoints: string[];
  process: Array<{ title: string; text: string }>;
  primaryDetail: {
    label: string;
    placeholder: string;
    options: string[];
  };
  secondaryDetail: {
    label: string;
    placeholder: string;
    options: string[];
  };
  equipmentBrandLabel: string;
  equipmentModelLabel: string;
};

export const serviceOffer: CustomerOfferConfig = {
  kind: "service",
  pageSource: "kompresszor-szerviz-ajanlat",
  eyebrow: "Országos ipari szervizháttér",
  title: "Tervezhető kompresszorszerviz, kevesebb váratlan leállással",
  lead:
    "Egyeztessük a gépparkot és a következő karbantartás műszaki igényét. Olajos, olajmentes és csavarkompresszorokhoz is kérhet személyre szabott szervizajánlatot.",
  primaryCta: "Kérek szervizajánlatot",
  formTitle: "Kérjen szervizajánlatot",
  formLead:
    "A kapcsolati adatok mellett márka és megközelítő szervizidő is elegendő az első egyeztetéshez.",
  benefits: [
    {
      title: "Vegyes géppark",
      text: "Többféle márka és berendezéstípus karbantartási igénye egy megkeresésben egyeztethető."
    },
    {
      title: "Helyszíni támogatás",
      text: "Országos szervizelés, jól felszerelt szervizautókkal és több regionális állomással."
    },
    {
      title: "Megelőző szemlélet",
      text: "Az üzemóra szerinti karbantartás segít csökkenteni a nem tervezett kiesés kockázatát."
    }
  ],
  proofPoints: ["14 fős szerviztechnikusi csapat", "5 szervizállomás", "országos kiszállás"],
  process: [
    { title: "Géppark egyeztetése", text: "Márka, típus és az utolsó ismert karbantartás alapján indulunk." },
    { title: "Műszaki pontosítás", text: "Szükség esetén telefonon vagy helyszínen tisztázzuk a feladatot." },
    { title: "Szervizajánlat", text: "A tényleges igényhez igazított karbantartási vagy javítási javaslat készül." }
  ],
  primaryDetail: {
    label: "Mikor volt az utolsó szerviz?",
    placeholder: "Válasszon időszakot",
    options: ["6 hónapon belül", "6–12 hónapja", "Több mint 12 hónapja", "Nem ismert"]
  },
  secondaryDetail: {
    label: "Mennyire sürgős?",
    placeholder: "Válasszon prioritást",
    options: ["Tervezett karbantartás", "Rövid időn belüli egyeztetés", "Aktuális meghibásodás"]
  },
  equipmentBrandLabel: "Berendezés márkája",
  equipmentModelLabel: "Típus / modell"
};

export const compressorReplacementOffer: CustomerOfferConfig = {
  kind: "compressor-replacement",
  pageSource: "kompresszor-csere-ajanlat",
  eyebrow: "Energiahatékony kompresszorcsere",
  title: "Kérjen az üzeméhez illő ipari csavarkompresszor-ajánlatot",
  lead:
    "Új gép beszerzéséhez vagy meglévő kompresszora cseréjéhez kérjen személyre szabott műszaki és kereskedelmi ajánlatot. A teljesítményt, a levegőigényt és a várható energiaköltséget együtt vesszük figyelembe.",
  primaryCta: "Kérek gépajánlatot",
  formTitle: "Csavarkompresszor-ajánlatkérés",
  formLead:
    "Ha nem ismeri minden adatát, a márka, a becsült teljesítmény és a gép kora már jó kiindulópont.",
  benefits: [
    {
      title: "Energiaköltség",
      text: "A várható fogyasztási különbség és az éves üzemóra alapján pénzügyi irányt is adunk."
    },
    {
      title: "Helyes méretezés",
      text: "A levegőigény és a terhelési profil alapján kerülhető el a túl- vagy alulméretezés."
    },
    {
      title: "Üzembiztonság",
      text: "A korszerűbb gép csökkentheti a javítási kockázatot és a nem tervezett leállást."
    }
  ],
  proofPoints: ["adattábla alapján indítható", "helyszíni felmérés kérhető", "megtérülési irány"],
  process: [
    { title: "Adatok bekérése", text: "A jelenlegi gép márkája, kora és névleges teljesítménye az első lépés." },
    { title: "Méretezés", text: "A valós levegőigényhez és terheléshez illő műszaki irányt határozunk meg." },
    { title: "Csereajánlat", text: "A pontosított igényre gépjavaslat és személyre szabott ajánlat készül." }
  ],
  primaryDetail: {
    label: "Becsült névleges teljesítmény",
    placeholder: "Válasszon kW-tartományt",
    options: ["7–22 kW", "23–37 kW", "38–75 kW", "76–160 kW", "161–250 kW", "Nem ismert"]
  },
  secondaryDetail: {
    label: "A jelenlegi gép kora",
    placeholder: "Válasszon korcsoportot",
    options: ["5 évnél fiatalabb", "5–10 éves", "10–15 éves", "15 évnél idősebb", "Nem ismert"]
  },
  equipmentBrandLabel: "Jelenlegi kompresszor márkája",
  equipmentModelLabel: "Típus / modell vagy adattábla-adat"
};

export const nitrogenOffer: CustomerOfferConfig = {
  kind: "nitrogen",
  pageSource: "nitrogen-generator-felulvizsgalat",
  eyebrow: "Helyszíni nitrogén-előállítás",
  title: "Tervezhetőbb nitrogénellátás az üzem valódi igényére méretezve",
  lead:
    "Meglévő generátor felülvizsgálatához vagy palackos és tartályos ellátás kiváltásához kérjen műszaki előszűrést. A tisztaság, a nyomás és a fogyasztás alapján PSA vagy membrános irányt javaslunk.",
  primaryCta: "Kérek műszaki előszűrést",
  formTitle: "Kérjen nitrogénellátási felülvizsgálatot",
  formLead:
    "Nem szükséges kész specifikáció: a jelenlegi ellátás és a kívánt tisztaság már elég az első szakmai egyeztetéshez.",
  benefits: [
    {
      title: "Kiszámítható ellátás",
      text: "A helyi előállítás csökkentheti a szállítási és tárolási függőséget."
    },
    {
      title: "Igényre szabott tisztaság",
      text: "A technológia a tényleges nyomás-, mennyiség- és tisztasági követelményhez választható."
    },
    {
      title: "Meglévő rendszer is",
      text: "Nem csak új beruházás: meglévő nitrogéngenerátor felülvizsgálata is kérhető."
    }
  ],
  proofPoints: ["PSA és membrántechnológia", "meglévő rendszer felülvizsgálata", "ipari méretezés"],
  process: [
    { title: "Jelenlegi ellátás", text: "Rögzítjük, hogy palack, tartály vagy meglévő generátor biztosítja-e a nitrogént." },
    { title: "Műszaki igény", text: "Tisztaság, nyomás, fogyasztás és üzemidő alapján szűkítjük a megoldást." },
    { title: "Javaslat", text: "Felülvizsgálati vagy új rendszerre szóló műszaki és kereskedelmi irány készül." }
  ],
  primaryDetail: {
    label: "Jelenlegi nitrogénellátás",
    placeholder: "Válassza ki a jelenlegi megoldást",
    options: ["Palackos ellátás", "Tartályos / folyékony nitrogén", "Meglévő PSA generátor", "Meglévő membrános generátor", "Nem ismert"]
  },
  secondaryDetail: {
    label: "Elvárt tisztaság",
    placeholder: "Válasszon tisztasági tartományt",
    options: ["90–99%", "99–99,9%", "99,9–99,999%", "Nem ismert"]
  },
  equipmentBrandLabel: "Meglévő berendezés márkája",
  equipmentModelLabel: "Típus / modell"
};
