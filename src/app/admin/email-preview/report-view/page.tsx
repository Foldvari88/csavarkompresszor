import Link from "next/link";
import { Download, FileText } from "lucide-react";
import { createPreviewLead } from "@/lib/leads/preview";
import { getLeadReportLines } from "@/lib/leads/pdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function ReportPreviewPage() {
  const lead = createPreviewLead();
  const lines = getLeadReportLines(lead);

  return (
    <main className="admin-shell">
      <div className="container">
        <div className="admin-header">
          <div>
            <span className="eyebrow">
              <FileText size={16} />
              PDF riport preview
            </span>
            <h1>Riport tartalom előnézet</h1>
            <p>
              Ez a PDF-be kerülő riport olvasható HTML nézete. A PDF letöltés ugyanebből a
              tartalomból készül.
            </p>
          </div>
          <div className="admin-actions">
            <Link className="secondary-button" href="/admin/email-preview">
              Email előnézet
            </Link>
            <a className="secondary-button" href="/admin/email-preview/report">
              <Download size={17} />
              PDF letöltés
            </a>
          </div>
        </div>

        <section className="report-preview-sheet" aria-label="PDF riport tartalom">
          {lines.map((line, index) => {
            if (!line) return <hr key={`line-${index}`} />;
            if (isHeading(line, index)) return <h2 key={`line-${index}`}>{line}</h2>;
            return <p key={`line-${index}`}>{line}</p>;
          })}
        </section>
      </div>
    </main>
  );
}

function isHeading(line: string, index: number) {
  return (
    index === 0 ||
    [
      "Bemeneti adatok",
      "Eredmeny",
      "Ajanlott modell",
      "Minosites",
      "Kovetkezo lepes"
    ].includes(line)
  );
}
