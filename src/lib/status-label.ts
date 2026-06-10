import type { LeadStatus } from "@/lib/calculator/types";

export const leadStatusOptions = ["new", "contacted", "closed", "lost"] as const satisfies LeadStatus[];

const statusLabels: Record<LeadStatus, string> = {
  new: "Új",
  contacted: "Sales ciklus folyamatban",
  quoted: "Sales ciklus folyamatban",
  closed: "Értékesítéssel zárt",
  lost: "Értékesítés nélkül zárt"
};

export function formatStatus(status: LeadStatus) {
  return statusLabels[status] ?? status;
}
