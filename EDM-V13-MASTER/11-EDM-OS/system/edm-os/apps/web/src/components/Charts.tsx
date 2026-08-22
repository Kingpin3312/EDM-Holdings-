"use client";

import { useId, useMemo, useState } from "react";

/* EDM OS charts.
 *
 * Built to the brand: #083819 is the only accent, so nothing here uses a second
 * hue. Ordered categories (pipeline stages) take an ordinal ramp — one hue
 * stepped toward white — so the reader sees the order in the colour rather than
 * having to decode a legend. Validated: lightest step 2.43:1 on white, adjacent
 * steps 12-17 dE in OKLab.
 *
 * Every chart ships hover and a table view. A chart nobody can interrogate is a
 * picture; the table is also what makes the numbers accessible.
 */

export const STAGE_RAMP = ["#97AB9E", "#6B8875", "#3E644C", "#083819"] as const;
const INK = "#0F231B";
const MUTED = "#5C6F66";
const LINE = "#E4E6E0";
const EM = "#083819";

const aed = (n: number) =>
  n >= 1_000_000 ? `AED ${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}m`
  : n >= 1_000 ? `AED ${Math.round(n / 1_000)}k`
  : `AED ${Math.round(n)}`;

function TableToggle({ open, onToggle, id }: { open: boolean; onToggle: () => void; id: string }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={id}
      className="text-[11px] font-semibold text-emerald hover:underline"
    >
      {open ? "Hide table" : "View as table"}
    </button>
  );
}

/* ------------------------------------------------------------------ pipeline */

export type StageDatum = { stage: string; count: number; gross: number; weighted: number };

/** Weighted value by pipeline stage. Ordered categories, so an ordinal ramp. */
export function PipelineByStage({ data, title = "Pipeline by stage" }: { data: StageDatum[]; title?: string }) {
  const tableId = useId();
  const [showTable, setShowTable] = useState(false);
  const [hover, setHover] = useState<number | null>(null);

  const max = Math.max(1, ...data.map((d) => d.gross));
  const totalWeighted = data.reduce((s, d) => s + d.weighted, 0);

  if (!data.length) return null;

  return (
    <figure className="m-0">
      <figcaption className="flex items-baseline justify-between gap-3 mb-1">
        <h3 className="text-sm font-bold tracking-tight text-charcoal">{title}</h3>
        <TableToggle open={showTable} onToggle={() => setShowTable((v) => !v)} id={tableId} />
      </figcaption>
      <p className="text-[12px] text-charcoal-muted mb-3">
        Weighted {aed(totalWeighted)} across {data.reduce((s, d) => s + d.count, 0)} open opportunities.
        Bar length is gross value; the darker inset is value weighted by probability.
      </p>

      <div className="space-y-2.5">
        {data.map((d, i) => {
          const grossPct = (d.gross / max) * 100;
          const weightedPct = (d.weighted / max) * 100;
          const on = hover === i;
          return (
            <div
              key={d.stage}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              tabIndex={0}
              className="group outline-none"
              aria-label={`${d.stage}: ${d.count} opportunities, gross ${aed(d.gross)}, weighted ${aed(d.weighted)}`}
            >
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: i === data.length - 1 ? EM : MUTED }}>
                  {d.stage}
                </span>
                <span className="text-[11px] tabular-nums" style={{ color: on ? INK : MUTED }}>
                  {d.count} · {aed(d.gross)}
                </span>
              </div>
              {/* track */}
              <div className="relative h-5 rounded-[3px]" style={{ background: "#F4F5F3" }}>
                {/* gross */}
                <div
                  className="absolute inset-y-0 left-0 transition-[width] duration-300"
                  style={{
                    width: `${grossPct}%`,
                    background: STAGE_RAMP[Math.min(i, STAGE_RAMP.length - 1)],
                    borderRadius: "0 4px 4px 0",
                    opacity: hover === null || on ? 1 : 0.55,
                  }}
                />
                {/* weighted inset — a 2px surface gap keeps the two readable */}
                <div
                  className="absolute left-0 transition-[width] duration-300"
                  style={{
                    top: 2, bottom: 2,
                    width: `${weightedPct}%`,
                    background: EM,
                    borderRadius: "0 3px 3px 0",
                    opacity: hover === null || on ? 1 : 0.55,
                  }}
                />
                {on && (
                  <div
                    role="tooltip"
                    className="absolute z-10 -top-1 translate-y-[-100%] left-0 bg-white border border-line-strong rounded px-2.5 py-1.5 shadow-sm whitespace-nowrap"
                  >
                    <div className="text-[11px] font-bold text-charcoal">{d.stage}</div>
                    <div className="text-[11px] text-charcoal-muted tabular-nums">
                      {d.count} open · gross {aed(d.gross)} · weighted {aed(d.weighted)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showTable && (
        <table id={tableId} className="mt-4 w-full text-[12px]">
          <caption className="sr-only">{title}</caption>
          <thead>
            <tr className="text-left text-charcoal-muted border-b" style={{ borderColor: LINE }}>
              <th className="py-1.5 font-semibold">Stage</th>
              <th className="py-1.5 font-semibold text-right">Open</th>
              <th className="py-1.5 font-semibold text-right">Gross</th>
              <th className="py-1.5 font-semibold text-right">Weighted</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.stage} className="border-b last:border-0" style={{ borderColor: LINE }}>
                <td className="py-1.5">{d.stage}</td>
                <td className="py-1.5 text-right tabular-nums">{d.count}</td>
                <td className="py-1.5 text-right tabular-nums">{aed(d.gross)}</td>
                <td className="py-1.5 text-right tabular-nums">{aed(d.weighted)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </figure>
  );
}

/* ------------------------------------------------------------------ forecast */

export type ForecastMonth = { label: string; projected: number; capacity: number; gap: number };

/**
 * Weighted pipeline by expected close month against delivery capacity.
 * One measure, one axis — capacity is a reference line, not a second series on
 * a second scale.
 */
export function ForecastVsCapacity({ months, capacityLabel = "Delivery capacity" }: { months: ForecastMonth[]; capacityLabel?: string }) {
  const tableId = useId();
  const [showTable, setShowTable] = useState(false);
  const [hover, setHover] = useState<number | null>(null);

  const { max, capacity } = useMemo(() => {
    const cap = months[0]?.capacity ?? 0;
    return { max: Math.max(1, cap, ...months.map((m) => m.projected)) * 1.1, capacity: cap };
  }, [months]);

  if (!months.length) return null;
  const H = 168, capY = capacity ? H - (capacity / max) * H : null;
  const over = months.filter((m) => m.projected > m.capacity).length;

  return (
    <figure className="m-0">
      <figcaption className="flex items-baseline justify-between gap-3 mb-1">
        <h3 className="text-sm font-bold tracking-tight text-charcoal">Forecast against capacity</h3>
        <TableToggle open={showTable} onToggle={() => setShowTable((v) => !v)} id={tableId} />
      </figcaption>
      <p className="text-[12px] text-charcoal-muted mb-3">
        Weighted pipeline by expected close month.{" "}
        {capacity
          ? over
            ? `${over} month${over > 1 ? "s" : ""} above capacity — subcontract or hire.`
            : "No month is above capacity."
          : "Set a delivery capacity in settings to compare against it."}
      </p>

      <div className="relative" style={{ height: H + 26 }}>
        {capY !== null && (
          <>
            <div className="absolute left-0 right-0 border-t" style={{ top: capY, borderColor: EM, borderTopWidth: 2 }} />
            <div className="absolute text-[10px] font-semibold uppercase tracking-wider px-1"
                 style={{ top: Math.max(0, capY - 14), right: 0, color: EM, background: "#fff" }}>
              {capacityLabel}
            </div>
          </>
        )}
        <div className="absolute inset-x-0 bottom-[26px] flex items-end gap-2" style={{ height: H }}>
          {months.map((m, i) => {
            const h = (m.projected / max) * H;
            const isOver = capacity > 0 && m.projected > m.capacity;
            const on = hover === i;
            return (
              <div key={m.label} className="flex-1 relative flex items-end justify-center"
                   style={{ height: H }}
                   onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
                   onFocus={() => setHover(i)} onBlur={() => setHover(null)}
                   tabIndex={0}
                   aria-label={`${m.label}: projected ${aed(m.projected)}${capacity ? `, capacity ${aed(m.capacity)}` : ""}`}>
                <div
                  className="w-full transition-all duration-300"
                  style={{
                    maxWidth: 24, height: Math.max(2, h),
                    background: isOver ? EM : STAGE_RAMP[1],
                    borderRadius: "4px 4px 0 0",
                    opacity: hover === null || on ? 1 : 0.55,
                  }}
                />
                {on && (
                  <div role="tooltip"
                       className="absolute z-10 bottom-full mb-1.5 bg-white border border-line-strong rounded px-2.5 py-1.5 whitespace-nowrap shadow-sm">
                    <div className="text-[11px] font-bold text-charcoal">{m.label}</div>
                    <div className="text-[11px] text-charcoal-muted tabular-nums">
                      {aed(m.projected)}{capacity ? ` of ${aed(m.capacity)}` : ""}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="absolute inset-x-0 bottom-0 flex gap-2">
          {months.map((m) => (
            <div key={m.label} className="flex-1 text-center text-[10px] text-charcoal-muted truncate">
              {m.label.replace(/ \d{4}$/, "")}
            </div>
          ))}
        </div>
      </div>

      {showTable && (
        <table id={tableId} className="mt-3 w-full text-[12px]">
          <thead>
            <tr className="text-left text-charcoal-muted border-b" style={{ borderColor: LINE }}>
              <th className="py-1.5 font-semibold">Month</th>
              <th className="py-1.5 font-semibold text-right">Projected</th>
              <th className="py-1.5 font-semibold text-right">Capacity</th>
              <th className="py-1.5 font-semibold text-right">Gap</th>
            </tr>
          </thead>
          <tbody>
            {months.map((m) => (
              <tr key={m.label} className="border-b last:border-0" style={{ borderColor: LINE }}>
                <td className="py-1.5">{m.label}</td>
                <td className="py-1.5 text-right tabular-nums">{aed(m.projected)}</td>
                <td className="py-1.5 text-right tabular-nums">{m.capacity ? aed(m.capacity) : "—"}</td>
                <td className="py-1.5 text-right tabular-nums" style={{ color: m.gap > 0 ? EM : MUTED }}>
                  {m.capacity ? (m.gap > 0 ? `+${aed(m.gap)}` : aed(Math.abs(m.gap)) + " spare") : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </figure>
  );
}

/* -------------------------------------------------------------------- winrate */

/** Win rate as a single proportion. One number, one bar — no pie. */
export function WinRateBar({ won, lost }: { won: number; lost: number }) {
  const total = won + lost;
  if (!total) return null;
  const pct = Math.round((won / total) * 100);
  return (
    <figure className="m-0">
      <figcaption className="text-sm font-bold tracking-tight text-charcoal mb-1">Win rate</figcaption>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-2xl font-bold text-charcoal tabular-nums">{pct}%</span>
        <span className="text-[12px] text-charcoal-muted">{won} won · {lost} lost</span>
      </div>
      <div className="h-2.5 rounded-[3px] overflow-hidden flex" style={{ background: "#F4F5F3" }} role="img"
           aria-label={`${pct} per cent win rate: ${won} won of ${total} closed`}>
        <div style={{ width: `${pct}%`, background: EM }} />
        <div style={{ width: 2, background: "#fff" }} />
      </div>
    </figure>
  );
}
