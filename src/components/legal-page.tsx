import Link from "next/link";

type LegalSection = {
  title: string;
  items: string[];
};

export function LegalPage({
  title,
  lead,
  sections,
  variant = "default",
  eyebrow = "Jogi információk",
  highlights = []
}: {
  title: string;
  lead: string;
  sections: LegalSection[];
  variant?: "default" | "industrial";
  eyebrow?: string;
  highlights?: Array<{
    label: string;
    value: string;
  }>;
}) {
  return (
    <main className={`legal-page ${variant === "industrial" ? "legal-page-industrial" : ""}`}>
      <div className="container legal-shell">
        <Link className="legal-back" href="/">
          Vissza a kalkulátorhoz
        </Link>
        <header className="legal-hero">
          <span>{eyebrow}</span>
          <h1>{title}</h1>
          <p>{lead}</p>
          {highlights.length ? (
            <div className="legal-highlights" aria-label="Fontos süti információk">
              {highlights.map((highlight) => (
                <div className="legal-highlight" key={highlight.label}>
                  <b>{highlight.value}</b>
                  <small>{highlight.label}</small>
                </div>
              ))}
            </div>
          ) : null}
        </header>
        <div className="legal-note">
          A szöveg vázlatként szolgál. Élesítés előtt a szolgáltató pontos cégadataival,
          adatfeldolgozóival és jogi ellenőrzéssel kell véglegesíteni.
        </div>
        <div className="legal-sections">
          {sections.map((section) => (
            <section className="legal-card" key={section.title}>
              <h2>{section.title}</h2>
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
