import { AdminDashboard } from "@/components/admin-dashboard";
import { getLeadStorageInfo, listLeads } from "@/lib/leads/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const leads = await listLeads();
  const storageInfo = getLeadStorageInfo();

  return (
    <main className="admin-shell">
      <div className="container">
        <AdminDashboard leads={leads} storageInfo={storageInfo} />
      </div>
    </main>
  );
}
