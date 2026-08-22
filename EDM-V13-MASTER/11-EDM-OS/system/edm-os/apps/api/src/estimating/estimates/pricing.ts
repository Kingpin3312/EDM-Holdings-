// The pricing engine. Pure function so it is trivially testable and identical
// wherever it is used (summary endpoint, quotation generation, exports).
//
// Convention: overhead, contingency and profit are each applied as a percentage
// of DIRECT COST (transparent and easy to defend in a tender review).
//   sell = directCost + overhead + contingency + profit
//   margin% = (sell - directCost) / sell

export interface PricingLine {
  trade: string; qty: number;
  labourRate: number; materialRate: number; plantRate: number; subRate: number;
}
export interface PricingInput { overheadPct: number; profitPct: number; contingencyPct: number; lines: PricingLine[]; }

const r2 = (n: number) => Math.round(n * 100) / 100;

export function priceEstimate(input: PricingInput) {
  const cat = { labour: 0, material: 0, plant: 0, subcontract: 0 };
  const byTrade: Record<string, number> = {};

  for (const l of input.lines) {
    const labour = l.qty * l.labourRate;
    const material = l.qty * l.materialRate;
    const plant = l.qty * l.plantRate;
    const sub = l.qty * l.subRate;
    cat.labour += labour; cat.material += material; cat.plant += plant; cat.subcontract += sub;
    const lineCost = labour + material + plant + sub;
    byTrade[l.trade] = (byTrade[l.trade] ?? 0) + lineCost;
  }

  const directCost = cat.labour + cat.material + cat.plant + cat.subcontract;
  const overhead = directCost * input.overheadPct / 100;
  const contingency = directCost * input.contingencyPct / 100;
  const profit = directCost * input.profitPct / 100;
  const sellPrice = directCost + overhead + contingency + profit;
  const totalMarkup = overhead + contingency + profit;

  return {
    categories: { labour: r2(cat.labour), material: r2(cat.material), plant: r2(cat.plant), subcontract: r2(cat.subcontract) },
    byTrade: Object.fromEntries(Object.entries(byTrade).map(([k, v]) => [k, r2(v)])),
    directCost: r2(directCost),
    overhead: r2(overhead),
    contingency: r2(contingency),
    profit: r2(profit),
    totalMarkup: r2(totalMarkup),
    sellPrice: r2(sellPrice),
    marginPct: sellPrice > 0 ? r2((totalMarkup / sellPrice) * 100) : 0,
    markups: { overheadPct: input.overheadPct, contingencyPct: input.contingencyPct, profitPct: input.profitPct },
  };
}
