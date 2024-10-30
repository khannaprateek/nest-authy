import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from 'src/app.module';
import { SwaggerConfig } from './swagger';
import { CONSTANTS } from './util/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  new SwaggerConfig(app);
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();
  app.use(helmet());

  await app.listen(CONSTANTS.PORT);

  console.log('Server listening on port:', CONSTANTS.PORT);
}

bootstrap();
