import Link from "next/link";
import { ArrowLeft, Download, Inbox, LogOut } from "lucide-react";
import { listCampaignInquiries } from "@/lib/campaign-inquiries/store";
import { EmailDeliveryStatus } from "@/components/email-delivery-status";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const kindLabels: Record<string, string> = {
  service: "Szerviz",
  "compressor-replacement": "Kompresszorcsere",
  nitrogen: "Nitrogén",
  general: "Általános"
};

export default async function CampaignInquiriesAdminPage() {
  const inquiries = await listCampaignInquiries();

  return (
    <main className="admin-shell">
      <div className="container">
        <div className="admin-header">
          <div>
            <span className="eyebrow"><Inbox size={16} />Kampányajánlatok</span>
            <h1>Ügyfél-újraaktiválási leadek</h1>
            <p>Szerviz-, kompresszorcsere- és nitrogéngenerátor-ajánlatkérések.</p>
          </div>
          <div className="admin-actions">
            <Link className="secondary-button" href="/admin"><ArrowLeft size={17} />Kalkulátor leadek</Link>
            <a className="secondary-button" href="/api/admin/campaign-inquiries-export"><Download size={17} />CSV export</a>
            <a className="secondary-button" href="/admin/logout"><LogOut size={17} />Kijelentkezés</a>
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-table-head">
            <strong>{inquiries.length} ajánlatkérés</strong>
            <span>Legújabb elöl</span>
          </div>
          <table className="lead-table lead-table-wide campaign-inquiry-table">
            <thead>
              <tr>
                <th>Dátum</th><th>Téma</th><th>Cég</th><th>Kapcsolattartó</th><th>E-mail</th><th>Telefon</th>
                <th>Márka</th><th>Típus</th><th>Elsődleges adat</th><th>Másodlagos adat</th><th>Megjegyzés</th>
                <th>Marketing</th><th>Ads személyre szabás</th><th>UTM kampány</th><th>Click ID</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.length === 0 ? (
                <tr><td colSpan={15}>Még nem érkezett kampányajánlatkérés.</td></tr>
              ) : inquiries.map((inquiry) => (
                <tr key={inquiry.id}>
                  <td>{new Date(inquiry.createdAt).toLocaleString("hu-HU")}</td>
                  <td><strong>{kindLabels[inquiry.input.kind] ?? inquiry.input.kind}</strong></td>
                  <td>{inquiry.input.companyName}</td>
                  <td>{inquiry.input.name}</td>
                  <td>{inquiry.input.email ?? "—"}<EmailDeliveryStatus report={inquiry.emailDelivery} /></td>
                  <td>{inquiry.input.phone ?? "—"}</td>
                  <td>{inquiry.input.equipmentBrand ?? "—"}</td>
                  <td>{inquiry.input.equipmentModel ?? "—"}</td>
                  <td>{inquiry.input.primaryDetail ?? "—"}</td>
                  <td>{inquiry.input.secondaryDetail ?? "—"}</td>
                  <td className="admin-note-cell">{inquiry.input.message ?? "—"}</td>
                  <td>{inquiry.input.consentMarketing ? "igen" : "nem"}</td>
                  <td>{inquiry.input.consentAdsPersonalization ? "igen" : "nem"}</td>
                  <td>{inquiry.input.tracking?.utmCampaign ?? "—"}</td>
                  <td className="tracking-cell">{inquiry.input.tracking?.gclid ?? inquiry.input.tracking?.gbraid ?? inquiry.input.tracking?.wbraid ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
