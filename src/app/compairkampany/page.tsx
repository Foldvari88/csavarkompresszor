import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarRange,
  CheckCircle2,
  ClipboardCheck,
  Factory,
  FileSearch,
  Gauge,
  LineChart,
  PhoneCall,
  SearchCheck,
  ShieldCheck,
  Wrench,
  Zap
} from "lucide-react";
import { CompairCampaignForm } from "@/components/compair-campaign-form";
import { CompairPhoneCta } from "@/components/compair-phone-cta";
import { absoluteUrl, siteName } from "@/lib/seo";

const campaignTitle = "Akár 15% extra CompAir cserekedvezmény szeptember 30-ig";
const campaignDescription =
  "Szeptember 30-ig akár 15% extra kedvezmény érhető el 5 évnél idősebb ipari csavarkompresszor energiahatékony CompAir modellre cserélésekor.";

export const metadata: Metadata = {
  title: campaignTitle,
  description: campaignDescription,
  alternates: {
    canonical: "/compairkampany"
  },
  openGraph: {
    type: "website",
    locale: "hu_HU",
    siteName,
    title: campaignTitle,
    description: campaignDescription,
    url: absoluteUrl("/compairkampany"),
    images: [
      {
        url: "/images/compair-products/compair-official-product-range.png",
        width: 2048,
        height: 1101,
        alt: "CompAir ipari csavarkompresszor termékkínálat"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: campaignTitle,
    description: campaignDescription,
    images: ["/images/compair-products/compair-official-product-range.png"]
  }
};

const eligibilityItems = [
  "A jelenlegi kompresszor versenytárs márka és legalább 5 éves.",
  "Bármely meglévő kompresszor márka vizsgálható a csereelőszűrésben.",
  "Fókusz: olajbefecskendezéses csavarkompresszorok 37-160 kW között.",
  "250 kW-ig egyedi projektként, külön egyeztetéssel kezelhető.",
  "A promóciós időszak: 2026. július 1. - szeptember 30."
];

const customerBenefits = [
  {
    icon: Gauge,
    title: "Alacsonyabb energiafelhasználás",
    text: "A régi gép adatai alapján előzetesen láthatóvá válik, mekkora éves kWh- és költségkülönbség lehet reális."
  },
  {
    icon: Wrench,
    title: "Kisebb üzemeltetési kockázat",
    text: "Az idős kompresszorok cseréje nem csak beruházás: termelésbiztonsági és szervizköltség oldalon is döntési pont."
  },
  {
    icon: LineChart,
    title: "Adatalapú méretezés",
    text: "Az audit vagy adattábla információ segít elkerülni a túlméretezett, feleslegesen drága sűrített levegő kapacitást."
  },
  {
    icon: BadgeCheck,
    title: "Jobban védhető ROI",
    text: "Az ajánlat nem pusztán kedvezményről szól, hanem számszerűsített megtakarítási és megtérülési előszűrésről."
  }
];

const processSteps = [
  {
    icon: FileSearch,
    eyebrow: "01",
    title: "Air-Insite audit vagy adattábla",
    text: "A helyszíni felmérés vagy a régi gép adattáblája megadja a márkát, teljesítményt, kort és azonosítókat."
  },
  {
    icon: ClipboardCheck,
    eyebrow: "02",
    title: "Energia- és gépelőszűrés",
    text: "A megadott adatokból becsült fogyasztási különbség, gépkategória és csereprioritás készül."
  },
  {
    icon: PhoneCall,
    eyebrow: "03",
    title: "CompAir csereajánlat",
    text: "A promóciós jogosultság ellenőrzése után jöhet a pontos műszaki egyeztetés és az ajánlat."
  }
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: campaignTitle,
  url: absoluteUrl("/compairkampany"),
  inLanguage: "hu-HU",
  description: campaignDescription,
  about: {
    "@type": "Service",
    name: "CompAir csavarkompresszor csereelőszűrés",
    areaServed: "HU",
    provider: {
      "@type": "Organization",
      name: siteName,
      url: absoluteUrl("/")
    }
  },
  offers: {
    "@type": "Offer",
    availabilityStarts: "2026-07-01",
    availabilityEnds: "2026-09-30",
    itemOffered: {
      "@type": "Product",
      name: "CompAir olajbefecskendezéses csavarkompresszor 37-160 kW"
    }
  }
};

export default function CompairCampaignPage() {
  return (
    <main className="campaign-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <header className="campaign-header">
        <div className="container campaign-nav">
          <Link className="campaign-home-link" href="/">
            <span className="campaign-home-mark" aria-hidden="true">
              <Factory size={18} />
            </span>
            <span>iparikalkulator.hu</span>
          </Link>

          <div className="campaign-brand-lockup" aria-label="CompAir kampány">
            <span className="compair-symbol" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <strong>CompAir</strong>
          </div>

          <CompairPhoneCta className="campaign-header-phone" location="header" />
        </div>
      </header>

      <section className="container campaign-hero">
        <div className="campaign-hero-copy">
          <span className="campaign-eyebrow">
            <CalendarRange size={16} />
            CompAir promóció szeptember 30-ig
          </span>
          <h1>
            <span>Akár 15% extra</span>{" "}
            <span>kedvezmény</span>{" "}
            <span>ipari csavarkompresszor</span>{" "}
            <span>cserére</span>
          </h1>
          <p>
            Régi ipari csavarkompresszor cseréjén gondolkodik? Ha 5 évnél
            idősebb gépét energiahatékony CompAir modellre cseréli, jogosult
            projekt esetén extra kedvezmény nyílhat. Audit vagy
            adattábla-adatok alapján előszűrjük, milyen gépkategória és
            megtakarítási potenciál lehet reális kiindulópont.
          </p>

          <div className="campaign-conversion-panel" aria-label="Előszűrési előnyök">
            <div>
              <span>akár</span>
              <strong>15 % extra kedvezmény</strong>
            </div>
            <div>
              <span>határidő</span>
              <strong>szept. 30.</strong>
            </div>
            <div>
              <span>feltétel</span>
              <strong>5+ éves gép</strong>
            </div>
          </div>

          <div className="campaign-hero-actions">
            <a className="campaign-primary-cta" href="#ajanlatkeres">
              Nézzük meg, jogosult vagyok-e?
              <ArrowRight size={18} />
            </a>
            <a className="campaign-secondary-cta" href="#feltetelek">
              Feltételek megtekintése
            </a>
          </div>

          <div className="campaign-proof-row" aria-label="Kampány fókuszpontok">
            <span>
              <Gauge size={17} />
              37-160 kW fókusz
            </span>
            <span>
              <ShieldCheck size={17} />
              5+ éves gépek
            </span>
            <span>
              <Zap size={17} />
              energiaköltség-csökkentés
            </span>
          </div>

          <p className="campaign-urgency-strip">
            A promóció szeptember 30-ig érvényes, jogosult CompAir
            csereprojektekre vonatkozik.
          </p>
        </div>

        <div className="campaign-product-stage" aria-label="CompAir termékképek">
          <div className="campaign-machine-card">
            <span className="campaign-machine-kicker">CompAir termékkínálat</span>
            <Image
              alt="CompAir ipari csavarkompresszor termékkínálat"
              className="campaign-machine campaign-machine-primary"
              height={1101}
              priority
              src="/images/compair-products/compair-official-product-range.png"
              width={2048}
            />
          </div>
        </div>
      </section>

      <section className="campaign-form-band" id="ajanlatkeres">
        <div className="container campaign-form-layout">
          <div className="campaign-form-copy">
            <span className="campaign-eyebrow compact">
              <BadgeCheck size={15} />
              Ajánlatkérés
            </span>
            <h2>Kérjen CompAir csereelőszűrést vagy audit egyeztetést</h2>
            <p>
              A beküldés után a lead a meglévő iparikalkulator.hu folyamatba
              érkezik: előzetes fogyasztási számítás, gépkategória-javaslat és
              kampánykontextus kerül a háttérbe.
            </p>
            <ul className="campaign-check-list">
              <li>
                <CheckCircle2 size={17} />
                Versenytárs gép adattábla vagy helyszíni audit alapján indul.
              </li>
              <li>
                <CheckCircle2 size={17} />
                A 37-160 kW-os tartomány a fő kampányfókusz.
              </li>
              <li>
                <CheckCircle2 size={17} />
                Változó levegőigénynél a fordulatszám-szabályozott irányt is
                előszűri.
              </li>
            </ul>
          </div>

          <CompairCampaignForm />
        </div>
      </section>

      <section className="campaign-benefit-band">
        <div className="container campaign-section-grid">
          <div className="campaign-section-intro">
            <span className="campaign-eyebrow compact">
              <SearchCheck size={15} />
              Kulcsüzenet
            </span>
            <h2>Audit vagy adattábla alapján nyitható meg a csereelőny</h2>
            <p>
              A kampány célja, hogy a lassuló ipari piacon a meglévő,
              elöregedő kompresszorok cseréjét ne csak árkedvezmény, hanem
              mérhető energia- és üzemeltetési érv támogassa.
            </p>
          </div>

          <div className="campaign-message-panel">
            <strong>Mit kell megadni?</strong>
            <p>
              Air-Insite audit eredmény vagy a lecserélendő versenytárs gép
              adattábla információja: márka, típus, névleges teljesítmény,
              sorozatszám és kor.
            </p>
          </div>
        </div>

        <div className="container campaign-benefit-grid" aria-label="Vevői előnyök">
          {customerBenefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <article className="campaign-feature-card" key={benefit.title}>
                <Icon size={21} />
                <h3>{benefit.title}</h3>
                <p>{benefit.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="container campaign-criteria-section" id="feltetelek">
        <div className="campaign-section-head">
          <span className="campaign-eyebrow compact">
            <ShieldCheck size={15} />
            Jogosultság és scope
          </span>
          <h2>Kinek szól a CompAir cserepromóció?</h2>
        </div>

        <div className="campaign-criteria-grid">
          {eligibilityItems.map((item) => (
            <div className="campaign-criteria-item" key={item}>
              <CheckCircle2 size={18} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="campaign-process-band">
        <div className="container campaign-section-head">
          <span className="campaign-eyebrow compact">
            <ClipboardCheck size={15} />
            Folyamat
          </span>
          <h2>Három lépésben lesz a kampányérdeklődésből validált csereprojekt</h2>
        </div>

        <div className="container campaign-process-grid">
          {processSteps.map((step) => {
            const Icon = step.icon;
            return (
              <article className="campaign-process-card" key={step.title}>
                <span className="campaign-step-number">{step.eyebrow}</span>
                <Icon size={24} />
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="container campaign-faq-section" aria-labelledby="compair-faq">
        <div className="campaign-section-head">
          <span className="campaign-eyebrow compact">
            <SearchCheck size={15} />
            Gyakori kérdések
          </span>
          <h2 id="compair-faq">Rövid válaszok a kampányhoz</h2>
        </div>
        <div className="campaign-faq-grid">
          <details>
            <summary>Mi számít versenytárs kompresszornak?</summary>
            <p>
              Minden nem CompAir márkájú, meglévő ipari csavarkompresszor
              vizsgálható, ha legalább 5 éves és a csere műszakilag indokolt.
            </p>
          </details>
          <details>
            <summary>Elég az adattábla, vagy kötelező a helyszíni audit?</summary>
            <p>
              Első lépésben az adattábla is elég lehet az előszűréshez. Pontos
              méretezéshez és végleges ajánlathoz helyszíni ellenőrzés javasolt.
            </p>
          </details>
          <details>
            <summary>Mi történik 160 kW feletti gépnél?</summary>
            <p>
              250 kW-ig egyedi projektként kezelhető az érdeklődés, külön
              műszaki és kereskedelmi egyeztetéssel.
            </p>
          </details>
        </div>
      </section>

      <footer className="legal-footer">
        <div className="container legal-footer-inner">
          <div>
            <strong>iparikalkulator.hu</strong>
            <p>
              Független ipari energiahatékonysági előkalkuláció. A kampányjogosultság
              végleges ellenőrzése egyedi egyeztetés alapján történik.
            </p>
          </div>
          <nav aria-label="Jogi információk">
            <a href="/adatkezeles">Adatkezelés</a>
            <a href="/aszf">Felhasználási feltételek</a>
            <a href="/impresszum">Impresszum</a>
            <a href="/sutik">Süti tájékoztató</a>
          </nav>
        </div>
      </footer>

    </main>
  );
}
