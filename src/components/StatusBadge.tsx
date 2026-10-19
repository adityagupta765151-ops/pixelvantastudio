import { STATUS_LABEL, type ProjectStatus } from "@/data/types";

export function StatusBadge({ status, className = "" }: { status: ProjectStatus; className?: string }) {
  return <span className={`status status-${status} ${className}`}>{STATUS_LABEL[status]}</span>;
}
