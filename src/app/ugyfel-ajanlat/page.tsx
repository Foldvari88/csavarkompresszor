import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Factory,
  Gauge,
  ShieldCheck,
  Wrench,
  Zap
} from "lucide-react";
import { isCompairPromotionActive } from "@/lib/promotions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Szakmai ajánlat meglévő ipari berendezéshez",
  description:
    "Válasszon kompresszorszervizt, csavarkompresszor-cserét vagy nitrogéngenerátor-felülvizsgálatot, és kérjen célzott szakmai ajánlatot.",
  alternates: { canonical: "/ugyfel-ajanlat" }
};

const offerCards = [
  {
    title: "Kompresszorszerviz",
    text: "Tervezett karbantartás, javítás vagy vegyes ipari géppark szervizelése.",
    href: "/kompresszor-szerviz-ajanlat",
    cta: "Szervizajánlatot kérek",
    icon: Wrench,
    points: ["országos kiszállás", "14 fős technikusi csapat", "vegyes géppark"]
  },
  {
    title: "Csavarkompresszor-csere",
    text: "Régi gép cseréjének műszaki és energiaköltség-alapú előszűrése.",
    href: "/kompresszor-csere-ajanlat",
    cta: "Csere-előszűrést kérek",
    icon: Zap,
    points: ["adattábla alapján indítható", "méretezési segítség", "megtérülési irány"]
  },
  {
    title: "Nitrogéngenerátor",
    text: "Meglévő rendszer felülvizsgálata vagy helyi nitrogén-előállítás tervezése.",
    href: "/nitrogen-generator-felulvizsgalat",
    cta: "Műszaki előszűrést kérek",
    icon: Gauge,
    points: ["PSA vagy membrán", "tisztaság és nyomás", "ellátási költség"]
  }
] as const;

export default function CustomerOfferHubPage() {
  const promotionActive = isCompairPromotionActive();

  return (
    <main className="offer-hub-page">
      <header className="reactivation-header">
        <div className="reactivation-container reactivation-nav">
          <Link className="reactivation-brand" href="/">
            <span className="reactivation-brand-mark">IMEX</span>
            <span>
              <strong>Szerviztechnika</strong>
              <small>szakmai ajánlatkérés</small>
            </span>
          </Link>
          <a className="reactivation-phone" href="tel:+3656514720">+36 56 514 720</a>
        </div>
      </header>

      <section className="offer-hub-hero">
        <div className="reactivation-container">
          <span className="reactivation-eyebrow"><ShieldCheck size={17} />Meglévő ipari partnereknek</span>
          <h1>Miben segíthetünk a következő műszaki lépésben?</h1>
          <p>
            Válassza ki a leginkább aktuális területet. Minden ajánlat külön,
            rövid űrlapra visz, így a megkeresés közvetlenül a megfelelő szakmai témával érkezik.
          </p>
        </div>
      </section>

      {promotionActive ? (
        <section className="offer-promotion-strip">
          <div className="reactivation-container">
            <div>
              <Factory size={24} />
              <span>
                <strong>CompAir cserepromóció 2026. szeptember 30-ig</strong>
                5+ éves, 37–160 kW-os gépeknél akár 15% extra kedvezmény feltételekkel.
              </span>
            </div>
            <Link href="/compairkampany">Feltételek és ajánlat <ArrowRight size={18} /></Link>
          </div>
        </section>
      ) : null}

      <section className="reactivation-container offer-card-grid" aria-label="Ajánlati területek">
        {offerCards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.title}>
              <span className="offer-card-icon"><Icon size={28} /></span>
              <h2>{card.title}</h2>
              <p>{card.text}</p>
              <ul>
                {card.points.map((point) => <li key={point}>{point}</li>)}
              </ul>
              <Link href={card.href}>{card.cta}<ArrowRight size={18} /></Link>
            </article>
          );
        })}
      </section>

      <footer className="reactivation-footer">
        <div className="reactivation-container">
          <div><strong>IMEX szakmai ajánlatkérés</strong><p>Az ajánlatkérési felületet az iparikalkulator.hu üzemelteti.</p></div>
          <nav aria-label="Jogi információk"><Link href="/adatkezeles">Adatkezelés</Link><Link href="/impresszum">Impresszum</Link><Link href="/sutik">Sütik</Link></nav>
        </div>
      </footer>
    </main>
  );
}
