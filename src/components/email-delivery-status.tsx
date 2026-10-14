import type { EmailDeliveryReport } from "@/lib/email-delivery";

const labels = {
  accepted: "Küldést elfogadta a szolgáltató",
  partial: "Részleges levélküldési hiba",
  failed: "Sikertelen levélküldés",
  skipped: "Levélküldés kihagyva"
};

export function EmailDeliveryStatus({ report }: { report?: EmailDeliveryReport | null }) {
  if (!report) return <small>Korábbi küldés: nincs ellenőrzött állapot</small>;
  return <div style={{ marginTop: 6, maxWidth: 220, whiteSpace: "normal", color: report.mode === "failed" || report.mode === "partial" ? "#b42318" : undefined }}>
    <small>{labels[report.mode]}</small>
    {report.customer?.status === "failed" ? <div><small>Ügyféllevél hibás</small></div> : null}
    {report.notification?.status === "failed" ? <div><small>Belső értesítés hibás</small></div> : null}
  </div>;
}
