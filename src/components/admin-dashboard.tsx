"use client";

import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  Building2,
  Download,
  Filter,
  Flame,
  Mail,
  Search,
  Zap
} from "lucide-react";
import { useMemo, useState } from "react";
import type { LeadRecord, LeadStatus } from "@/lib/calculator/types";
import { formatCompressorModel, formatHuf, formatKw } from "@/lib/format";
import { formatStatus } from "@/lib/status-label";

const statuses: Array<LeadStatus | "all"> = ["all", "new", "contacted", "quoted", "closed", "lost"];

export function AdminDashboard({ leads }: { leads: LeadRecord[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<LeadStatus | "all">("all");

  const filteredLeads = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return leads.filter((lead) => {
      const statusMatches = status === "all" || lead.status === status;
      if (!statusMatches) return false;
      if (!normalizedQuery) return true;

      return [
        lead.input.companyName,
        lead.input.name,
        lead.input.email,
        lead.input.phone,
        lead.input.brand,
        lead.input.category,
        lead.result.recommendedModel.model,
        lead.result.recommendedModel.brand,
        lead.result.priority?.label,
        lead.result.leadScore?.label,
        lead.input.tracking?.utmSource,
        lead.input.tracking?.utmCampaign,
        lead.input.tracking?.referrer,
        lead.status
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [leads, query, status]);

  const metrics = useMemo(() => {
    const totalSavings = leads.reduce((sum, lead) => sum + lead.result.annualHufSaved, 0);
    const newLeads = leads.filter((lead) => lead.status === "new").length;
    const hotLeads = leads.filter((lead) => (lead.result.leadScore?.score ?? 0) >= 70).length;
    const averageScore = leads.length
      ? Math.round(
          leads.reduce((sum, lead) => sum + (lead.result.leadScore?.score ?? 0), 0) / leads.length
        )
      : 0;

    return { totalSavings, newLeads, hotLeads, averageScore };
  }, [leads]);

  return (
    <>
      <div className="admin-header">
        <div>
          <span className="eyebrow">
            <Activity size={16} />
            Admin dashboard
          </span>
          <h1>Lead cockpit</h1>
          <p>Beküldött kalkulációk, kapcsolati adatok és megtakarítási potenciál egy helyen.</p>
        </div>
        <div className="admin-actions">
          <Link className="secondary-button" href="/admin/email-preview">
            <Mail size={17} />
            Email preview
          </Link>
          <a className="secondary-button" href="/admin/export">
            <Download size={17} />
            CSV export
          </a>
        </div>
      </div>

      <section className="admin-metrics" aria-label="Lead összesítő">
        <AdminMetric icon={<Building2 size={18} />} label="Összes lead" value={`${leads.length} db`} />
        <AdminMetric icon={<Mail size={18} />} label="Új lead" value={`${metrics.newLeads} db`} />
        <AdminMetric icon={<Zap size={18} />} label="Éves potenciál" value={formatHuf(metrics.totalSavings)} />
        <AdminMetric icon={<Flame size={18} />} label="Forró lead / átlag score" value={`${metrics.hotLeads} db / ${metrics.averageScore}`} />
      </section>

      <section className="admin-toolbar" aria-label="Lead keresés és szűrés">
        <label className="admin-search">
          <Search size={17} />
          <input
            aria-label="Lead keresése"
            placeholder="Keresés: cég, email, telefon, modell, kampány..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <label className="admin-filter">
          <Filter size={17} />
          <select
            aria-label="Státusz szűrő"
            value={status}
            onChange={(event) => setStatus(event.target.value as LeadStatus | "all")}
          >
            {statuses.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? "Minden státusz" : formatStatus(item)}
              </option>
            ))}
          </select>
        </label>
      </section>

      <div className="admin-panel">
        <div className="admin-table-head">
          <strong>{filteredLeads.length} lead látható</strong>
          <span>{status === "all" ? "Minden státusz" : formatStatus(status)}</span>
        </div>
        <table className="lead-table">
          <thead>
            <tr>
              <th>Dátum</th>
              <th>Lead</th>
              <th>Kapcsolat</th>
              <th>Gép</th>
              <th>Ajánlott modell</th>
              <th>Megtakarítás</th>
              <th>Score</th>
              <th>Forrás</th>
              <th>Státusz</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={10}>
                  Nincs találat. Próbálj más keresést vagy státusz szűrőt.
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr key={lead.id}>
                  <td>{new Date(lead.createdAt).toLocaleString("hu-HU")}</td>
                  <td>
                    <strong>{lead.input.companyName}</strong>
                    <span>{lead.input.name || "Nincs név"}</span>
                  </td>
                  <td>
                    <strong>{lead.input.email}</strong>
                    <span>{lead.input.phone || "-"}</span>
                  </td>
                  <td>
                    <strong>{lead.input.brand}</strong>
                    <span>
                      {formatKw(lead.input.nominalKw)} · {lead.input.ageBand} év ·{" "}
                      {lead.input.annualHours} óra
                    </span>
                  </td>
                  <td>
                    <strong>{formatCompressorModel(lead.result.recommendedModel)}</strong>
                    <span>{formatKw(lead.result.recommendedModel.nominalKw)}</span>
                  </td>
                  <td>
                    <strong>{formatHuf(lead.result.annualHufSaved)}</strong>
                    <span>{lead.result.priority?.label ?? "-"}</span>
                  </td>
                  <td>
                    <span className={`admin-score ${getScoreLevel(lead.result.leadScore?.score ?? 0)}`}>
                      {lead.result.leadScore
                        ? `${lead.result.leadScore.score}/100`
                        : "-"}
                    </span>
                    <span>{lead.result.leadScore?.label ?? "Nincs score"}</span>
                  </td>
                  <td>{lead.input.tracking?.utmSource ?? lead.input.tracking?.referrer ?? "organikus"}</td>
                  <td>
                    <span className={`admin-status ${lead.status}`}>{formatStatus(lead.status)}</span>
                  </td>
                  <td>
                    <Link className="admin-button" href={`/admin/leads/${lead.id}`}>
                      Részlet
                      <ArrowUpRight size={15} />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function AdminMetric({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="admin-metric">
      <span>{icon}</span>
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  );
}

function getScoreLevel(score: number) {
  if (score >= 70) return "hot";
  if (score >= 45) return "warm";
  return "cold";
}
