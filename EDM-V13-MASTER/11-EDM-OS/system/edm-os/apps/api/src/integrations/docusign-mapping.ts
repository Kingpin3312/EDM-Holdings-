// Pure mapping: a document + signer -> a DocuSign envelope definition (eSignature
// REST API v2.1). No I/O, fully unit-testable. The signature placement uses an
// anchor string so the signing tab lands wherever that text appears in the doc.

export type EnvelopeInput = {
  subject: string;
  documentName: string;
  documentBase64: string;
  fileExtension?: string; // defaults to pdf
  signerName: string;
  signerEmail: string;
  anchorString?: string; // text in the doc to place the signature on
  status?: "sent" | "created"; // "sent" emails the signer now; "created" is a draft
};

export type Envelope = {
  emailSubject: string;
  documents: { documentBase64: string; name: string; fileExtension: string; documentId: string }[];
  recipients: {
    signers: {
      email: string;
      name: string;
      recipientId: string;
      routingOrder: string;
      tabs: { signHereTabs: { anchorString: string; anchorUnits: string; anchorXOffset: string; anchorYOffset: string }[] };
    }[];
  };
  status: "sent" | "created";
};

export function toEnvelope(input: EnvelopeInput): Envelope {
  return {
    emailSubject: input.subject,
    documents: [
      { documentBase64: input.documentBase64, name: input.documentName, fileExtension: input.fileExtension ?? "pdf", documentId: "1" },
    ],
    recipients: {
      signers: [
        {
          email: input.signerEmail,
          name: input.signerName,
          recipientId: "1",
          routingOrder: "1",
          tabs: {
            signHereTabs: [
              { anchorString: input.anchorString ?? "/sign_here/", anchorUnits: "pixels", anchorXOffset: "0", anchorYOffset: "0" },
            ],
          },
        },
      ],
    },
    status: input.status ?? "sent",
  };
}
