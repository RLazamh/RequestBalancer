import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './src/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT_SERVICE');
  const HOST = configService.get('HOST');
  const ENVIRONMENT = configService.get('ENVIRONMENT');

  Logger.log(
    `Application Request Balancer is running on: ENVIRONMENT: ${ENVIRONMENT} HOST: ${HOST} PORT: ${PORT}`,
  );

  await app.listen(PORT, HOST);
}
bootstrap();
