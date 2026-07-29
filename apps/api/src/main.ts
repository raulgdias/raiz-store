import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { DomainErrorFilter } from "./shared/presentation/domain-error.filter";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.enableCors({ origin: "http://localhost:3000" });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new DomainErrorFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle("RaizStore API")
    .setDescription(
      "API educacional de catálogo e pedidos com NestJS, CQRS e DDD.",
    )
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("docs", app, document);

  await app.listen(process.env.PORT ?? 3001);
}

void bootstrap();
