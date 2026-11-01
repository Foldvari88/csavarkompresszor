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

export type BlogArticle = Omit<BlogPost, "updatedAt" | "seoTitle" | "journey">;

export const blogSources: Record<string, { title: string; url: string }> = {
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
