import type { Status } from "@/lib/tender-data";

const labels: Record<Status, string> = {
  eligible: "Eligible",
  ineligible: "Not Eligible",
  review: "Needs Review",
};

const styles: Record<Status, string> = {
  eligible: "border-status-eligible text-status-eligible",
  ineligible: "border-status-ineligible text-status-ineligible",
  review: "border-status-review text-status-review",
};

export function StatusBadge({
  status,
  size = "sm",
}: {
  status: Status;
  size?: "sm" | "md";
}) {
  const padding = size === "md" ? "px-3 py-1 text-[11px]" : "px-2 py-0.5 text-[10px]";
  return (
    <span
      className={`inline-flex items-center border ${padding} ${styles[status]} font-bold uppercase tracking-[0.15em]`}
    >
      {labels[status]}
    </span>
  );
}
