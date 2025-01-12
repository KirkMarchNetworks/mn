/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ServerRouting } from '@mn/project-one/shared/models';
import { RootModule } from '@mn/project-one/server/modules/root';
import { ConfigType } from '@nestjs/config';
import { appConfig } from '@mn/project-one/server/configs';
import { HttpExceptionFilter } from '@mn/project-one/server/exceptions';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  const globalPrefix = ServerRouting.globalPrefix.path;
  app.setGlobalPrefix(globalPrefix);

  const openApiConfig = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('March Networks')
    .setDescription('Project One API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, openApiConfig, {});
  SwaggerModule.setup(`api-docs`, app, document, {
    useGlobalPrefix: true,
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const { port }: ConfigType<typeof appConfig> = app.get(appConfig.KEY);

  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
