export type BlogSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  formula?: string;
  table?: { caption: string; headers: string[]; rows: string[][] };
  sourceIds?: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  seoTitle: string;
  journey: BlogJourney;
  intro: string[];
  takeaways: string[];
  sections: BlogSection[];
  faq: { question: string; answer: string }[];
  cta: { title: string; text: string };
  relatedSlugs: string[];
};

export type BuyerRole = "owner" | "technical" | "procurement";
export type BlogStage = "discovery" | "comparison" | "decision";

export type BlogJourney = {
  title: string;
  seoTitle: string;
  description: string;
  stage: BlogStage;
  audience: BuyerRole[];
  intro: string[];
  quickAnswer: string;
  outcome: string;
  decisionSection: BlogSection;
  checklist: string[];
  objections: { question: string; answer: string }[];
  midCta: { title: string; text: string };
  finalCta: { title: string; text: string };
  offer: "replacement" | "service";
  offerLabel: string;
  offerText: string;
  nextSlug: string;
  nextReason: string;
};

export type BlogArticle = Omit<BlogPost, "updatedAt" | "seoTitle" | "journey"> & { updatedAt?: string };

export const blogSources: Record<string, { title: string; url: string }> = {
  serviceSchedule: {"title":"Chicago Pneumatic: a kompresszorszerviz gyakorisága és a gépkönyv szerepe","url":"https://compressors.cp.com/hu-hu/expert-corner/blog/how-often-do-i-have-to-service-my-compressor"},
  serviceChecks: {"title":"Kaeser: elektromos csavarkompresszorok karbantartási ellenőrzőlistája","url":"https://us.kaeser.com/compressed-air-resources/compressed-air-tips/compressor-maintenance-checklist.aspx"},
  dryerDesiccant: { title: "Atlas Copco Magyarország: az adszorpciós szárítók működése és regenerálása", url: "https://www.atlascopco.com/hu-hu/compressors/wiki/compressed-air-articles/what-is-desiccant-air-dryer" },
  dryerSelection: {"title":"Kaeser: hűtveszárítók és adszorpciós szárítók kiválasztása","url":"https://us.kaeser.com/compressed-air-resources/compressed-air-tips/compressed-air-treatment-guide/dryer-selection-guide.aspx"},
  dryerSourcebook: {"title":"U.S. Department of Energy: sűrítettlevegő-szárítás és rendszerköltség (2016)","url":"https://www.energy.gov/sites/default/files/2016/03/f30/Improving%20Compressed%20Air%20Sourcebook%20version%203.pdf"},
  dryerMaintenance: {"title":"Kaeser: sűrítettlevegő-szárítók karbantartása","url":"https://us.kaeser.com/compressed-air-resources/kaeser-talks-shop/air-dryer-maintenance.aspx"},
  dryerLocal: {"title":"Kaeser: adszorpciós szárítás méretezése és helyi alkalmazása","url":"https://us.kaeser.com/compressed-air-resources/kaeser-talks-shop/desiccant-dryers-part-two.aspx"},
  printingAir: { title: "Becker: nyomdai nyomó- és vákuumellátás", url: "https://www.becker-international.com/de/en/products/combined-pressure-vacuum-pumps.htm" },
  vehicleAir: { title: "Chicago Pneumatic: a levegőigény és az egyidejű használat", url: "https://compressors.cp.com/en-us/north-america/understanding-compressed-air" },
  foodAir: { title: "Parker: a sűrített levegő szennyeződése az élelmiszeriparban", url: "https://www.parker.com/content/dam/Parker-com/Literature/IGFG/PDF-Files/Compressed_Air_Contamination_Food_Industry.pdf" },
  airPurity: { title: "Atlas Copco: útmutató a levegőminőség követelményeihez", url: "https://www.atlascopco.com/content/dam/atlas-copco/compressor-technique/oil-free-air/documents/ISO%20regulations%20best%20practices%20guide.pdf" },
  woodAir: { title: "Kaeser: sűrített levegő és vákuum a faiparban", url: "https://us.kaeser.com/compressed-air-resources/applications/wood-product-manufacturing/" },
  packagingAir: { title: "SMC: pneumatikai megoldások a csomagolóiparban", url: "https://media.smc.eu/asset/4f141a85-48c0-4740-a56c-b68b7fd60f7f/Packaging-EN.pdf" },
  plasticAir: { title: "Atlas Copco: eltérő levegőfeladatok a műanyag-palack gyártásában", url: "https://www.atlascopco.com/en-in/compressors/air-compressor-blog/compressed-air-systems-for-pet-bottle-and-plastic-blow-moulding" },
  haasAir: {
    title: "Haas VF-4SS előtelepítési útmutató: a gép levegőellátása",
    url: "https://legacy-aem.haascnc.com/owners/pre-install-guide/mills-pre-install/VF-4SS.html"
  },
  cost: {
    title: "U.S. Department of Energy: Determine the Cost of Compressed Air for Your Plant",
    url: "https://www.energy.gov/sites/default/files/2014/05/f16/compressed_air1.pdf"
  },
  leaks: {
    title: "U.S. Department of Energy: Minimize Compressed Air Leaks",
    url: "https://www.energy.gov/sites/prod/files/2014/05/f16/compressed_air3.pdf"
  },
  analysis: {
    title: "U.S. Department of Energy: Analyzing Your Compressed Air System",
    url: "https://www.energy.gov/sites/default/files/2014/05/f16/compressed_air4.pdf"
  },
  maintenance: {
    title: "U.S. Department of Energy: Preventive Maintenance Strategies for Compressed Air Systems",
    url: "https://www.energy.gov/sites/default/files/2014/05/f16/compressed_air6.pdf"
  },
  controls: {
    title: "U.S. Department of Energy: Compressed Air System Control Strategies",
    url: "https://www.energy.gov/sites/default/files/2014/05/f16/compressed_air7.pdf"
  },
  pressure: {
    title: "U.S. Department of Energy: Stabilizing System Pressure",
    url: "https://www.energy.gov/sites/default/files/2014/05/f16/compressed_air8.pdf"
  },
  quality: {
    title: "U.S. Department of Energy: Maintaining System Air Quality",
    url: "https://www.energy.gov/sites/default/files/2014/05/f16/compressed_air12.pdf"
  },
  heat: {
    title: "Compressed Air Challenge: Heat Recovery with Compressed Air Systems",
    url: "https://www.compressedairchallenge.org/data/sites/1/media/library/factsheets/factsheet10.pdf"
  },
  guide: {
    title: "Natural Resources Canada: Energy Efficiency Reference Guide — Compressed Air",
    url: "https://natural-resources.canada.ca/energy-efficiency/energy-star/energy-efficiency-reference-guide-compressed-air"
  },
  sourcebook: {
    title: "U.S. Department of Energy: Improving Compressed Air System Performance",
    url: "https://www.energy.gov/sites/default/files/2014/05/f16/compressed_air_sourcebook.pdf"
  }
};
