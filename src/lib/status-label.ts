import type { LeadStatus } from "@/lib/calculator/types";

const statusLabels: Record<LeadStatus, string> = {
  new: "Új",
  contacted: "Áttekintve",
  quoted: "Pontosítás alatt",
  closed: "Lezárt",
  lost: "Archivált"
};

export function formatStatus(status: LeadStatus) {
  return statusLabels[status] ?? status;
}
