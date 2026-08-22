"use client";

import { useState, type ReactNode } from "react";
import { downloadGrid } from "@/lib/csv";

// A searchable, exportable table. The server page pre-renders each cell (badges,
// links) as ReactNodes and supplies the raw `search` text and `csv` values — so
// no functions cross the server→client boundary. This component owns the search
// box, the row filtering and the CSV export.
export type TableRow = {
  key: string;
  search: string; // lowercased-matchable text for this row
  cells: ReactNode[]; // pre-rendered display cells, aligned to headers
  csv: (string | number | null | undefined)[]; // raw export values, aligned to headers
};

export function CrmTable({
  headers,
  rows,
  filename,
  placeholder = "Search…",
  align = [],
}: {
  headers: string[];
  rows: TableRow[];
  filename: string;
  placeholder?: string;
  align?: ("left" | "right")[];
}) {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const filtered = query ? rows.filter((r) => r.search.includes(query)) : rows;
  const cls = (i: number) => (align[i] === "right" ? "text-right" : "");

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          className="text-sm border border-line rounded-card px-3 py-2 w-72 bg-white focus:outline-none focus:border-emerald"
        />
        <div className="flex items-center gap-3">
          <span className="text-[12px] text-charcoal-muted">
            {filtered.length}{filtered.length !== rows.length ? ` of ${rows.length}` : ""}
          </span>
          <button
            onClick={() => downloadGrid(filename, headers, filtered.map((r) => r.csv))}
            className="text-sm font-semibold text-emerald border border-emerald rounded-card px-3 py-2 hover:bg-emerald-soft transition-colors"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-charcoal-muted border-b border-line">
              {headers.map((h, i) => (
                <th key={i} className={`py-2 font-semibold ${cls(i)}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.key} className="border-b border-line/60">
                {r.cells.map((cell, i) => (
                  <td key={i} className={`py-2.5 ${cls(i)}`}>{cell}</td>
                ))}
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={headers.length} className="py-6 text-center text-charcoal-muted">No matches.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
