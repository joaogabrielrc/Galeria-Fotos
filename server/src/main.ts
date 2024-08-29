import { Logger, VERSION_NEUTRAL, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

const appPort = process.env.APP_PORT ? Number(process.env.APP_PORT) : 8080;
const appHostname = process.env.APP_HOST || "0.0.0.0";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
  });

  app.setGlobalPrefix("api");
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: VERSION_NEUTRAL,
  });

  await app.listen(appPort, appHostname);

  const logger = new Logger("NestApplication");
  logger.log(`Application is running on: ${await app.getUrl()} 🚀`);
}
bootstrap();
