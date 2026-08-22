import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Card, Badge } from "@/components/ui";
import { AED, estimatesList, estStatusTone } from "@/lib/data";

export default function EstimatingPage() {
  return (
    <Shell>
      <div className="mb-5 flex items-end justify-between">
        <div><h1 className="text-xl font-bold tracking-tight">Estimating</h1><p className="text-sm text-charcoal-muted">Cost library, rates and priced estimates</p></div>
        <button className="bg-emerald text-white text-sm font-semibold px-4 py-2 rounded-card">New estimate</button>
      </div>
      <Card className="p-5">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-[11px] uppercase tracking-wider text-charcoal-muted border-b border-line">
            <th className="py-2 font-semibold">Ref</th><th className="font-semibold">Estimate</th><th className="font-semibold">Tender</th>
            <th className="font-semibold text-right">Lines</th><th className="font-semibold text-right">Sell price</th><th className="font-semibold">Status</th><th></th>
          </tr></thead>
          <tbody>
            {estimatesList.map((e) => (
              <tr key={e.ref} className="border-b border-line/60">
                <td className="py-2.5 font-mono text-[12px]">{e.ref}</td>
                <td className="font-semibold text-charcoal">{e.title}</td>
                <td className="text-charcoal-muted font-mono text-[12px]">{e.tender}</td>
                <td className="text-right">{e.lines}</td>
                <td className="text-right font-semibold">{AED(e.value)}</td>
                <td><Badge className={estStatusTone[e.status] ?? "bg-line"}>{e.status}</Badge></td>
                <td className="text-right"><Link href={`/estimating/${e.ref}`} className="text-xs text-emerald font-semibold">Open →</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Shell>
  );
}
