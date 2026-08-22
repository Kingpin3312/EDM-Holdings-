// Unit tests for the pure money and labour engines. No database, no network.
// Run: node --test apps/api/test/
//
// These two files decide what EDM charges and what EDM pays. labour.ts described
// itself as "unit-tested" while no test existed anywhere in the repository; this
// is that test.
import { test } from "node:test";
import assert from "node:assert/strict";

const { priceEstimate } = await import("../dist/estimating/estimates/pricing.js");
const {
  splitHours, dayCost, attendanceSummary, allocationVariance,
  productivity, productivityVsTarget, aggregateTimesheet,
  timesheetCharge, timesheetMargin, STANDARD_DAY_HOURS, OT_MULTIPLIER,
} = await import("../dist/labour/labour.js");

// ---------------------------------------------------------------- pricing ----

test("priceEstimate: direct cost is qty x the four rates, summed", () => {
  const r = priceEstimate({
    overheadPct: 0, profitPct: 0, contingencyPct: 0,
    lines: [{ trade: "DRYWALL", qty: 100, labourRate: 12, materialRate: 8, plantRate: 1, subRate: 0 }],
  });
  assert.equal(r.categories.labour, 1200);
  assert.equal(r.categories.material, 800);
  assert.equal(r.categories.plant, 100);
  assert.equal(r.directCost, 2100);
  assert.equal(r.sellPrice, 2100);
  assert.equal(r.marginPct, 0);
});

test("priceEstimate: markups are each a percentage of direct cost, not compounded", () => {
  const r = priceEstimate({
    overheadPct: 8, profitPct: 12, contingencyPct: 5,
    lines: [{ trade: "DRYWALL", qty: 1, labourRate: 1000, materialRate: 0, plantRate: 0, subRate: 0 }],
  });
  assert.equal(r.overhead, 80);
  assert.equal(r.contingency, 50);
  assert.equal(r.profit, 120);
  assert.equal(r.sellPrice, 1250, "sell = direct + overhead + contingency + profit");
  assert.equal(r.marginPct, 20, "margin% is measured against sell, not against cost");
});

test("priceEstimate: an empty estimate does not divide by zero", () => {
  const r = priceEstimate({ overheadPct: 8, profitPct: 12, contingencyPct: 5, lines: [] });
  assert.equal(r.sellPrice, 0);
  assert.equal(r.marginPct, 0);
});

test("priceEstimate: lines of the same trade accumulate", () => {
  const r = priceEstimate({
    overheadPct: 0, profitPct: 0, contingencyPct: 0,
    lines: [
      { trade: "DRYWALL", qty: 10, labourRate: 10, materialRate: 0, plantRate: 0, subRate: 0 },
      { trade: "DRYWALL", qty: 5,  labourRate: 10, materialRate: 0, plantRate: 0, subRate: 0 },
      { trade: "CEILINGS", qty: 2, labourRate: 50, materialRate: 0, plantRate: 0, subRate: 0 },
    ],
  });
  assert.equal(r.byTrade.DRYWALL, 150);
  assert.equal(r.byTrade.CEILINGS, 100);
});

// ----------------------------------------------------------------- labour ----

test("splitHours: a standard day is all regular, anything over is overtime", () => {
  assert.deepEqual(splitHours(9), { regular: 9, overtime: 0 });
  assert.deepEqual(splitHours(11), { regular: 9, overtime: 2 });
  assert.deepEqual(splitHours(4), { regular: 4, overtime: 0 });
  assert.deepEqual(splitHours(0), { regular: 0, overtime: 0 });
});

test("dayCost: a full standard day costs exactly the day rate", () => {
  assert.equal(dayCost({ hours: STANDARD_DAY_HOURS, dayRate: 180 }), 180);
});

test("dayCost: a half day is pro-rated, overtime carries the multiplier", () => {
  assert.equal(dayCost({ hours: 4.5, dayRate: 180 }), 90);
  // 9h at 20/h = 180, plus 2h at 20 x 1.25 = 50
  assert.equal(dayCost({ hours: 11, dayRate: 180 }), 230);
  assert.equal(OT_MULTIPLIER, 1.25);
});

test("attendanceSummary: counts, hours and cost roll up per crew", () => {
  const s = attendanceSummary([
    { workerId: "a", trade: "DRYWALL", status: "PRESENT", hours: 9,  dayRate: 180 },
    { workerId: "b", trade: "DRYWALL", status: "PRESENT", hours: 11, dayRate: 180 },
    { workerId: "c", trade: "CEILINGS", status: "ABSENT", hours: 0,  dayRate: 180 },
  ]);
  assert.equal(s.present, 2);
  assert.equal(s.absent, 1);
  assert.equal(s.manHours, 20);
  assert.equal(s.overtimeHours, 2);
  assert.equal(s.cost, 410);
  assert.deepEqual(s.byTrade, [{ trade: "DRYWALL", present: 2, manHours: 20 }]);
});

test("allocationVariance: short, on-plan and over are reported correctly", () => {
  assert.deepEqual(allocationVariance(10, 8),  { variance: -2, pct: 80,  status: "short" });
  assert.deepEqual(allocationVariance(10, 10), { variance: 0,  pct: 100, status: "on-plan" });
  assert.deepEqual(allocationVariance(10, 12), { variance: 2,  pct: 120, status: "over" });
  assert.deepEqual(allocationVariance(0, 5),   { variance: 5,  pct: 0,   status: "over" });
});

test("productivity: output per man-day and per man-hour, with no divide by zero", () => {
  assert.deepEqual(productivity({ installedQty: 180, manHours: 90 }), { perManDay: 18, perManHour: 2 });
  assert.deepEqual(productivity({ installedQty: 100, manHours: 0 }),  { perManDay: 0,  perManHour: 0 });
});

test("productivityVsTarget: 95-105 percent is on target", () => {
  assert.equal(productivityVsTarget(18, 20).status, "below");
  assert.equal(productivityVsTarget(20, 20).status, "on-target");
  assert.equal(productivityVsTarget(24, 20).status, "above");
  assert.equal(productivityVsTarget(10, 0).pct, 0);
});

test("timesheet: cost, charge and margin agree over a week", () => {
  const days = [
    { date: "2026-08-17", status: "PRESENT", hours: 9 },
    { date: "2026-08-18", status: "PRESENT", hours: 11 },
    { date: "2026-08-19", status: "SICK",    hours: 0 },
  ];
  const agg = aggregateTimesheet(days, 180);
  assert.equal(agg.daysWorked, 2);
  assert.equal(agg.regularHours, 18);
  assert.equal(agg.overtimeHours, 2);
  assert.equal(agg.totalHours, 20);
  assert.equal(agg.cost, 410);

  const charge = timesheetCharge({ regularHours: 18, overtimeHours: 2, chargeRate: 30 });
  assert.equal(charge, 615);

  const m = timesheetMargin(agg.cost, charge);
  assert.equal(m.margin, 205);
  assert.equal(m.marginPct, 33.3);
});

test("timesheetMargin: a zero charge does not divide by zero", () => {
  assert.deepEqual(timesheetMargin(100, 0), { margin: -100, marginPct: 0 });
});
