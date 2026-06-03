import Link from "next/link";

type LegalSection = {
  title: string;
  items: string[];
};

export function LegalPage({
  title,
  lead,
  sections
}: {
  title: string;
  lead: string;
  sections: LegalSection[];
}) {
  return (
    <main className="legal-page">
      <div className="container legal-shell">
        <Link className="legal-back" href="/">
          Vissza a kalkulátorhoz
        </Link>
        <header className="legal-hero">
          <span>Jogi információk</span>
          <h1>{title}</h1>
          <p>{lead}</p>
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
