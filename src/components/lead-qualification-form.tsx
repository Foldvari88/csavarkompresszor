"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AdQualification } from "@/lib/calculator/types";

const reasons: Record<string, string> = {
  missing_sales_qualification: "Még nincs értékesítési minősítés.",
  invalid_qualification: "A minősítés adatai ellenőrzést igényelnek.",
  lost_lead: "Az elvesztett érdeklődés nem kerül minősített konverzióként az exportba.",
  missing_ad_consent_record: "A beküldéshez nincs rögzített hirdetési hozzájárulás.",
  missing_google_click_id: "A beküldéshez nincs Google-kattintásazonosító."
};

export function LeadQualificationForm({ id, qualification, blockReason }: {
  id: string;
  qualification?: AdQualification | null;
  blockReason: string;
}) {
  const router = useRouter();
  const [qualified, setQualified] = useState(Boolean(qualification));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    const fields = new FormData(event.currentTarget);
    const qualifiedAt = String(fields.get("qualifiedAt") ?? "");
    const value = String(fields.get("valueHuf") ?? "");
    setError(""); setMessage(""); setSaving(true);
    try {
      if (qualified && !Number.isFinite(new Date(qualifiedAt).getTime())) throw new Error("Adja meg a minősítés érvényes időpontját.");
      const response = await fetch(`/api/admin/leads/${encodeURIComponent(id)}/qualification`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qualified,
          ...(qualified ? { qualifiedAt: new Date(qualifiedAt).toISOString(), ...(value !== "" ? { valueHuf: Number(value) } : {}) } : {})
        })
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(payload?.error ?? "A minősítést nem sikerült menteni.");
      setMessage("A minősítés mentve.");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "A minősítést nem sikerült menteni.");
    } finally { setSaving(false); }
  }

  return <section className="lead-card" style={{ marginTop: 16 }}>
    <h2>Értékesítési minősítés a Google Ads számára</h2>
    <p>A minősítést az értékesítő a megkeresés ellenőrzése után rögzíti. A kalkulált megtakarítás és a pontszám önmagában nem minősítés.</p>
    <p>{blockReason ? reasons[blockReason] : "A lead előkészíthető Google Ads-importhoz. A CSV letöltése nem jelent feltöltést."}</p>
    <form onSubmit={save}>
      <label><input type="checkbox" checked={qualified} onChange={event => setQualified(event.target.checked)} /> Az értékesítő minősített érdeklődőnek jóváhagyta</label>
      <div className="offline-qualification-fields">
        <label>Minősítés tényleges időpontja (helyi idő)
          <input className="secondary-button" name="qualifiedAt" type="datetime-local" step="1" required={qualified} disabled={!qualified || saving} defaultValue={toLocalDateTime(qualification?.qualifiedAt)} />
        </label>
        <label>Meghatározott leadérték, Ft (opcionális)
          <input className="secondary-button" name="valueHuf" type="number" min="0" max="1000000000" step="0.01" disabled={!qualified || saving} defaultValue={qualification?.valueHuf?.toString() ?? ""} />
        </label>
      </div>
      <p>Az üres értékmezőt az export is üresen hagyja. A leadérték nem az ügyfél becsült éves energiamegtakarítása vagy tényleges árbevétel.</p>
      <button className="submit-button" style={{ width: "auto" }} disabled={saving} type="submit">{saving ? "Mentés…" : "Minősítés mentése"}</button>
      {error ? <p role="alert">{error}</p> : null}
      {message ? <p role="status">{message}</p> : null}
    </form>
    <p>A minősítés módosítása a korábban feltöltött Google-konverziót nem módosítja; ahhoz külön korrekció szükséges.</p>
  </section>;
}

function toLocalDateTime(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 19);
}
