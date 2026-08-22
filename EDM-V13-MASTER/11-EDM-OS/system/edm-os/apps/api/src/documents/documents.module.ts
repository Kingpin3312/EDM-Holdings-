import { Module } from "@nestjs/common";
import { DocumentsController } from "./documents.controller";
import { DocumentsService } from "./documents.service";

// Document control — register, revisions (Storage-backed), approval workflow.
// Gated by the `documents` feature flag.
@Module({ controllers: [DocumentsController], providers: [DocumentsService] })
export class DocumentsModule {}
