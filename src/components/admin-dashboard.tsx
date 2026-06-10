"use client";

import Link from "next/link";
import {
  Activity,
  Download,
  Filter,
  LogOut,
  Mail,
  Search,
  Star
} from "lucide-react";
import { useMemo, useState } from "react";
import type { LeadRecord, LeadStatus } from "@/lib/calculator/types";
import { formatStatus, leadStatusOptions } from "@/lib/status-label";

const statuses: Array<LeadStatus | "all"> = ["all", ...leadStatusOptions];

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
        lead.input.companyWebsite,
        lead.input.companyActivity,
        lead.input.name,
        lead.input.email,
        lead.input.phone,
        lead.result.leadScore?.label,
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

  return (
    <>
      <div className="admin-header">
        <div>
          <span className="eyebrow">
            <Activity size={16} />
            Admin dashboard
          </span>
          <h1>Lead tracker</h1>
          <p>Beküldött leadek, kapcsolati adatok és kampányazonosítók egy helyen.</p>
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
          <a className="secondary-button" href="/admin/logout">
            <LogOut size={17} />
            Kijelentkezés
          </a>
        </div>
      </div>

      {!storageInfo.isPersistent ? (
        <div className="admin-storage-alert" role="status">
          <strong>{storageInfo.label}</strong>
          <span>{storageInfo.message}</span>
        </div>
      ) : null}

      <section className="admin-toolbar" aria-label="Lead keresés és szűrés">
        <label className="admin-search">
          <Search size={17} />
          <input
            aria-label="Lead keresése"
            placeholder="Keresés: cég, weboldal, iparág, email, telefon, kampány..."
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
              <th>Céges weboldal</th>
              <th>Iparág / tevékenység</th>
              <th>Kapcsolattartó</th>
              <th>Email</th>
              <th>Telefon</th>
              <th>Score</th>
              <th>Csillag</th>
              <th>UTM source</th>
              <th>UTM campaign</th>
              <th>GCLID</th>
              <th>GBRAID</th>
              <th>WBRAID</th>
              <th>Referrer</th>
              <th>PDF</th>
              <th>Státusz</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={17}>Nincs találat. Próbálj más keresést vagy státusz szűrőt.</td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr key={lead.id}>
                  <td>{new Date(lead.createdAt).toLocaleString("hu-HU")}</td>
                  <td>
                    <strong>{lead.input.companyName}</strong>
                  </td>
                  <td>
                    {lead.input.companyWebsite ? (
                      <a
                        className="admin-table-link"
                        href={formatWebsiteHref(lead.input.companyWebsite)}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {lead.input.companyWebsite}
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>{lead.input.companyActivity ?? "-"}</td>
                  <td>
                    <strong>{lead.input.name || "-"}</strong>
                  </td>
                  <td>{lead.input.email}</td>
                  <td>{lead.input.phone || "-"}</td>
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
                    <a className="admin-button compact" href={`/admin/leads/${lead.id}/report`}>
                      <Download size={15} />
                      PDF
                    </a>
                  </td>
                  <td>
                    <LeadStatusSelect leadId={lead.id} initialStatus={normalizeVisibleStatus(lead.status)} />
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

function formatWebsiteHref(value: string) {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function LeadStatusSelect({
  leadId,
  initialStatus
}: {
  leadId: string;
  initialStatus: LeadStatus;
}) {
  const [status, setStatus] = useState<LeadStatus>(initialStatus);
  const [isSaving, setIsSaving] = useState(false);

  async function updateStatus(nextStatus: LeadStatus) {
    const previousStatus = status;
    setStatus(nextStatus);
    setIsSaving(true);

    try {
      const response = await fetch(`/api/admin/leads/${leadId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus })
      });

      if (!response.ok) {
        setStatus(previousStatus);
      }
    } catch {
      setStatus(previousStatus);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <label className={`admin-status-select ${isSaving ? "is-saving" : ""}`}>
      <span className="sr-only">Lead státusz</span>
      <select
        aria-label="Lead státusz módosítása"
        disabled={isSaving}
        value={status}
        onChange={(event) => updateStatus(event.target.value as LeadStatus)}
      >
        {leadStatusOptions.map((item) => (
          <option key={item} value={item}>
            {formatStatus(item)}
          </option>
        ))}
      </select>
    </label>
  );
}

function normalizeVisibleStatus(status: LeadStatus) {
  return status === "quoted" ? "contacted" : status;
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

function getScoreLevel(score: number) {
  if (score >= 70) return "hot";
  if (score >= 45) return "warm";
  return "cold";
}
