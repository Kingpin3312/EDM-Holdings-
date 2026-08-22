import { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  // Only apply the default surface when the caller has not supplied one.
  // Tailwind emits utilities in its own sorted order, not the order they appear
  // in the class attribute, so `bg-white` here beat a `bg-emerald` passed in by
  // a caller — which rendered the accent KPI tiles white, with their white value
  // text invisible on top. The weighted-pipeline figure was unreadable on every
  // screen that used the pattern.
  const hasBg = /(^|\s)bg-/.test(className);
  const hasBorder = /(^|\s)border-(?!$)/.test(className);
  return (
    <div className={`${hasBg ? "" : "bg-white"} border ${hasBorder ? "" : "border-line"} rounded-card ${className}`}>
      {children}
    </div>
  );
}

export function StatTile({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <Card className={`p-4 ${accent ? "bg-emerald text-white border-emerald" : ""}`}>
      <div className={`text-[11px] uppercase tracking-wider font-semibold ${accent ? "text-emerald-on" : "text-charcoal-muted"}`}>{label}</div>
      <div className={`mt-1.5 text-2xl font-bold ${accent ? "text-white" : "text-charcoal"}`}>{value}</div>
      {sub && <div className={`mt-0.5 text-xs ${accent ? "text-emerald-soft" : "text-charcoal-muted"}`}>{sub}</div>}
    </Card>
  );
}

export function Badge({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded ${className}`}>{children}</span>;
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-sm font-bold tracking-tight text-charcoal">{children}</h2>
      {action}
    </div>
  );
}
