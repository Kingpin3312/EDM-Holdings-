import Link from "next/link";

const tabs = [
  { href: "/labour", label: "Overview", key: "overview" },
  { href: "/labour/workforce", label: "Workforce", key: "workforce" },
  { href: "/labour/allocations", label: "Allocations", key: "allocations" },
  { href: "/labour/attendance", label: "Attendance", key: "attendance" },
  { href: "/labour/timesheets", label: "Timesheets", key: "timesheets" },
  { href: "/labour/productivity", label: "Productivity", key: "productivity" },
  { href: "/labour/rates", label: "Rate card", key: "rates" },
];

export function LabourTabs({ active }: { active: string }) {
  return (
    <div className="flex gap-1 border-b border-line mb-5 overflow-x-auto">
      {tabs.map((t) => (
        <Link key={t.key} href={t.href}
          className={`shrink-0 whitespace-nowrap px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors ${active === t.key ? "border-emerald text-emerald" : "border-transparent text-charcoal-muted hover:text-charcoal"}`}>
          {t.label}
        </Link>
      ))}
    </div>
  );
}
