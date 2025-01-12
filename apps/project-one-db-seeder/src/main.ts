/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { seeder } from './seeder';
import { RootModule } from '@mn/project-one/server/modules/root';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);

  await seeder(app);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = 3009;
  //
  // const openApiConfig = new DocumentBuilder()
  //   .addBearerAuth()
  //   .setTitle('March Networks')
  //   .setDescription('Project One API description')
  //   .setVersion('1.0')
  //   .addTag('API')
  //   .build();
  // const document = SwaggerModule.createDocument(app, openApiConfig, {});
  // SwaggerModule.setup(`api-docs`, app, document, {
  //   useGlobalPrefix: true,
  //   swaggerOptions: {
  //     persistAuthorization: true,
  //   },
  // });
  //
  //
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
