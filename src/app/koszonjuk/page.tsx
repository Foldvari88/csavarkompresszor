import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MailCheck, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Kalkuláció rögzítve | Ipari csavarkompresszor kalkulátor",
  description:
    "A részletes csavarkompresszor riport kiküldése elindult. Kérjük, ellenőrizze az email fiókot és szükség esetén a spam mappát is.",
  alternates: {
    canonical: "/koszonjuk"
  },
  robots: {
    index: false,
    follow: false
  }
};

export default function ThankYouPage() {
  return (
    <main className="thank-you-shell">
      <section className="thank-you-panel" aria-labelledby="thank-you-title">
        <div className="thank-you-status">
          <span className="thank-you-icon">
            <CheckCircle2 size={30} />
          </span>
          <span>Kalkuláció rögzítve</span>
        </div>

        <div className="thank-you-copy">
          <h1 id="thank-you-title">Köszönjük, hogy elvégezte a kalkulációt.</h1>
          <p>
            A megadott adatok alapján elkészített részletes riportot emailben kiküldtük
            a megadott címre. A dokumentum tartalmazza a számítás fő bemeneti adatait,
            a becsült energia-megtakarítást és a javasolt műszaki irányt.
          </p>
        </div>

        <div className="thank-you-grid" aria-label="Következő lépések">
          <div className="thank-you-card">
            <MailCheck size={22} />
            <strong>Email ellenőrzése</strong>
            <span>
              Ha néhány percen belül nem találja a riportot, kérjük, nézze meg a spam
              vagy promóciók mappát is.
            </span>
          </div>
          <div className="thank-you-card">
            <ShieldCheck size={22} />
            <strong>Adatok rögzítve</strong>
            <span>
              A beküldött műszaki és kapcsolati adatok alapján a riport visszakereshető
              és ellenőrizhető marad.
            </span>
          </div>
        </div>

        <Link className="hero-cta thank-you-cta" href="/">
          Új kalkuláció indítása
          <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  );
}
