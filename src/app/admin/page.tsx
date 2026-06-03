import Link from "next/link";
import { Download, ExternalLink, Gauge } from "lucide-react";
import { listLeads } from "@/lib/leads/store";
import { formatHuf, formatKw } from "@/lib/format";
import { formatStatus } from "@/lib/status-label";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const leads = await listLeads();

  return (
    <main className="admin-shell">
      <div className="container">
        <div className="admin-header">
          <div>
            <span className="eyebrow">
              <Gauge size={16} />
              Admin
            </span>
            <h1>Beküldések</h1>
          </div>
          <a className="secondary-button" href="/admin/export">
            <Download size={17} />
            CSV export
          </a>
        </div>

        <div className="admin-panel">
          <table className="lead-table">
            <thead>
              <tr>
                <th>Dátum</th>
                <th>Cég</th>
                <th>Email</th>
                <th>Gép</th>
                <th>Ajánlott modell</th>
                <th>Megtakarítás</th>
                <th>Prioritás</th>
                <th>Score</th>
                <th>Forrás</th>
                <th>Státusz</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={11}>
                    Még nincs beküldés. Lokális módban az adatok a leads.local.json fájlba kerülnek.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id}>
                    <td>{new Date(lead.createdAt).toLocaleString("hu-HU")}</td>
                    <td>{lead.input.companyName}</td>
                    <td>{lead.input.email}</td>
                    <td>
                      {lead.input.brand}
                      <br />
                      {formatKw(lead.input.nominalKw)}
                    </td>
                    <td>{lead.result.recommendedModel.model}</td>
                    <td>{formatHuf(lead.result.annualHufSaved)}</td>
                    <td>{lead.result.priority?.label ?? "-"}</td>
                    <td>
                      {lead.result.leadScore
                        ? `${lead.result.leadScore.score}/100 ${lead.result.leadScore.label}`
                        : "-"}
                    </td>
                    <td>{lead.input.tracking?.utmSource ?? lead.input.tracking?.referrer ?? "organikus"}</td>
                    <td>{formatStatus(lead.status)}</td>
                    <td>
                      <Link className="admin-button" href={`/admin/leads/${lead.id}`}>
                        <ExternalLink size={15} />
                        Részlet
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
