# EDM OS — Integrations

How the integration layer works, and how to connect the first one (Microsoft 365).

## The model

Each integration is one OAuth connection per organisation, stored in the
`IntegrationConnection` table (provider, status, tokens, account email). The web
hub lives at **Settings → Integrations** (`/settings/integrations`). Microsoft 365
is built first because a single connection covers four jobs at once: pushing the
bid calendar to Outlook, logging client email, storing documents on
OneDrive/SharePoint, and single sign-on.

## Status (be clear on what's live)

- **Built + unit-tested:** the calendar event mapping (EDM deadline → Microsoft
  Graph all-day event, with reminders and an idempotency key so re-syncing never
  duplicates events). 15/15 tests.
- **Built, needs your tenant to run:** the OAuth connect/callback/disconnect and
  the calendar-sync endpoint. These call Microsoft's live APIs, so they only run
  once the API is deployed and an Azure app is registered.
- **Schema:** `IntegrationConnection` is a new model — it lands via `db push`
  (already in the deploy flow).

## Connect Microsoft 365 (one-time Azure setup)

1. **Azure Portal → App registrations → New registration.** Name it "EDM OS".
   Under *Redirect URI*, choose **Web** and enter
   `https://<your-api>/integrations/microsoft/callback`.
2. **API permissions → Microsoft Graph → Delegated permissions**, add:
   `User.Read`, `Calendars.ReadWrite`, `Mail.Read`, `Files.ReadWrite`,
   `offline_access`. Then **Grant admin consent**.
3. **Certificates & secrets → New client secret.** Copy the value immediately.
4. Set the environment variables on the API (see `.env.example`):
   `MS_CLIENT_ID`, `MS_CLIENT_SECRET`, `MS_TENANT_ID` (`common` or your tenant id),
   `MS_REDIRECT_URI`, and `WEB_BASE_URL`.

## How it runs once configured

- **Connect:** `GET /integrations/microsoft/connect` returns the Microsoft consent
  URL. The user signs in; Microsoft redirects back to the callback, which exchanges
  the code for tokens and stores the connection.
- **Sync:** `POST /integrations/microsoft/sync-calendar` maps the bid calendar and
  follow-ups to Graph events and creates them on the user's Outlook calendar. Bids
  remind one day ahead, follow-ups and tasks twelve hours ahead.
- **Disconnect:** `DELETE /integrations/microsoft` clears the stored tokens.

A note on token storage: the columns hold tokens for the prototype; before
production, encrypt them at rest (the column is sized for the encrypted blob, not
a raw token).

## What comes next (same connection model)

In priority order for a subcontractor: **Xero** (won deal → invoice/subcontract,
contact and payment sync), **WhatsApp Business** (deadline and follow-up alerts),
**DocuSign** (subcontract and transmittal sign-off), **PlanRadar** (site snagging
and QA back into EDM OS), then QuickBooks as a Xero alternative. For EDM's own use,
Microsoft 365 plus one accounting connector is realistically the whole list.

## Connect Xero (accounting)

1. **Xero Developer portal → New app.** Choose a **Web app**, integration type
   OAuth 2.0. Set the redirect URI to
   `https://<your-api>/integrations/xero/callback`.
2. Note the **Client id** and generate a **Client secret**.
3. Set the environment variables on the API (see `.env.example`):
   `XERO_CLIENT_ID`, `XERO_CLIENT_SECRET`, `XERO_REDIRECT_URI`.

Scopes requested: `accounting.transactions`, `accounting.contacts`, plus
`offline_access` and the OpenID scopes. After consent, EDM OS reads your Xero
**tenant (organisation) id** from `/connections` and stores it for subsequent calls.

### How it runs

- **Connect:** `GET /integrations/xero/connect` → consent → callback stores the
  tokens and tenant id.
- **Won deal → invoice:** `POST /integrations/xero/invoice` creates a **DRAFT**
  sales (ACCREC) invoice — line item, client contact, AED by default, 30-day
  terms. Draft means it's reviewed and approved in Xero before it reaches a client.
- **Contact sync:** `POST /integrations/xero/contact` upserts a client as a Xero
  contact.

The same draft-first, review-in-Xero principle keeps the accounting team in
control — EDM OS proposes, Xero approves.

## Connect WhatsApp Business (alerts)

WhatsApp uses a permanent token and phone number id rather than an OAuth redirect.

1. In **Meta for Developers**, set up the **WhatsApp Business Cloud API** and note
   your **Phone number id**, a **permanent access token**, and your WhatsApp
   Business Account id.
2. Create and get approval for message **templates** (e.g. `bid_deadline_reminder`,
   `follow_up_reminder`, `task_reminder`) — proactive messages must use approved
   templates.
3. Connect by posting those credentials to `POST /integrations/whatsapp/connect`
   (or set `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_ACCESS_TOKEN`,
   `WHATSAPP_BUSINESS_ACCOUNT_ID` in the environment).

### How it runs

- **Send an alert:** `POST /integrations/whatsapp/send` with the alert (bid /
  follow-up / task) and a recipient number. EDM OS picks the matching template,
  fills the body parameters (title, date, client) and sends. Numbers are
  normalised automatically — UAE local formats (leading 0), `00` prefixes and `+`
  are all handled — and English or Arabic can be selected per message.
- **Disconnect:** `DELETE /integrations/whatsapp` clears the stored token.

## Connect DocuSign (e-signature)

1. In the **DocuSign developer/admin console**, create an app and note the
   **Integration key** (client id) and a **Secret key**. Add a redirect URI of
   `https://<your-api>/integrations/docusign/callback`.
2. Set the environment variables on the API (see `.env.example`):
   `DOCUSIGN_CLIENT_ID`, `DOCUSIGN_CLIENT_SECRET`, `DOCUSIGN_REDIRECT_URI`.

Scope requested: `signature`. After consent, EDM OS reads your **account id** and
the per-account **API base URI** from userinfo and stores them.

### How it runs

- **Connect:** `GET /integrations/docusign/connect` → consent → callback stores the
  tokens, account id and base URI.
- **Send for signature:** `POST /integrations/docusign/envelope` with a document
  (base64), a signer, and optionally the anchor text where the signature should
  sit. Send immediately (`sent`) or hold as a draft (`created`). This is the
  natural sign-off step for a subcontract agreement or a transmittal.
