import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, PhoneCall, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Ajánlatkérés rögzítve",
  description: "A szakmai ajánlatkérés sikeresen rögzítésre került.",
  robots: { index: false, follow: false }
};

const labels: Record<string, string> = {
  service: "kompresszorszerviz",
  "compressor-replacement": "csavarkompresszor-csere",
  nitrogen: "nitrogéngenerátor",
  general: "ipari levegőtechnikai"
};

export default async function OfferThankYouPage({
  searchParams
}: {
  searchParams: Promise<{ tipus?: string; ref?: string; email?: string }>;
}) {
  const params = await searchParams;
  const label = labels[params.tipus ?? ""] ?? "szakmai";

  return (
    <main className="offer-thank-you-page">
      <section className="offer-thank-you-card">
        <span className="offer-thank-you-icon"><CheckCircle2 size={34} /></span>
        <span className="reactivation-section-kicker">Sikeres beküldés</span>
        <h1>Köszönjük, rögzítettük a {label} témájú megkeresését.</h1>
        <p>
          {params.email === "kesik"
            ? "Megkeresését elmentettük. A visszaigazoló e-mail küldése most nem sikerült; nem szükséges újra beküldenie az űrlapot."
            : "Megkeresését szakmai feldolgozásra rögzítettük. Ha e-mail-címet is megadott, a visszaigazolás küldését elindítottuk."}
        </p>
        {params.ref ? <p className="offer-reference">Hivatkozási szám: <strong>{params.ref}</strong></p> : null}
        <div className="offer-thank-you-grid">
          <div><PhoneCall size={22} /><strong>Sürgős ügy?</strong><span>Hívja a +36 56 514 720 számot.</span></div>
          <div><ShieldCheck size={22} /><strong>Biztonságos kezelés</strong><span>A hozzájárulás bármikor visszavonható.</span></div>
        </div>
        <Link className="reactivation-primary-cta" href="/ugyfel-ajanlat">
          További ajánlati területek <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  );
}
