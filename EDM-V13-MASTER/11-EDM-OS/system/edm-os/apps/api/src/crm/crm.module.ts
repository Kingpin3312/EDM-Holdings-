import { Module } from "@nestjs/common";
import { CompaniesController } from "./companies/companies.controller";
import { CompaniesService } from "./companies/companies.service";
import { ContactsController } from "./contacts/contacts.controller";
import { ContactsService } from "./contacts/contacts.service";
import { LeadsController } from "./leads/leads.controller";
import { LeadsService } from "./leads/leads.service";
import { OpportunitiesController } from "./opportunities/opportunities.controller";
import { OpportunitiesService } from "./opportunities/opportunities.service";
import { ActivitiesController } from "./activities/activities.controller";
import { ActivitiesService } from "./activities/activities.service";
import { CrmDashboardController } from "./dashboard.controller";
import { CrmDashboardService } from "./dashboard.service";

// CRM — companies, contacts, leads, opportunities, activities.
// Gated by the `crm` feature flag (on by default).
@Module({
  controllers: [CrmDashboardController, CompaniesController, ContactsController, LeadsController, OpportunitiesController, ActivitiesController],
  providers: [CrmDashboardService, CompaniesService, ContactsService, LeadsService, OpportunitiesService, ActivitiesService],
})
export class CrmModule {}
