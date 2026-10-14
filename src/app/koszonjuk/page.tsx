import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MailCheck, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Kalkuláció rögzítve | iparikalkulator.hu",
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
  searchParams: Promise<{ visszahivas?: string; email?: string }>;
}) {
  const params = await searchParams;
  const isCallbackRequest = params.visszahivas === "1";
  const emailDelayed = params.email === "kesik";

  return (
    <main className="thank-you-shell">
      <section className="thank-you-panel" aria-labelledby="thank-you-title">
        <div className="thank-you-status">
          <span className="thank-you-icon" aria-hidden="true">
            <Image className="thank-you-logo" src="/icon.svg" alt="" width={42} height={42} />
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
              {emailDelayed
                ? "A kalkulációt és az elérhetőségeit rögzítettük. Az e-mailes riport küldése most nem sikerült; kérjük, ne küldje be újra az űrlapot. A rögzített adatok az ügyintéző számára visszakereshetők."
                : "A kalkulációt rögzítettük, az e-mailes riport küldését elindítottuk. A dokumentum a számítás adatait, a becsült energiamegtakarítást és a javasolt műszaki irányt tartalmazza."}
            </p>
          )}
        </div>

        <div className="thank-you-grid" aria-label="Következő lépések">
          <div className="thank-you-card">
            <MailCheck size={22} />
            <strong>{emailDelayed ? "A kalkuláció megmarad" : "Email ellenőrzése"}</strong>
            <span>
              {emailDelayed ? "A küldési hiba nem törli az elmentett kalkulációt és kapcsolati adatokat." : "Ha riportot is kért, és néhány percen belül nem találja, kérjük, nézze meg a spam vagy promóciók mappát is."}
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
