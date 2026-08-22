// Seed an organisation, an owner, a few companies, tenders and a project.
// Run: npm run db:seed  (after migrate)
import { PrismaClient, Role, CompanyType, Trade, TenderStatus, ProjectStatus, LeadStage, OpportunityStatus, OpportunityStage, ActivityType, RateType, EstimateStatus, VariationStatus, RfiStatus, InspectionResult, SnagStatus, Severity, NcrStatus, IncidentType, PoStatus, DocStatus, InvoiceStatus } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.organisation.findFirst({ where: { name: "EDM Holdings" } });
  if (existing) {
    // eslint-disable-next-line no-console
    console.log("Seed: 'EDM Holdings' already exists — skipping (seed is idempotent).");
    return;
  }
  const org = await prisma.organisation.create({
    data: { name: "EDM Holdings", tradeName: "EDM Holdings", licenceNo: "TBC" },
  });

  // Configuration layer: trades, workflows and feature flags as DATA.
  await prisma.organisationSettings.create({
    data: {
      organisationId: org.id,
      config: {
        enabledTrades: ["DRYWALL", "CEILINGS", "JOINERY", "TIMBER_CLADDING", "ALUMINIUM_GLAZING", "PAINTING", "FITOUT", "REFURBISHMENT", "TECHNICAL"],
        features: { tenders: true, estimating: true, projects: true, siteReports: true, crm: true,
          variations: true, rfis: true, quality: true, hse: true, procurement: true, documents: true, tradeModules: true, mobile: false, financials: true, ai: false },
        fiscal: { currency: "AED", retentionPctDefault: 5, overheadPctDefault: 8, profitPctDefault: 12 },
      },
    },
  });

  const owner = await prisma.user.create({
    data: {
      email: "damien@edmholdings.ae",
      firstName: "Damien",
      lastName: "Meenan",
      jobTitle: "Founder",
      organisationId: org.id,
      memberships: { create: { organisationId: org.id, role: Role.OWNER } },
    },
  });

  const [bigMain, dev, consultant] = await Promise.all([
    prisma.company.create({ data: { organisationId: org.id, name: "Tier-1 Main Contractor LLC", type: CompanyType.MAIN_CONTRACTOR, city: "Dubai" } }),
    prisma.company.create({ data: { organisationId: org.id, name: "Prime Developer FZ", type: CompanyType.DEVELOPER, city: "Dubai" } }),
    prisma.company.create({ data: { organisationId: org.id, name: "Design Consultants", type: CompanyType.CONSULTANT, city: "Abu Dhabi" } }),
  ]);

  // ---- CRM demo data ----
  await prisma.contact.createMany({
    data: [
      { companyId: bigMain.id, firstName: "Sarah", lastName: "Khan", jobTitle: "Procurement Manager", email: "s.khan@example.com", isPrimary: true },
      { companyId: dev.id, firstName: "Omar", lastName: "Al Rashid", jobTitle: "Development Director", email: "omar@example.com", isPrimary: true },
      { companyId: consultant.id, firstName: "Priya", lastName: "Nair", jobTitle: "Lead Architect", email: "priya@example.com", isPrimary: true },
    ],
  });

  const lead = await prisma.lead.create({
    data: {
      organisationId: org.id, title: "Downtown tower fit-out package", companyId: dev.id,
      source: "Referral", stage: LeadStage.QUALIFYING, estValue: 1600000,
      nextFollowUpAt: new Date(Date.now() + 2 * 864e5), ownerUserId: owner.id,
      notes: "Drywall + ceilings + joinery across 6 floors.",
    },
  });

  await prisma.opportunity.createMany({
    data: [
      { organisationId: org.id, companyId: bigMain.id, name: "Business Bay Office Fit-Out", value: 1850000, probability: 55, status: OpportunityStatus.OPEN, stage: OpportunityStage.PROPOSAL, expectedClose: new Date(Date.now() + 30 * 864e5) },
      { organisationId: org.id, companyId: dev.id, name: "JBR Hotel Guest Floors", value: 2640000, probability: 35, status: OpportunityStatus.OPEN, stage: OpportunityStage.ENGAGED, expectedClose: new Date(Date.now() + 60 * 864e5) },
    ],
  });

  await prisma.activity.createMany({
    data: [
      { organisationId: org.id, type: ActivityType.CALL, subject: "Chase tender clarification — Business Bay", dueAt: new Date(Date.now() + 1 * 864e5), ownerUserId: owner.id, leadId: lead.id },
      { organisationId: org.id, type: ActivityType.MEETING, subject: "Site walkover with main contractor", dueAt: new Date(Date.now() + 4 * 864e5), ownerUserId: owner.id },
    ],
  });

  await prisma.tender.createMany({
    data: [
      { organisationId: org.id, tenderNo: "EDM-T-0001", projectName: "Business Bay Office Fit-Out", clientId: dev.id, mainContractorId: bigMain.id, consultantId: consultant.id, trades: [Trade.DRYWALL, Trade.CEILINGS, Trade.PAINTING], value: 1850000, status: TenderStatus.IN_PROGRESS, awardProbability: 55, dueDate: new Date(Date.now() + 12 * 864e5) },
      { organisationId: org.id, tenderNo: "EDM-T-0002", projectName: "DIFC Retail Refurbishment", clientId: dev.id, mainContractorId: bigMain.id, trades: [Trade.DRYWALL, Trade.JOINERY], value: 920000, status: TenderStatus.SUBMITTED, awardProbability: 40, dueDate: new Date(Date.now() + 3 * 864e5) },
    ],
  });

  const project = await prisma.project.create({
    data: {
      organisationId: org.id, code: "EDM-P-0001", name: "Sheikh Zayed Road HQ Fit-Out",
      clientId: bigMain.id, trades: [Trade.DRYWALL, Trade.CEILINGS, Trade.JOINERY, Trade.PAINTING],
      status: ProjectStatus.ACTIVE, contractValue: 2400000, emirate: "Dubai", managerUserId: owner.id,
      startDate: new Date(), endDate: new Date(Date.now() + 90 * 864e5),
      milestones: { create: [{ name: "Partitions complete" }, { name: "Ceilings complete" }, { name: "Handover" }] },
    },
  });

  // ---- Site reporting demo data ----
  await prisma.dailyReport.create({
    data: {
      project: { connect: { id: project.id } }, reportDate: new Date(Date.now() - 2 * 864e5),
      weather: "Clear", temperatureC: 39, notes: "Partitions to level 3 ongoing; ceilings set-out started.",
      labour: { create: [ { trade: Trade.DRYWALL, headcount: 8, hours: 72 }, { trade: Trade.CEILINGS, headcount: 4, hours: 36 } ] },
      plant: { create: [ { item: "Scissor lift", quantity: 2, hours: 14 } ] },
      deliveries: { create: [ { material: "12.5mm plasterboard", quantity: 120, unit: "sheets" }, { material: "MF ceiling sections", quantity: 90, unit: "lengths" } ] },
    },
  });
  await prisma.dailyReport.create({
    data: {
      project: { connect: { id: project.id } }, reportDate: new Date(Date.now() - 1 * 864e5),
      weather: "Hot, hazy", temperatureC: 42, delays: "Material hoist down 2 hrs (maintenance).",
      notes: "Boarding to level 3 complete; painting mobilising level 2.",
      labour: { create: [ { trade: Trade.DRYWALL, headcount: 6, hours: 54 }, { trade: Trade.CEILINGS, headcount: 5, hours: 45 }, { trade: Trade.PAINTING, headcount: 3, hours: 24 } ] },
      plant: { create: [ { item: "Scissor lift", quantity: 2, hours: 12 }, { item: "Material hoist", quantity: 1, hours: 6 } ] },
      deliveries: { create: [ { material: "Emulsion paint (white)", quantity: 40, unit: "pails" } ] },
    },
  });

  // ---- Procurement demo data ----
  const [boardSupplier, paintSupplier] = await Promise.all([
    prisma.supplier.create({ data: { organisationId: org.id, name: "Gulf Drywall Supplies", trade: Trade.DRYWALL, contactName: "Rashid", email: "sales@gulfdrywall.example", rating: 4 } }),
    prisma.supplier.create({ data: { organisationId: org.id, name: "Emirates Paint Co", trade: Trade.PAINTING, contactName: "Lina", email: "orders@empaint.example", rating: 5 } }),
  ]);
  const po1 = await prisma.purchaseOrder.create({
    data: { organisationId: org.id, projectId: project.id, supplierId: boardSupplier.id, poNo: "PO-0001", status: PoStatus.ISSUED, currency: "AED", issuedAt: new Date(Date.now() - 7 * 864e5), expectedAt: new Date(Date.now() + 2 * 864e5),
      lines: { create: [
        { description: "12.5mm standard plasterboard", qty: 1200, unit: "sheets", unitPrice: 9.5, receivedQty: 800 },
        { description: "Metal stud 70mm", qty: 900, unit: "lengths", unitPrice: 12.25, receivedQty: 600 },
      ] } },
  });
  await prisma.purchaseOrder.update({ where: { id: po1.id }, data: { total: 1200 * 9.5 + 900 * 12.25, status: PoStatus.PARTIALLY_RECEIVED } });
  const po2 = await prisma.purchaseOrder.create({
    data: { organisationId: org.id, projectId: project.id, supplierId: paintSupplier.id, poNo: "PO-0002", status: PoStatus.ISSUED, currency: "AED", issuedAt: new Date(Date.now() - 2 * 864e5), expectedAt: new Date(Date.now() + 5 * 864e5),
      lines: { create: [ { description: "Emulsion paint (white) 20L", qty: 60, unit: "pails", unitPrice: 145 } ] } },
  });
  await prisma.purchaseOrder.update({ where: { id: po2.id }, data: { total: 60 * 145 } });

  // ---- Trade progress demo data ----
  await prisma.tradeProgress.createMany({
    data: [
      { projectId: project.id, trade: Trade.DRYWALL, area: "Level 3", quantity: 420, unit: "m2", attributes: { boardType: "12.5mm standard", fireRating: "60 min", partitionType: "Metal stud, single layer" } },
      { projectId: project.id, trade: Trade.DRYWALL, area: "Risers", quantity: 160, unit: "m2", attributes: { boardType: "2 x 15mm Fireline", fireRating: "120 min", partitionType: "Shaftwall" } },
      { projectId: project.id, trade: Trade.CEILINGS, area: "Levels 2-3", quantity: 690, unit: "m2", attributes: { gridSystem: "MF concealed", tileSystem: "Plasterboard skim" } },
      { projectId: project.id, trade: Trade.PAINTING, area: "Level 2", quantity: 1840, unit: "m2", attributes: { stage: "finish", coats: 2, system: "Emulsion matt" } },
    ],
  });

  // ---- Financials demo data ----
  await prisma.project.update({ where: { id: project.id }, data: { contractValue: 1_850_000, retentionPct: 5 } });
  const [cc1, cc2, cc3, cc4, cc5] = await Promise.all([
    prisma.costCode.create({ data: { organisationId: org.id, code: "CC-100", description: "Drywall & ceilings", trade: Trade.DRYWALL } }),
    prisma.costCode.create({ data: { organisationId: org.id, code: "CC-200", description: "Joinery", trade: Trade.JOINERY } }),
    prisma.costCode.create({ data: { organisationId: org.id, code: "CC-300", description: "Painting & finishes", trade: Trade.PAINTING } }),
    prisma.costCode.create({ data: { organisationId: org.id, code: "CC-400", description: "Glazing & aluminium", trade: Trade.ALUMINIUM_GLAZING } }),
    prisma.costCode.create({ data: { organisationId: org.id, code: "CC-500", description: "Prelims & management" } }),
  ]);
  await prisma.budget.createMany({
    data: [
      { organisationId: org.id, projectId: project.id, costCodeId: cc1.id, description: "Drywall & ceilings", budgetAmount: 620000, committedAmount: 540000, actualAmount: 360000 },
      { organisationId: org.id, projectId: project.id, costCodeId: cc2.id, description: "Joinery", budgetAmount: 280000, committedAmount: 210000, actualAmount: 90000 },
      { organisationId: org.id, projectId: project.id, costCodeId: cc3.id, description: "Painting & finishes", budgetAmount: 180000, committedAmount: 120000, actualAmount: 95000 },
      { organisationId: org.id, projectId: project.id, costCodeId: cc4.id, description: "Glazing & aluminium", budgetAmount: 240000, committedAmount: 180000, actualAmount: 60000 },
      { organisationId: org.id, projectId: project.id, costCodeId: cc5.id, description: "Prelims & management", budgetAmount: 160000, committedAmount: 160000, actualAmount: 110000 },
    ],
  });
  await prisma.invoice.createMany({
    data: [
      { organisationId: org.id, projectId: project.id, invoiceNo: "IPC-01", status: InvoiceStatus.PAID, grossAmount: 420000, retentionAmount: 21000, netAmount: 399000, issuedAt: new Date(Date.now() - 45 * 864e5), dueAt: new Date(Date.now() - 15 * 864e5), paidAt: new Date(Date.now() - 10 * 864e5) },
      { organisationId: org.id, projectId: project.id, invoiceNo: "IPC-02", status: InvoiceStatus.CERTIFIED, grossAmount: 360000, retentionAmount: 18000, netAmount: 342000, issuedAt: new Date(Date.now() - 15 * 864e5), dueAt: new Date(Date.now() + 15 * 864e5) },
      { organisationId: org.id, projectId: project.id, invoiceNo: "IPC-03", status: InvoiceStatus.SUBMITTED, grossAmount: 280000, retentionAmount: 14000, netAmount: 266000, issuedAt: new Date(Date.now() - 3 * 864e5), dueAt: new Date(Date.now() + 27 * 864e5) },
    ],
  });

  // ---- Document control demo data ----
  await prisma.document.create({
    data: { organisationId: org.id, projectId: project.id, title: "L3 Partition Layout", category: "drawing", status: DocStatus.FOR_REVIEW, currentRev: "C", revisions: { create: [
      { revision: "A", storageKey: "docs/l3-part-a.pdf", fileName: "L3-Partition-Layout-RevA.pdf", note: "Initial issue" },
      { revision: "B", storageKey: "docs/l3-part-b.pdf", fileName: "L3-Partition-Layout-RevB.pdf", note: "Coordination updates" },
      { revision: "C", storageKey: "docs/l3-part-c.pdf", fileName: "L3-Partition-Layout-RevC.pdf", note: "Client comments incorporated" },
    ] } },
  });
  await prisma.document.createMany({ data: [] });
  await prisma.document.create({ data: { organisationId: org.id, projectId: project.id, title: "Main Subcontract Agreement", category: "contract", status: DocStatus.APPROVED, currentRev: "A", revisions: { create: { revision: "A", storageKey: "docs/subcontract-a.pdf", fileName: "Subcontract-Agreement.pdf" } } } });
  await prisma.document.create({ data: { organisationId: org.id, projectId: project.id, title: "Drywall Specification 09 21 16", category: "spec", status: DocStatus.APPROVED, currentRev: "A", revisions: { create: { revision: "A", storageKey: "docs/spec-dw-a.pdf", fileName: "Drywall-Spec.pdf" } } } });
  await prisma.document.create({ data: { organisationId: org.id, projectId: project.id, title: "Ceiling Tile Submittal", category: "submittal", status: DocStatus.DRAFT, currentRev: "A", revisions: { create: { revision: "A", storageKey: "docs/submittal-clg-a.pdf", fileName: "Ceiling-Submittal.pdf" } } } });

  // ---- HSE demo data ----
  await prisma.incident.create({
    data: { organisationId: org.id, projectId: project.id, ref: "INC-001", type: IncidentType.NEAR_MISS, severity: Severity.MEDIUM, description: "Operative nearly struck by material lowered from level 3; exclusion zone not maintained.", occurredAt: new Date(Date.now() - 6 * 864e5), reportedById: owner.id, rootCause: "Exclusion zone signage not in place.", actionsTaken: "Re-briefed crew; barriers installed; added to toolbox talk." },
  });
  await prisma.toolboxTalk.createMany({
    data: [
      { organisationId: org.id, projectId: project.id, topic: "Working at height — scissor lift safety", conductedAt: new Date(Date.now() - 5 * 864e5), attendees: 14, notes: "Covered pre-use checks and exclusion zones." },
      { organisationId: org.id, projectId: project.id, topic: "Manual handling — plasterboard", conductedAt: new Date(Date.now() - 2 * 864e5), attendees: 11 },
    ],
  });
  await prisma.riskAssessment.create({
    data: { organisationId: org.id, projectId: project.id, ref: "RA-001", activity: "Suspended ceiling installation from scissor lifts", residualRisk: Severity.MEDIUM, reviewedAt: new Date(Date.now() - 3 * 864e5), hazards: [
      { hazard: "Fall from height", likelihood: 2, severity: 4, control: "Trained operators, harness where required, exclusion zone" },
      { hazard: "Falling objects", likelihood: 3, severity: 3, control: "Tool tethers, hard hats, barriers below" },
    ] },
  });

  // ---- Quality demo data ----
  const template = await prisma.checklistTemplate.create({
    data: { name: "Drywall partition pre-board check", trade: Trade.DRYWALL, items: [
      { id: "1", text: "Studs at correct centres", required: true },
      { id: "2", text: "Service penetrations sealed", required: true },
      { id: "3", text: "Insulation installed", required: true },
    ] },
  });
  const inspection = await prisma.inspection.create({
    data: { organisationId: org.id, projectId: project.id, templateId: template.id, ref: "INS-001", title: "Level 3 partition pre-board inspection", trade: Trade.DRYWALL, result: InspectionResult.PASS_WITH_COMMENTS, inspectedAt: new Date(Date.now() - 2 * 864e5), inspectorId: owner.id },
  });
  await prisma.snag.createMany({
    data: [
      { projectId: project.id, inspectionId: inspection.id, ref: "SNG-001", description: "Service penetration to riser not fully sealed", location: "Level 3, grid C/4", trade: Trade.DRYWALL, status: SnagStatus.OPEN },
      { projectId: project.id, ref: "SNG-002", description: "Ceiling tile edge damaged", location: "Level 2 open-plan", trade: Trade.CEILINGS, status: SnagStatus.IN_PROGRESS },
      { projectId: project.id, ref: "SNG-003", description: "Paint touch-up required at door frame", location: "Level 2, office 204", trade: Trade.PAINTING, status: SnagStatus.CLOSED, closedAt: new Date(Date.now() - 1 * 864e5) },
    ],
  });
  await prisma.ncr.create({
    data: { organisationId: org.id, projectId: project.id, ref: "NCR-001", title: "Incorrect board type to fire-rated partition", description: "Standard board installed where fire-rated specified at riser wall.", severity: Severity.HIGH, status: NcrStatus.CORRECTIVE_ACTION, correctiveAction: "Remove and replace with 2 x 15mm Fireline board; re-inspect." },
  });

  // ---- RFI demo data ----
  await prisma.rfi.createMany({
    data: [
      { organisationId: org.id, projectId: project.id, ref: "RFI-001", subject: "Ceiling height at reception soffit", question: "Confirm finished ceiling height where structural downstand occurs at grid C/4.", status: RfiStatus.OPEN, dueDate: new Date(Date.now() - 2 * 864e5) },
      { organisationId: org.id, projectId: project.id, ref: "RFI-002", subject: "Partition fire rating to electrical riser", question: "Confirm required fire rating for shaftwall to riser — 60 or 120 min?", status: RfiStatus.OPEN, dueDate: new Date(Date.now() + 4 * 864e5) },
      { organisationId: org.id, projectId: project.id, ref: "RFI-003", subject: "Paint sheen to boardroom feature wall", question: "Confirm sheen level for feature wall paint.", status: RfiStatus.ANSWERED, dueDate: new Date(Date.now() - 1 * 864e5), response: "Matt finish confirmed (spec 09 91 23).", answeredAt: new Date(Date.now() - 3 * 864e5) },
      { organisationId: org.id, projectId: project.id, ref: "RFI-004", subject: "Door frame detail at glazed partition", question: "Confirm frame detail at glazed partition junction.", status: RfiStatus.CLOSED, answeredAt: new Date(Date.now() - 10 * 864e5) },
    ],
  });

  // ---- Variations demo data ----
  await prisma.variation.createMany({
    data: [
      { organisationId: org.id, projectId: project.id, ref: "VO-001", title: "Additional partitions to meeting suite", value: 42000, status: VariationStatus.APPROVED, submittedAt: new Date(Date.now() - 20 * 864e5), decidedAt: new Date(Date.now() - 12 * 864e5) },
      { organisationId: org.id, projectId: project.id, ref: "VO-002", title: "Upgraded acoustic ceiling to boardroom", value: 28500, status: VariationStatus.SUBMITTED, submittedAt: new Date(Date.now() - 5 * 864e5) },
      { organisationId: org.id, projectId: project.id, ref: "VO-003", title: "Feature timber slat wall to reception", value: 64000, status: VariationStatus.UNDER_REVIEW, submittedAt: new Date(Date.now() - 3 * 864e5) },
      { organisationId: org.id, projectId: project.id, ref: "VO-004", title: "Revised paint specification (client request)", value: 9800, status: VariationStatus.DRAFT },
    ],
  });

  // ---- Estimating demo data ----
  await prisma.costItem.createMany({
    data: [
      { organisationId: org.id, code: "DW-100", description: "Metal stud partition, 1 layer 12.5mm board both sides, insulated", trade: Trade.DRYWALL, unit: "m2" },
      { organisationId: org.id, code: "CL-200", description: "Suspended MF plasterboard ceiling, skim finish", trade: Trade.CEILINGS, unit: "m2" },
      { organisationId: org.id, code: "PT-300", description: "Prep + 1 mist + 2 finish coats emulsion to walls", trade: Trade.PAINTING, unit: "m2" },
    ],
  });
  await prisma.rate.createMany({
    data: [
      { organisationId: org.id, type: RateType.LABOUR, description: "Drywall fixer (incl. supervision)", unit: "hr", rate: 38 },
      { organisationId: org.id, type: RateType.MATERIAL, description: "12.5mm standard plasterboard", unit: "m2", rate: 9.5 },
      { organisationId: org.id, type: RateType.LABOUR, description: "Painter", unit: "hr", rate: 32 },
    ],
  });
  const estimate = await prisma.estimate.create({
    data: {
      organisationId: org.id, ref: "EST-0001", title: "Business Bay Office Fit-Out — drywall, ceilings & paint",
      status: EstimateStatus.DRAFT, overheadPct: 8, profitPct: 12, contingencyPct: 2, currency: "AED",
      lines: {
        create: [
          { description: "Metal stud partitions to open-plan + offices", trade: Trade.DRYWALL, unit: "m2", qty: 640, labourRate: 28, materialRate: 34, plantRate: 1.5, subRate: 0, sortOrder: 1 },
          { description: "Shaftwall to risers", trade: Trade.DRYWALL, unit: "m2", qty: 120, labourRate: 40, materialRate: 52, plantRate: 2, subRate: 0, sortOrder: 2 },
          { description: "Suspended MF ceilings, skim finish", trade: Trade.CEILINGS, unit: "m2", qty: 980, labourRate: 24, materialRate: 26, plantRate: 2, subRate: 0, sortOrder: 3 },
          { description: "Decoration to walls & ceilings", trade: Trade.PAINTING, unit: "m2", qty: 2600, labourRate: 7, materialRate: 4.5, plantRate: 0, subRate: 0, sortOrder: 4 },
          { description: "Access equipment hire", trade: Trade.TECHNICAL, unit: "item", qty: 1, labourRate: 0, materialRate: 0, plantRate: 0, subRate: 8500, sortOrder: 5 },
        ],
      },
    },
  });
  await prisma.quotation.create({ data: { estimateId: estimate.id, quoteNo: "EST-0001-Q", revision: 0, total: 0, issuedAt: new Date(), validUntil: new Date(Date.now() + 30 * 864e5) } });

  console.log("Seeded organisation:", org.name);
}

main().then(() => prisma.$disconnect()).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
