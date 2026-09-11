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
  "Legalább 5 éves, más márkájú kompresszorát cserélné CompAir modellre.",
  "A lecserélendő gép bármely más gyártó kompresszora lehet.",
  "A kedvezmény 37-160 kW-os, olajbefecskendezéses csavarkompresszorokra vonatkozik.",
  "160 kW felett, 250 kW-ig egyedi ajánlat kérhető.",
  "A promóció a 2026. július 1. és szeptember 30. között leadott megrendelésekre érvényes."
];

const customerBenefits = [
  {
    icon: Gauge,
    title: "Alacsonyabb energiafelhasználás",
    text: "A gép adatai és az üzemeltetési körülmények alapján megbecsüljük, mennyit takaríthat meg évente az áramköltségen."
  },
  {
    icon: Wrench,
    title: "Kisebb üzemeltetési kockázat",
    text: "Egy korszerű kompresszor csökkentheti a váratlan leállások és a költséges javítások kockázatát."
  },
  {
    icon: LineChart,
    title: "Az üzeméhez illő teljesítmény",
    text: "A gép adatai és a felmért levegőigény alapján segítünk megfelelő méretű kompresszort választani."
  },
  {
    icon: BadgeCheck,
    title: "Becsült megtérülés",
    text: "Az ajánlat és a várható energiamegtakarítás alapján kiszámítható, mennyi idő alatt térülhet meg a kompresszorcsere."
  }
];

const processSteps = [
  {
    icon: FileSearch,
    eyebrow: "01",
    title: "A jelenlegi gép felmérése",
    text: "Első lépésként egyeztetjük a kompresszor adattábláján szereplő adatokat, vagy helyszíni Air-Insite felmérést szervezünk."
  },
  {
    icon: ClipboardCheck,
    eyebrow: "02",
    title: "Gépválasztás és megtakarítás",
    text: "Az üzem levegőigénye és a megadott adatok alapján gépet javasolunk, és megbecsüljük a várható energiamegtakarítást."
  },
  {
    icon: PhoneCall,
    eyebrow: "03",
    title: "CompAir csereajánlat",
    text: "Ellenőrizzük a kedvezmény feltételeit, egyeztetjük a műszaki részleteket, majd elkészítjük az ajánlatot."
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
    name: "Ajánlatkérés CompAir csavarkompresszorra",
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

          <div className="campaign-brand-lockup">
            <Image
              alt="CompAir"
              className="campaign-brand-logo"
              height={98}
              priority
              src="/images/compair-products/compair-logo.png"
              width={266}
            />
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
            <span>CompAir csavarkompresszor</span>{" "}
            <span>cserére</span>
          </h1>
          <p>
            Régi ipari csavarkompresszor cseréjén gondolkodik? Ha 5 évnél
            idősebb gépét energiahatékony CompAir modellre cseréli, a promóció
            feltételeinek teljesülése esetén akár 15% extra kedvezményt kaphat.
            Adja meg jelenlegi gépe adatait, vagy kérjen helyszíni felmérést!
            Segítünk kiválasztani az üzeméhez illő kompresszort, és megbecsüljük
            a várható energiamegtakarítást.
          </p>

          <div className="campaign-conversion-panel" aria-label="A promóció fő feltételei">
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

          <div className="campaign-proof-row" aria-label="A kompresszorcsere előnyei és feltételei">
            <span>
              <Gauge size={17} />
              37-160 kW teljesítmény
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
            A kedvezmény a feltételeknek megfelelő kompresszorcserére,
            2026. szeptember 30-ig leadott megrendelés esetén érvényes.
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
            <h2>Kérjen ajánlatot kompresszora cseréjére</h2>
            <p>
              Adja meg elérhetőségét és jelenlegi kompresszora adatait!
              Felvesszük Önnel a kapcsolatot, egyeztetjük a kedvezmény
              feltételeit, és segítünk kiválasztani a megfelelő CompAir
              modellt. Helyszíni felmérést is kérhet.
            </p>
            <ul className="campaign-check-list">
              <li>
                <CheckCircle2 size={17} />
                Első lépésként a kompresszor adattábláján szereplő adatok is elegendők.
              </li>
              <li>
                <CheckCircle2 size={17} />
                A promóció 37-160 kW-os csavarkompresszorokra vonatkozik.
              </li>
              <li>
                <CheckCircle2 size={17} />
                Változó levegőigény esetén fordulatszám-szabályozott modellt is ajánlunk.
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
              Megtakarítás
            </span>
            <h2>Tudja meg, mennyit takaríthat meg a kompresszorcserével</h2>
            <p>
              Egy korszerű CompAir kompresszorral csökkenhet az
              energiafogyasztás és az üzemeltetési költség. A jelenlegi gép
              adatai és használati körülményei alapján megbecsüljük a várható
              megtakarítást, és ellenőrizzük, milyen kedvezményt vehet igénybe.
            </p>
          </div>

          <div className="campaign-message-panel">
            <strong>Mit kell megadni?</strong>
            <p>
              A jelenlegi kompresszor márkáját, típusát, névleges
              teljesítményét, sorozatszámát és korát. Ezeket jellemzően az
              adattáblán találja. Ha rendelkezik Air-Insite felmérés
              eredményével, azt is felhasználhatjuk.
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
            A promóció feltételei
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
          <h2>Így kérhet ajánlatot a kompresszorcserére</h2>
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
          <h2 id="compair-faq">Kérdések a CompAir cserepromócióról</h2>
        </div>
        <div className="campaign-faq-grid">
          <details>
            <summary>Milyen márkájú kompresszort cserélhetek le?</summary>
            <p>
              Bármely más gyártó ipari csavarkompresszorát, ha a gép legalább
              5 éves és megfelel a promóció feltételeinek.
            </p>
          </details>
          <details>
            <summary>Elég az adattábla, vagy kötelező a helyszíni audit?</summary>
            <p>
              Első lépésben az adattábla adatai is elegendők. Pontos
              méretezéshez és végleges ajánlathoz helyszíni ellenőrzés javasolt.
            </p>
          </details>
          <details>
            <summary>Mi történik 160 kW feletti gépnél?</summary>
            <p>
              160 kW felett, 250 kW-ig egyedi ajánlatot adunk a műszaki
              igények és a kedvezmény feltételeinek egyeztetése után.
            </p>
          </details>
        </div>
      </section>

      <footer className="legal-footer">
        <div className="container legal-footer-inner">
          <div>
            <strong>iparikalkulator.hu</strong>
            <p>
              Független ipari energiahatékonysági előkalkuláció. A kedvezmény
              pontos mértékét és feltételeit az ajánlatadás során egyeztetjük.
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
