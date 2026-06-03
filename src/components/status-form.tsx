"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { LeadStatus } from "@/lib/calculator/types";
import { formatStatus } from "@/lib/status-label";

const statuses: LeadStatus[] = ["new", "contacted", "quoted", "closed", "lost"];

export function StatusForm({
  id,
  currentStatus
}: {
  id: string;
  currentStatus: LeadStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<LeadStatus>(currentStatus);
  const [isSaving, setIsSaving] = useState(false);

  async function save() {
    setIsSaving(true);
    await fetch(`/api/admin/leads/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    setIsSaving(false);
    router.refresh();
  }

  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <select
        className="secondary-button"
        value={status}
        onChange={(event) => setStatus(event.target.value as LeadStatus)}
      >
        {statuses.map((item) => (
          <option key={item} value={item}>
            {formatStatus(item)}
          </option>
        ))}
      </select>
      <button className="submit-button" style={{ width: 132 }} type="button" onClick={save}>
        {isSaving ? "Mentés..." : "Mentés"}
      </button>
    </div>
  );
}
