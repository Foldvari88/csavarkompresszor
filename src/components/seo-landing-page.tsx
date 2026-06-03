import Link from "next/link";
import { ArrowRight, Calculator, CheckCircle2 } from "lucide-react";
import { buildSeoPageJsonLd, type SeoPageData } from "@/lib/seo-pages";

export function SeoLandingPage({ page }: { page: SeoPageData }) {
  const jsonLd = buildSeoPageJsonLd(page);

  return (
    <main className="seo-page legal-page legal-page-industrial">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="container legal-shell">
        <Link className="legal-back" href="/">
          Vissza a kalkulátorhoz
        </Link>

        <header className="legal-hero seo-hero">
          <span>{page.eyebrow}</span>
          <h1>{page.h1}</h1>
          <p>{page.lead}</p>
          <div className="legal-highlights" aria-label="Fő SEO információk">
            {page.highlights.map((highlight) => (
              <div className="legal-highlight" key={highlight.label}>
                <b>{highlight.value}</b>
                <small>{highlight.label}</small>
              </div>
            ))}
          </div>
          <div className="seo-cta-row">
            <Link className="hero-cta" href="/#kalkulator">
              Saját megtakarítás számítása
              <ArrowRight size={18} />
            </Link>
            <Link className="schedule-cta" href="/#kalkulator">
              Részletes riport kérése
              <Calculator size={17} />
            </Link>
          </div>
        </header>

        {page.formula ? (
          <section className="formula-box" aria-label={page.formula.title}>
            <div>
              <span>Számítási alap</span>
              <h2>{page.formula.title}</h2>
            </div>
            <p>{page.formula.text}</p>
          </section>
        ) : null}

        <section className="seo-example-grid" aria-label="Gyakorlati példák">
          {page.examples.map((example) => (
            <article className="mini-metric" key={example.label}>
              <span className="metric-label">{example.label}</span>
              <strong>{example.value}</strong>
              <p>{example.note}</p>
            </article>
          ))}
        </section>

        <div className="legal-sections">
          {page.sections.map((section) => (
            <section className="legal-card" key={section.title}>
              <h2>{section.title}</h2>
              {section.body ? <p className="seo-section-lead">{section.body}</p> : null}
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <section className="legal-card faq-card" aria-labelledby="gyakori-kerdesek">
          <h2 id="gyakori-kerdesek">Gyakori kérdések</h2>
          <div className="faq-list">
            {page.faq.map((item) => (
              <details key={item.question}>
                <summary>
                  <span>{item.question}</span>
                  <CheckCircle2 size={17} />
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="legal-card" aria-labelledby="kapcsolodo-temak">
          <h2 id="kapcsolodo-temak">Kapcsolódó témák</h2>
          <div className="seo-link-grid">
            {page.related.map((link) => (
              <a href={link.href} key={link.href}>
                {link.label}
                <ArrowRight size={16} />
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
