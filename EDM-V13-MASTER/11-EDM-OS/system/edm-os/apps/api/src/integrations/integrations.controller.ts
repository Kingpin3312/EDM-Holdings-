import { Controller, Get, Post, Delete, Query, Body, Module } from "@nestjs/common";
import { CurrentUser, AuthContext } from "../common/current-user.decorator";
import { IntegrationsService } from "./integrations.service";
import { XeroService } from "./xero.service";
import { WhatsAppService } from "./whatsapp.service";
import { DocuSignService } from "./docusign.service";
import { EdmCalendarItem } from "./graph-calendar";
import { XeroContactInput, XeroInvoiceInput } from "./xero-mapping";
import { WhatsAppAlertInput } from "./whatsapp";
import { EnvelopeInput } from "./docusign-mapping";

@Controller("integrations")
export class IntegrationsController {
  constructor(private readonly svc: IntegrationsService, private readonly xero: XeroService, private readonly whatsapp: WhatsAppService, private readonly docusign: DocuSignService) {}

  @Get() list(@CurrentUser() u: AuthContext) {
    return this.svc.list(u.organisationId);
  }

  // Returns the Microsoft consent URL to redirect the user to.
  @Get("microsoft/connect") connect(@CurrentUser() u: AuthContext) {
    return this.svc.getMicrosoftAuthUrl(u.organisationId);
  }

  // OAuth redirect target — Microsoft sends ?code=... here.
  @Get("microsoft/callback") callback(@CurrentUser() u: AuthContext, @Query("code") code: string) {
    return this.svc.handleMicrosoftCallback(u.organisationId, code);
  }

  @Post("microsoft/sync-calendar") sync(@CurrentUser() u: AuthContext, @Body() body: { items: EdmCalendarItem[] }) {
    return this.svc.syncCalendar(u.organisationId, body?.items ?? []);
  }

  @Delete("microsoft") disconnect(@CurrentUser() u: AuthContext) {
    return this.svc.disconnectMicrosoft(u.organisationId);
  }

  // ---- Xero (accounting) ----
  @Get("xero/connect") xeroConnect(@CurrentUser() u: AuthContext) {
    return this.xero.getAuthUrl(u.organisationId);
  }

  @Get("xero/callback") xeroCallback(@CurrentUser() u: AuthContext, @Query("code") code: string) {
    return this.xero.handleCallback(u.organisationId, code);
  }

  @Post("xero/contact") xeroContact(@CurrentUser() u: AuthContext, @Body() body: XeroContactInput) {
    return this.xero.syncContact(u.organisationId, body);
  }

  // Create a DRAFT sales invoice from a won opportunity.
  @Post("xero/invoice") xeroInvoice(@CurrentUser() u: AuthContext, @Body() body: XeroInvoiceInput) {
    return this.xero.createInvoiceFromOpportunity(u.organisationId, body);
  }

  // ---- WhatsApp Business (alerts) ----
  @Post("whatsapp/connect") waConnect(@CurrentUser() u: AuthContext, @Body() body: { phoneNumberId: string; accessToken: string; businessName?: string }) {
    return this.whatsapp.connect(u.organisationId, body);
  }

  @Post("whatsapp/send") waSend(@CurrentUser() u: AuthContext, @Body() body: { alert: WhatsAppAlertInput; to: string; languageCode?: string }) {
    return this.whatsapp.sendAlert(u.organisationId, body.alert, body.to, body.languageCode);
  }

  @Delete("whatsapp") waDisconnect(@CurrentUser() u: AuthContext) {
    return this.whatsapp.disconnect(u.organisationId);
  }

  // ---- DocuSign (e-signature) ----
  @Get("docusign/connect") dsConnect(@CurrentUser() u: AuthContext) {
    return this.docusign.getAuthUrl(u.organisationId);
  }

  @Get("docusign/callback") dsCallback(@CurrentUser() u: AuthContext, @Query("code") code: string) {
    return this.docusign.handleCallback(u.organisationId, code);
  }

  // Send a document out for signature (subcontract, transmittal sign-off).
  @Post("docusign/envelope") dsEnvelope(@CurrentUser() u: AuthContext, @Body() body: EnvelopeInput) {
    return this.docusign.sendEnvelope(u.organisationId, body);
  }

  @Delete("docusign") dsDisconnect(@CurrentUser() u: AuthContext) {
    return this.docusign.disconnect(u.organisationId);
  }
}

@Module({
  controllers: [IntegrationsController],
  providers: [IntegrationsService, XeroService, WhatsAppService, DocuSignService],
})
export class IntegrationsModule {}
