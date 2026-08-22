// CSV export helpers. `toCsv` is pure (and unit-tested); `downloadCsv` triggers
// a browser download and is only called client-side.

export type CsvColumn<T> = { header: string; value: (row: T) => string | number | null | undefined };

function cell(v: string | number | null | undefined): string {
  const s = v === null || v === undefined ? "" : String(v);
  // RFC 4180: quote if the field contains a comma, quote or newline; escape quotes by doubling.
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv<T>(rows: T[], columns: CsvColumn<T>[]): string {
  const head = columns.map((c) => cell(c.header)).join(",");
  const body = rows.map((r) => columns.map((c) => cell(c.value(r))).join(",")).join("\r\n");
  return body ? `${head}\r\n${body}` : head;
}

export function downloadCsv<T>(filename: string, rows: T[], columns: CsvColumn<T>[]): void {
  const csv = toCsv(rows, columns);
  triggerDownload(filename, csv);
}

type Scalar = string | number | null | undefined;

// Array-based variant for the table component (which already holds raw row values).
export function gridToCsv(headers: string[], dataRows: Scalar[][]): string {
  return [headers, ...dataRows].map((r) => r.map(cell).join(",")).join("\r\n");
}

export function downloadGrid(filename: string, headers: string[], dataRows: Scalar[][]): void {
  triggerDownload(filename, gridToCsv(headers, dataRows));
}

function triggerDownload(filename: string, csv: string): void {
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" }); // BOM for Excel
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
