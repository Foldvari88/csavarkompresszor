import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MailCheck, ShieldCheck } from "lucide-react";
import { blogContextCatalog, contentDestination, parseContentContext } from "@/lib/content-context";
import "@/components/content-entry.css";

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
  searchParams: Promise<{ visszahivas?: string; email?: string; blog?: string; blog_action?: string }>;
}) {
  const params = await searchParams;
  const isCallbackRequest = params.visszahivas === "1";
  const emailDelayed = params.email === "kesik";
  const content = parseContentContext(new URLSearchParams({ blog: params.blog ?? "", blog_action: params.blog_action ?? "" }));
  const isServiceTopic = content && blogContextCatalog[content.blogSlug].offer === "service";
  const offerHref = content
    ? contentDestination(content.blogSlug, isServiceTopic ? "service" : "quote")
    : "/kompresszor-csere-ajanlat#ajanlatkeres";

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

        {!isCallbackRequest ? <section className="thank-you-offer" aria-labelledby="riportbol-ajanlat">
          <h2 id="riportbol-ajanlat">A következő lépés: a saját igényére szóló ajánlat</h2>
          <p>{isServiceTopic
            ? "Ha a rendszer működéséről vagy egy tapasztalt hibáról szeretne egyeztetni, írja le a gépet és a tünetet a szervizajánlatkérőn."
            : "Ha már gépbeszerzést készít elő, a riport mellé konkrét műszaki és kereskedelmi ajánlatot is kérhet. A gépadatai, a levegőigény és a telepítés feltételei alapján pontosítható a megfelelő megoldás."}</p>
          <Link className="hero-cta" href={offerHref}>{isServiceTopic ? "Szervizügyben egyeztetek" : "Személyre szabott gépajánlatot kérek"}<ArrowRight size={18} aria-hidden="true" /></Link>
        </section> : null}
        <Link className="thank-you-restart" href="/">
          Új kalkuláció indítása
          <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  );
}
