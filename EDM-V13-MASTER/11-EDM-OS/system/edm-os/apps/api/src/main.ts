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
  app.enableCors({ origin: process.env.CORS_ORIGIN?.split(",") ?? true, credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const port = Number(process.env.API_PORT ?? 4000);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`EDM OS API on :${port}/api/v1`);
}
bootstrap();
