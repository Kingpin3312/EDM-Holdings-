import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { validateEnv } from "./common/env-validation";

async function bootstrap() {
  const configErrors = validateEnv(process.env, { production: process.env.NODE_ENV === "production" });
  if (configErrors.length) {
    // eslint-disable-next-line no-console
    console.error("Refusing to start — configuration errors:\n" + configErrors.map((e) => `  - ${e}`).join("\n"));
    process.exit(1);
  }
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api/v1");
  // Never fall back to `true`: with credentials enabled that reflects whatever
  // origin asks, so any site a signed-in user visits could call the API as them.
  // validateEnv guarantees CORS_ORIGIN is present outside local development.
  const corsOrigins = process.env.CORS_ORIGIN?.split(",").map((o) => o.trim()).filter(Boolean) ?? [];
  app.enableCors({ origin: corsOrigins.length ? corsOrigins : false, credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const port = Number(process.env.API_PORT ?? 4000);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`EDM OS API on :${port}/api/v1`);
}
bootstrap();
