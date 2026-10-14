import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Factory,
  Gauge,
  ShieldCheck,
  Wrench
} from "lucide-react";
import { CustomerOfferForm } from "@/components/customer-offer-form";
import type { CustomerOfferConfig } from "@/lib/customer-offers";

export function CustomerOfferPage({ config }: { config: CustomerOfferConfig }) {
  const isReplacement = config.kind === "compressor-replacement";

  return (
    <main className={`reactivation-page reactivation-${config.kind}`}>
      <header className="reactivation-header">
        <div className="reactivation-container reactivation-nav">
          <Link className="reactivation-brand" href="/ugyfel-ajanlat">
            <span className="reactivation-brand-mark">IMEX</span>
            <span>
              <strong>Szerviztechnika</strong>
              <small>szakmai ajánlatkérés</small>
            </span>
          </Link>
          <a className="reactivation-phone" href="tel:+3656514720">
            +36 56 514 720
          </a>
        </div>
      </header>

      <section className="reactivation-hero">
        <div className="reactivation-container reactivation-hero-grid">
          <div className="reactivation-hero-copy">
            <span className="reactivation-eyebrow">
              <BadgeCheck size={17} />
              {config.eyebrow}
            </span>
            <h1>{config.title}</h1>
            <p>{config.lead}</p>
            <div className="reactivation-actions">
              <a className="reactivation-primary-cta" href="#ajanlatkeres">
                {config.primaryCta}
                <ArrowRight size={19} />
              </a>
              <a className="reactivation-secondary-cta" href="#hogyan-mukodik">
                Így működik
              </a>
            </div>
            <div className="reactivation-proof-row">
              {config.proofPoints.map((point) => (
                <span key={point}>
                  <CheckCircle2 size={16} />
                  {point}
                </span>
              ))}
            </div>
          </div>

          <div className="reactivation-visual">
            {isReplacement ? (
              <Image
                alt="CompAir ipari csavarkompresszor termékkínálat"
                className="reactivation-product-image"
                height={1101}
                priority
                sizes="(max-width: 900px) 92vw, 44vw"
                src="/images/compair-products/compair-official-product-range.png"
                width={2048}
              />
            ) : (
              <div
                aria-label="Ipari levegőtechnikai megoldás"
                className="reactivation-icon-stage"
                role="img"
              >
                <Factory size={72} />
                <div>
                  {config.kind === "service" ? <Wrench size={42} /> : <Gauge size={42} />}
                  <ShieldCheck size={42} />
                </div>
                <strong>{config.kind === "service" ? "Üzembiztonság" : "Helyi gázellátás"}</strong>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="reactivation-benefit-band">
        <div className="reactivation-container reactivation-benefit-grid">
          {config.benefits.map((benefit) => (
            <article key={benefit.title}>
              <CheckCircle2 size={22} />
              <h2>{benefit.title}</h2>
              <p>{benefit.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="reactivation-form-band">
        <div className="reactivation-container reactivation-form-layout">
          <div className="reactivation-form-intro">
            <span className="reactivation-section-kicker">Első szakmai lépés</span>
            <h2>Nem kell minden műszaki adatot előre ismernie</h2>
            <p>
              Adja meg, ami most rendelkezésre áll. A hiányzó adatokat az első
              egyeztetésen pontosítjuk, így az ajánlat valódi üzemi igényre készülhet.
            </p>
            <ul>
              <li><CheckCircle2 size={18} />Rövid, témára szabott űrlap</li>
              <li><CheckCircle2 size={18} />Nincs automatikus vásárlási kötelezettség</li>
              <li><CheckCircle2 size={18} />Műszaki szakemberhez kerül a megkeresés</li>
            </ul>
          </div>
          <CustomerOfferForm config={config} />
        </div>
      </section>

      <section className="reactivation-process" id="hogyan-mukodik">
        <div className="reactivation-container">
          <div className="reactivation-section-heading">
            <span className="reactivation-section-kicker">Átlátható folyamat</span>
            <h2>Az ajánlatkérés három lépése</h2>
          </div>
          <div className="reactivation-process-grid">
            {config.process.map((step, index) => (
              <article key={step.title}>
                <span>0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="reactivation-footer">
        <div className="reactivation-container">
          <div>
            <strong>IMEX szakmai ajánlatkérés</strong>
            <p>Az ajánlatkérési felületet az iparikalkulator.hu üzemelteti.</p>
          </div>
          <nav aria-label="Jogi információk">
            <Link href="/adatkezeles">Adatkezelés</Link>
            <Link href="/impresszum">Impresszum</Link>
            <Link href="/sutik">Sütik</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
