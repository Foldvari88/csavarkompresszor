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
  Star,
  Zap
} from "lucide-react";
import { useMemo, useState } from "react";
import type { LeadRecord, LeadStatus } from "@/lib/calculator/types";
import { formatCompressorModel, formatHuf, formatKw } from "@/lib/format";
import { formatStatus } from "@/lib/status-label";

const statuses: Array<LeadStatus | "all"> = ["all", "new", "contacted", "quoted", "closed", "lost"];

type StorageInfo = {
  mode: "database" | "local";
  isPersistent: boolean;
  label: string;
  message?: string;
};

export function AdminDashboard({
  leads,
  storageInfo
}: {
  leads: LeadRecord[];
  storageInfo: StorageInfo;
}) {
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
        lead.result.heatRecovery ? "hővisszanyerés" : "",
        lead.result.heatRecovery?.seasonalSavingsHuf
          ? String(lead.result.heatRecovery.seasonalSavingsHuf)
          : "",
        lead.input.tracking?.utmSource,
        lead.input.tracking?.utmCampaign,
        lead.input.tracking?.gclid,
        lead.input.tracking?.gbraid,
        lead.input.tracking?.wbraid,
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
          <a className="secondary-button" href="/admin/google-ads-export">
            <Download size={17} />
            Google Ads export
          </a>
          <a className="secondary-button" href="/admin/export">
            <Download size={17} />
            CSV export
          </a>
        </div>
      </div>

      {!storageInfo.isPersistent ? (
        <div className="admin-storage-alert" role="status">
          <strong>{storageInfo.label}</strong>
          <span>{storageInfo.message}</span>
        </div>
      ) : null}

      <section className="admin-metrics" aria-label="Lead összesítő">
        <AdminMetric icon={<Building2 size={18} />} label="Összes lead" value={`${leads.length} db`} />
        <AdminMetric icon={<Mail size={18} />} label="Új lead" value={`${metrics.newLeads} db`} />
        <AdminMetric icon={<Zap size={18} />} label="Éves potenciál" value={formatHuf(metrics.totalSavings)} />
        <AdminMetric
          icon={<Flame size={18} />}
          label="Forró lead / átlag score"
          value={`${metrics.hotLeads} db / ${metrics.averageScore}`}
        />
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
        <table className="lead-table lead-table-wide">
          <thead>
            <tr>
              <th>Dátum</th>
              <th>Cégnév</th>
              <th>Kapcsolattartó</th>
              <th>Email</th>
              <th>Telefon</th>
              <th>Márka</th>
              <th>Kategória</th>
              <th>Kor</th>
              <th>kW</th>
              <th>Üzemóra</th>
              <th>Áramár</th>
              <th>Profil</th>
              <th>VSD</th>
              <th>Marketing</th>
              <th>GDPR</th>
              <th>Ajánlott modell</th>
              <th>Éves Ft</th>
              <th>Havi Ft</th>
              <th>5 éves Ft</th>
              <th>kWh/év</th>
              <th>Hővisszanyerés</th>
              <th>Gázkiváltás Ft/év</th>
              <th>Gáz m3/év</th>
              <th>Gázár</th>
              <th>Score</th>
              <th>Csillag</th>
              <th>UTM source</th>
              <th>UTM campaign</th>
              <th>GCLID</th>
              <th>GBRAID</th>
              <th>WBRAID</th>
              <th>Referrer</th>
              <th>Státusz</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={34}>Nincs találat. Próbálj más keresést vagy státusz szűrőt.</td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr key={lead.id}>
                  <td>{new Date(lead.createdAt).toLocaleString("hu-HU")}</td>
                  <td>
                    <strong>{lead.input.companyName}</strong>
                  </td>
                  <td>
                    <strong>{lead.input.name || "-"}</strong>
                  </td>
                  <td>{lead.input.email}</td>
                  <td>{lead.input.phone || "-"}</td>
                  <td>{lead.input.brand}</td>
                  <td>{lead.input.category}</td>
                  <td>{lead.input.ageBand} év</td>
                  <td>{formatKw(lead.input.nominalKw)}</td>
                  <td>{lead.input.annualHours} óra</td>
                  <td>{formatHuf(lead.input.energyPriceHufKwh)} / kWh</td>
                  <td>{formatLoadProfile(lead.input.loadProfile)}</td>
                  <td>{lead.input.preferVariableSpeed ? "igen" : "nem"}</td>
                  <td>{lead.input.consentMarketing ? "igen" : "nem"}</td>
                  <td>{lead.input.consentPrivacy ? "igen" : "nem"}</td>
                  <td>
                    <strong>{formatCompressorModel(lead.result.recommendedModel)}</strong>
                    <span>{formatKw(lead.result.recommendedModel.nominalKw)}</span>
                  </td>
                  <td>
                    <strong>{formatHuf(lead.result.annualHufSaved)}</strong>
                    <span>{lead.result.priority?.label ?? "-"}</span>
                  </td>
                  <td>{formatHuf(lead.result.monthlyHufSaved)}</td>
                  <td>{formatHuf(lead.result.fiveYearHufSaved)}</td>
                  <td>{Math.round(lead.result.annualKwhSaved).toLocaleString("hu-HU")}</td>
                  <td>{lead.result.heatRecovery ? "igen" : "nem"}</td>
                  <td>
                    {lead.result.heatRecovery
                      ? formatHuf(lead.result.heatRecovery.seasonalSavingsHuf)
                      : "-"}
                  </td>
                  <td>
                    {lead.result.heatRecovery
                      ? `${Math.round(lead.result.heatRecovery.seasonalGasSavedM3).toLocaleString("hu-HU")} m3`
                      : "-"}
                  </td>
                  <td>
                    {lead.result.heatRecovery
                      ? `${formatHuf(lead.result.heatRecovery.gasPriceHufPerM3)} / m3`
                      : "-"}
                  </td>
                  <td>
                    <span className={`admin-score ${getScoreLevel(lead.result.leadScore?.score ?? 0)}`}>
                      {lead.result.leadScore ? `${lead.result.leadScore.score}/100` : "-"}
                    </span>
                    <span>{lead.result.leadScore?.label ?? "Nincs score"}</span>
                  </td>
                  <td>
                    <StarRating leadId={lead.id} initialRating={lead.customerRating} />
                  </td>
                  <td>{lead.input.tracking?.utmSource ?? "organikus"}</td>
                  <td>{lead.input.tracking?.utmCampaign ?? "-"}</td>
                  <td className="tracking-cell">{lead.input.tracking?.gclid ?? "-"}</td>
                  <td className="tracking-cell">{lead.input.tracking?.gbraid ?? "-"}</td>
                  <td className="tracking-cell">{lead.input.tracking?.wbraid ?? "-"}</td>
                  <td className="tracking-cell">{lead.input.tracking?.referrer ?? "-"}</td>
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

function StarRating({
  leadId,
  initialRating
}: {
  leadId: string;
  initialRating: number | null;
}) {
  const [rating, setRating] = useState(initialRating);
  const [isSaving, setIsSaving] = useState(false);

  async function updateRating(nextRating: number) {
    const previousRating = rating;
    const value = rating === nextRating ? null : nextRating;
    setRating(value);
    setIsSaving(true);

    try {
      const response = await fetch(`/api/admin/leads/${leadId}/rating`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerRating: value })
      });

      if (!response.ok) {
        setRating(previousRating);
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className={`star-rating ${isSaving ? "is-saving" : ""}`} aria-label="Ügyfélminősítés">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          aria-label={`${star} csillag`}
          className={rating && star <= rating ? "active" : ""}
          key={star}
          type="button"
          onClick={() => updateRating(star)}
        >
          <Star size={16} />
        </button>
      ))}
    </div>
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

function formatLoadProfile(profile: LeadRecord["input"]["loadProfile"]) {
  if (profile === "continuous") return "folyamatos";
  if (profile === "shift") return "műszakos";
  if (profile === "fluctuating") return "ingadozó";
  if (profile === "peak") return "csúcsterhelés";
  return "-";
}
