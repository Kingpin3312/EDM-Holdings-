import { Shell } from "@/components/Shell";
import { CrmTabs } from "@/components/CrmTabs";
import { Card, Badge, SectionTitle } from "@/components/ui";
import { AED } from "@/lib/data";
import { getForecast } from "@/lib/server-data";
import { DataSourceBanner } from "@/components/DataSource";

const short = (n: number) => (n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : `${Math.round(n / 1000)}k`);

export default async function ForecastPage() {
  const forecastS = await getForecast();
  const { capacityPerMonth, months } = forecastS.data;

  const totalProjected = months.reduce((s, m) => s + m.projected, 0);
  const peak = months.reduce((a, b) => (b.projected > a.projected ? b : a), months[0]);
  const monthsOver = months.filter((m) => m.projected > m.capacity).length;
  const avgUtil = Math.round((totalProjected / months.length / capacityPerMonth) * 100);

  const scaleMax = Math.max(...months.map((m) => Math.max(m.projected, m.capacity))) * 1.12;
  const capacityPct = (capacityPerMonth / scaleMax) * 100;

  const status = (p: number, c: number) =>
    p > c ? { label: "Over capacity", tone: "bg-charcoal text-white" }
    : p >= c * 0.85 ? { label: "Healthy", tone: "bg-emerald-soft text-emerald" }
    : { label: "Spare capacity", tone: "bg-sage/30 text-emerald-dark" };

  return (
    <Shell>
      <div className="mb-5 flex items-end justify-between gap-3 flex-wrap">
        <div><h1 className="text-xl font-bold tracking-tight">CRM</h1><p className="text-sm text-charcoal-muted">Revenue forecast &amp; delivery capacity — can we resource what we win?</p></div>
        <button className="bg-emerald text-white text-sm font-semibold px-4 py-2 rounded-card">Adjust capacity</button>
      </div>
      <CrmTabs active="forecast" />
      <DataSourceBanner source={forecastS.source} reason={forecastS.reason} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Projected (6 mo)</div><div className="mt-1 text-2xl font-bold">{AED(totalProjected)}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Avg utilisation</div><div className="mt-1 text-2xl font-bold">{avgUtil}%</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Peak month</div><div className="mt-1 text-[15px] font-bold leading-tight">{peak.label}</div><div className="text-xs text-charcoal-muted">{AED(peak.projected)}</div></Card>
        <Card className={`p-4 ${monthsOver > 0 ? "bg-charcoal text-white border-charcoal" : "bg-emerald text-white border-emerald"}`}><div className={`text-[11px] uppercase tracking-wider font-semibold ${monthsOver > 0 ? "text-white/70" : "text-emerald-on"}`}>Months over capacity</div><div className="mt-1 text-2xl font-bold">{monthsOver}</div></Card>
      </div>

      {/* Chart */}
      <Card className="p-5 mb-5">
        <SectionTitle>Projected revenue vs capacity</SectionTitle>
        <div className="relative" style={{ height: 240 }}>
          <div className="absolute left-0 right-0 z-10 border-t-2 border-dashed border-charcoal-muted" style={{ bottom: `${capacityPct}%` }}>
            <span className="absolute -top-5 right-0 text-[11px] font-semibold text-charcoal-muted">Capacity · {AED(capacityPerMonth)}/mo</span>
          </div>
          <div className="absolute inset-0 flex items-end gap-2">
            {months.map((m) => {
              const over = m.projected > m.capacity;
              const h = (m.projected / scaleMax) * 100;
              return (
                <div key={m.label} className="flex-1 h-full flex flex-col items-center justify-end">
                  <div className={`text-[10px] font-bold mb-1 ${over ? "text-charcoal" : "text-emerald"}`}>{short(m.projected)}</div>
                  <div className={`w-full rounded-t ${over ? "bg-charcoal" : "bg-emerald"}`} style={{ height: `${h}%` }} title={`${m.label}: ${AED(m.projected)}`} />
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          {months.map((m) => (
            <div key={m.label} className="flex-1 text-center text-[11px] text-charcoal-muted">{m.label.replace(" 2026", "")}</div>
          ))}
        </div>
        <p className="text-[12px] text-charcoal-muted mt-4 pt-4 border-t border-line">
          Bars above the capacity line are months where winning the weighted pipeline would exceed delivery capacity — flag to subcontract or add crews. Months well below are spare capacity: push bidding. This is the pipeline-to-delivery link a generic CRM leaves out.
        </p>
      </Card>

      {/* Table */}
      <Card className="p-5">
        <SectionTitle>Monthly detail</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[520px]">
            <thead><tr className="text-left text-[11px] uppercase tracking-wider text-charcoal-muted border-b border-line">
              <th className="py-2 font-semibold">Month</th><th className="font-semibold text-right">Projected</th><th className="font-semibold text-right">Capacity</th><th className="font-semibold text-right">Gap</th><th className="font-semibold">Status</th>
            </tr></thead>
            <tbody>
              {months.map((m) => {
                const s = status(m.projected, m.capacity);
                return (
                  <tr key={m.label} className="border-b border-line/60">
                    <td className="py-2.5 font-semibold text-charcoal">{m.label}</td>
                    <td className="text-right">{AED(m.projected)}</td>
                    <td className="text-right text-charcoal-muted">{AED(m.capacity)}</td>
                    <td className={`text-right font-semibold ${m.gap > 0 ? "text-charcoal" : "text-charcoal-muted"}`}>{m.gap > 0 ? "+" : ""}{AED(m.gap)}</td>
                    <td><Badge className={s.tone}>{s.label}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </Shell>
  );
}
