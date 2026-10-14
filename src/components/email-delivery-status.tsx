import type { EmailDeliveryReport } from "@/lib/email-delivery";

const labels = {
  accepted: "Küldést elfogadta a szolgáltató",
  partial: "Részleges levélküldési hiba",
  failed: "Sikertelen levélküldés",
  skipped: "Levélküldés kihagyva"
};

const deliveryLabels = {
  delivered: "Kézbesítve a fogadó levelezőszervernek",
  delayed: "Kézbesítés késik",
  bounced: "Visszapattant - nem kézbesült",
  failed: "Kézbesítés sikertelen",
  suppressed: "Küldést letiltotta a szolgáltató",
  complained: "Spamként jelentett levél"
};

function OutcomeStatus({ name, outcome }: { name: string; outcome?: EmailDeliveryReport["customer"] }) {
  if (!outcome || outcome.status === "skipped") return null;
  const delivery = outcome.delivery?.status;
  const failed = outcome.status === "failed" || (delivery && !["delivered", "delayed"].includes(delivery));
  return <div style={{ color: failed ? "#b42318" : undefined }}><small>{name}: {delivery ? deliveryLabels[delivery] : outcome.status === "failed" ? "Küldési hiba" : "Kézbesítés még nincs igazolva"}</small></div>;
}

export function EmailDeliveryStatus({ report }: { report?: EmailDeliveryReport | null }) {
  if (!report) return <small>Korábbi küldés: nincs ellenőrzött állapot</small>;
  return <div style={{ marginTop: 6, maxWidth: 220, whiteSpace: "normal", color: report.mode === "failed" || report.mode === "partial" ? "#b42318" : undefined }}>
    <small>{labels[report.mode]}</small>
    <OutcomeStatus name="Ügyféllevél" outcome={report.customer} />
    <OutcomeStatus name="Belső értesítés" outcome={report.notification} />
  </div>;
}
