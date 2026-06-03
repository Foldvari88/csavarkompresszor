import { AdminDashboard } from "@/components/admin-dashboard";
import { listLeads } from "@/lib/leads/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const leads = await listLeads();

  return (
    <main className="admin-shell">
      <div className="container">
        <AdminDashboard leads={leads} />
      </div>
    </main>
  );
}
