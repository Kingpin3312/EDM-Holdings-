import type { DataSource as Source } from "@/lib/server-data";

// Says where the numbers on a screen came from. This is not decoration: the
// data layer falls back to a fixture when the API cannot be reached, and
// without this a director cannot tell a live forecast from a demonstration.
export function DataSourceBadge({ source, reason, className = "" }: { source: Source; reason?: string; className?: string }) {
  if (source === "live") return null;

  if (source === "empty") {
    return (
      <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold text-charcoal-muted ${className}`}>
        <span aria-hidden className="inline-block w-1.5 h-1.5 rounded-full bg-line-strong" />
        Nothing recorded yet
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald border border-emerald rounded px-2 py-0.5 ${className}`}
      title={reason ? `Live data unavailable: ${reason}` : undefined}
    >
      <span aria-hidden className="inline-block w-1.5 h-1.5 rounded-full bg-emerald" />
      Example figures — not live
    </span>
  );
}

// A full-width version for the top of a screen where everything below is a
// fixture, so it cannot be mistaken for one stale panel among live ones.
export function DataSourceBanner({ source, reason }: { source: Source; reason?: string }) {
  if (source !== "demo") return null;
  return (
    <div role="status" className="mb-4 flex items-start gap-2.5 rounded-card border border-emerald bg-white px-4 py-3">
      <span aria-hidden className="mt-1.5 inline-block w-2 h-2 rounded-full bg-emerald flex-none" />
      <p className="text-[13px] leading-relaxed text-charcoal">
        <strong className="font-bold">These are example figures, not live data.</strong>{" "}
        The screen could not reach the API, so it is showing the demonstration set.
        {reason && <span className="text-charcoal-muted"> ({reason})</span>}
      </p>
    </div>
  );
}

// What a screen shows when the API answered and there is genuinely nothing yet.
// An empty state is information; substituting invented rows is not.
export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="py-10 text-center">
      <p className="text-sm font-semibold text-charcoal">{title}</p>
      {hint && <p className="mt-1 text-[13px] text-charcoal-muted">{hint}</p>}
    </div>
  );
}
