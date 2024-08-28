import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CONSTANTS } from './constants';
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle(CONSTANTS.swagger.title)
    .setDescription(CONSTANTS.swagger.description)
    .setVersion(CONSTANTS.swagger.version)
    .addTag(CONSTANTS.swagger.tag)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = configService.get('APP_PORT');
  await app.listen(port);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
