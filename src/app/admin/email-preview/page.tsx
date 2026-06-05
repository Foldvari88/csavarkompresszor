import Link from "next/link";
import { Download, Mail } from "lucide-react";
import { createPreviewLead } from "@/lib/leads/preview";
import { renderCustomerEmail } from "@/lib/leads/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function EmailPreviewPage() {
  const lead = createPreviewLead();
  const html = renderCustomerEmail(lead);

  return (
    <main className="admin-shell">
      <div className="container">
        <div className="admin-header">
          <div>
            <span className="eyebrow">
              <Mail size={16} />
              Email preview
            </span>
            <h1>Kiküldött riport előnézet</h1>
            <p>
              Ez ugyanaz a HTML email sablon, amit éles Resend beállítás után a rendszer kiküld a
              beküldő email címére.
            </p>
          </div>
          <div className="admin-actions">
            <Link className="secondary-button" href="/admin">
              Admin dashboard
            </Link>
            <a className="secondary-button" href="/admin/email-preview/report">
              <Download size={17} />
              PDF riport minta
            </a>
          </div>
        </div>

        <section className="email-preview-panel" aria-label="Email előnézet">
          <iframe title="Kiküldött ügyfél email előnézet" srcDoc={html} />
        </section>
      </div>
    </main>
  );
}
