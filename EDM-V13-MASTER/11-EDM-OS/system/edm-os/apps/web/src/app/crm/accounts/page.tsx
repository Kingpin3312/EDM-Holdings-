import { Shell } from "@/components/Shell";
import { CrmTabs } from "@/components/CrmTabs";
import { Card, Badge, SectionTitle } from "@/components/ui";
import { AED, companyTone, accountFocus } from "@/lib/data";
import { getAccounts } from "@/lib/server-data";
import { DataSourceBanner } from "@/components/DataSource";

export default async function AccountsPage() {
  const accountsS = await getAccounts();
  const accounts = accountsS.data;

  const totalWon = accounts.reduce((s, a) => s + a.wonValue, 0);
  const top = accounts.reduce((a, b) => (b.wonValue > a.wonValue ? b : a), accounts[0]);
  const withClosed = accounts.filter((a) => a.wonCount + a.lostCount > 0);
  const avgWin = withClosed.length ? Math.round(withClosed.reduce((s, a) => s + a.winRatePct, 0) / withClosed.length) : 0;
  const totalWeighted = accounts.reduce((s, a) => s + a.openWeighted, 0);

  return (
    <Shell>
      <div className="mb-5 flex items-end justify-between gap-3 flex-wrap">
        <div><h1 className="text-xl font-bold tracking-tight">CRM</h1><p className="text-sm text-charcoal-muted">Account intelligence — who you win with, and where to focus</p></div>
        <button className="bg-emerald text-white text-sm font-semibold px-4 py-2 rounded-card">Add account</button>
      </div>
      <CrmTabs active="accounts" />
      <DataSourceBanner source={accountsS.source} reason={accountsS.reason} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Active clients</div><div className="mt-1 text-2xl font-bold">{accounts.length}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Won value (all clients)</div><div className="mt-1 text-2xl font-bold">{AED(totalWon)}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Top client</div><div className="mt-1 text-[15px] font-bold leading-tight">{top?.name}</div><div className="text-xs text-charcoal-muted">{AED(top?.wonValue ?? 0)} won</div></Card>
        <Card className="p-4 bg-emerald text-white border-emerald"><div className="text-[11px] uppercase tracking-wider font-semibold text-emerald-on">Avg win rate</div><div className="mt-1 text-2xl font-bold">{avgWin}%</div></Card>
      </div>

      <Card className="p-5">
        <div className="flex items-baseline justify-between mb-1">
          <SectionTitle>Client scorecards</SectionTitle>
          <span className="text-[12px] text-charcoal-muted">{AED(totalWeighted)} weighted pipeline live</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead><tr className="text-left text-[11px] uppercase tracking-wider text-charcoal-muted border-b border-line">
              <th className="py-2 font-semibold w-8">#</th>
              <th className="font-semibold">Client</th>
              <th className="font-semibold">Win rate</th>
              <th className="font-semibold text-right">Won value</th>
              <th className="font-semibold text-right">Record</th>
              <th className="font-semibold text-right">Active pipeline</th>
              <th className="font-semibold">Focus</th>
            </tr></thead>
            <tbody>
              {accounts.map((a, i) => {
                const focus = accountFocus(a);
                return (
                  <tr key={a.id} className="border-b border-line/60">
                    <td className="py-3 text-charcoal-muted font-semibold">{i + 1}</td>
                    <td>
                      <div className="font-semibold text-charcoal">{a.name}</div>
                      <Badge className={`${companyTone[a.type] ?? "bg-line"} mt-1`}>{a.type}</Badge>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 rounded-full bg-line overflow-hidden">
                          <div className="h-full bg-emerald rounded-full" style={{ width: `${a.winRatePct}%` }} />
                        </div>
                        <span className="text-[12px] font-semibold text-charcoal tabular-nums">{a.winRatePct}%</span>
                      </div>
                    </td>
                    <td className="text-right font-semibold">{AED(a.wonValue)}</td>
                    <td className="text-right text-charcoal-muted text-[12px]">{a.wonCount}W · {a.lostCount}L</td>
                    <td className="text-right">
                      <div className="font-semibold">{AED(a.openWeighted)}</div>
                      <div className="text-[11px] text-charcoal-muted">{a.openCount} live</div>
                    </td>
                    <td><Badge className={focus.tone}>{focus.label}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-[12px] text-charcoal-muted mt-4 pt-4 border-t border-line">
          Ranked by a score that rewards both your win rate with a client and the value at stake. Key accounts are where you win and there's money on the table — protect and grow them. &ldquo;Reassess&rdquo; flags clients you keep losing with: qualify harder before spending estimating time.
        </p>
      </Card>
    </Shell>
  );
}
