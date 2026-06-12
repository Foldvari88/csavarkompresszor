import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MailCheck, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Kalkuláció rögzítve | Ipari csavarkompresszor kalkulátor",
  description:
    "A részletes csavarkompresszor riport kiküldése elindult, vagy a visszahívási kérés rögzítésre került.",
  alternates: {
    canonical: "/koszonjuk"
  },
  robots: {
    index: false,
    follow: false
  }
};

export default async function ThankYouPage({
  searchParams
}: {
  searchParams: Promise<{ visszahivas?: string }>;
}) {
  const params = await searchParams;
  const isCallbackRequest = params.visszahivas === "1";

  return (
    <main className="thank-you-shell">
      <section className="thank-you-panel" aria-labelledby="thank-you-title">
        <div className="thank-you-status">
          <span className="thank-you-icon">
            <CheckCircle2 size={30} />
          </span>
          <span>{isCallbackRequest ? "Visszahívási kérés rögzítve" : "Kalkuláció rögzítve"}</span>
        </div>

        <div className="thank-you-copy">
          <h1 id="thank-you-title">
            {isCallbackRequest
              ? "Köszönjük, kollégáink hamarosan keresik telefonos konzultáció kapcsán."
              : "Köszönjük, hogy elvégezte a kalkulációt."}
          </h1>
          {isCallbackRequest ? (
            <p>
              A visszahívási kérést rögzítettük, és továbbítottuk kollégáinknak. A megadott
              telefonszámon keresni fogjuk, hogy röviden egyeztessünk a csavarkompresszor
              kalkulációról és a következő szakmai lépésekről.
            </p>
          ) : (
            <p>
              A megadott adatok alapján elkészített részletes riportot emailben kiküldtük
              a megadott címre. A dokumentum tartalmazza a számítás fő bemeneti adatait,
              a becsült energia-megtakarítást és a javasolt műszaki irányt.
            </p>
          )}
        </div>

        <div className="thank-you-grid" aria-label="Következő lépések">
          <div className="thank-you-card">
            <MailCheck size={22} />
            <strong>Email ellenőrzése</strong>
            <span>
              Ha riportot is kért, és néhány percen belül nem találja, kérjük, nézze meg a
              spam vagy promóciók mappát is.
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
