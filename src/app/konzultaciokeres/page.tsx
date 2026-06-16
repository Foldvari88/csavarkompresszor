import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, PhoneCall, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: {
    absolute: "Konzultációs visszahívás rögzítve | iparikompresszor.hu"
  },
  description:
    "Ingyenes konzultációs visszahívási igényét megkaptuk, kollégáink hamarosan keresni fogják a megadott elérhetőségeken.",
  alternates: {
    canonical: "https://iparikompresszor.hu/konzultaciokeres"
  },
  robots: {
    index: false,
    follow: false
  }
};

export default function ConsultationRequestThankYouPage() {
  return (
    <main className="thank-you-shell">
      <section className="thank-you-panel" aria-labelledby="thank-you-title">
        <div className="thank-you-status">
          <span className="thank-you-icon">
            <CheckCircle2 size={30} />
          </span>
          <span>Visszahívási kérés rögzítve</span>
        </div>

        <div className="thank-you-copy">
          <h1 id="thank-you-title">Köszönjük, megkaptuk az ingyenes konzultációs igényét.</h1>
          <p>
            Ingyenes konzultáció igényét megkaptuk, kollégáink hamarosan keresni fogják Önt
            a megadott elérhetőségeken.
          </p>
        </div>

        <div className="thank-you-grid" aria-label="Következő lépések">
          <div className="thank-you-card">
            <PhoneCall size={22} />
            <strong>Kollégáink keresni fogják</strong>
            <span>
              A megadott kapcsolati adatok alapján röviden egyeztetjük az ipari kompresszorral
              kapcsolatos igényeket.
            </span>
          </div>
          <div className="thank-you-card">
            <ShieldCheck size={22} />
            <strong>Adatok rögzítve</strong>
            <span>
              A visszahívási kéréshez megadott kapcsolati adatok alapján tudjuk felvenni Önnel
              a kapcsolatot.
            </span>
          </div>
        </div>

        <Link className="hero-cta thank-you-cta" href="https://iparikompresszor.hu">
          Vissza az oldalra
          <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  );
}
