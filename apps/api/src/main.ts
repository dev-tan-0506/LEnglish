import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:3000";

  app.enableCors({
    origin: corsOrigin,
    credentials: true
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  app.use(cookieParser());

  const port = Number(process.env.API_PORT ?? 4000);
  await app.listen(port);
}

void bootstrap();
