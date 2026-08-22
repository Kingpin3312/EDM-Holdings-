// Spreadsheet-style revision increment: A→B … Z→AA→AB. Keeps revisions
// human-readable and unambiguous across long-running drawings.
export function nextRevision(current: string): string {
  if (!current) return "A";
  const a = current.split("");
  let i = a.length - 1;
  while (i >= 0) {
    if (a[i] === "Z") { a[i] = "A"; i--; if (i < 0) { a.unshift("A"); break; } }
    else { a[i] = String.fromCharCode(a[i].charCodeAt(0) + 1); break; }
  }
  return a.join("");
}
