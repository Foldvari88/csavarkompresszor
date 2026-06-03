import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, Zap } from "lucide-react";
import { StatusForm } from "@/components/status-form";
import { getLead } from "@/lib/leads/store";
import { formatHuf, formatKw, formatNumber } from "@/lib/format";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function LeadDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await getLead(id);

  if (!lead) {
    notFound();
  }

  return (
    <main className="admin-shell">
      <div className="container">
        <div className="admin-header">
          <div>
            <Link className="nav-pill" href="/admin">
              <ArrowLeft size={16} />
              Vissza
            </Link>
            <h1>{lead.input.companyName}</h1>
          </div>
          <StatusForm id={lead.id} currentStatus={lead.status} />
        </div>

        <div className="lead-detail-grid">
          <section className="lead-card">
            <h2>Kapcsolat</h2>
            <div className="kv-grid">
              <Kv label="Email" value={lead.input.email} icon={<Mail size={15} />} />
              <Kv label="Telefon" value={lead.input.phone || "-"} icon={<Phone size={15} />} />
              <Kv label="Név" value={lead.input.name || "-"} />
              <Kv label="Beküldve" value={new Date(lead.createdAt).toLocaleString("hu-HU")} />
            </div>
          </section>

          <section className="lead-card">
            <h2>Kalkuláció</h2>
            <div className="kv-grid">
              <Kv label="Márka" value={lead.input.brand} />
              <Kv label="Kategória" value={lead.input.category} />
              <Kv label="Kor" value={`${lead.input.ageBand} év`} />
              <Kv label="Teljesítmény" value={formatKw(lead.input.nominalKw)} />
              <Kv label="Üzemóra" value={`${formatNumber(lead.input.annualHours)} óra/év`} />
              <Kv label="Áramár" value={`${formatHuf(lead.input.energyPriceHufKwh)} / kWh`} />
            </div>
          </section>

          <section className="lead-card">
            <h2>Eredmény</h2>
            <div className="kv-grid">
              <Kv label="Ajánlott modell" value={lead.result.recommendedModel.model} icon={<Zap size={15} />} />
              <Kv label="Éves megtakarítás" value={formatHuf(lead.result.annualHufSaved)} />
              <Kv label="KWh megtakarítás" value={`${formatNumber(lead.result.annualKwhSaved)} kWh/év`} />
              <Kv label="5 éves potenciál" value={formatHuf(lead.result.fiveYearHufSaved)} />
              <Kv
                label="Régi felvett teljesítmény"
                value={`${formatNumber(lead.result.selectedLegacy.degradedInputKw, 2)} kW`}
              />
              <Kv
                label="Ajánlott modell felvett teljesítménye"
                value={`${formatNumber(lead.result.recommendedModel.inputKw, 2)} kW`}
              />
            </div>
          </section>
        </div>

        <section className="lead-card" style={{ marginTop: 16 }}>
          <h2>Feltételezések</h2>
          <ul className="assumption-list">
            {lead.result.assumptions.map((assumption) => (
              <li key={assumption}>{assumption}</li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}

function Kv({
  label,
  value,
  icon
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="kv-row">
      <span>{label}</span>
      <strong>
        {icon} {value}
      </strong>
    </div>
  );
}
