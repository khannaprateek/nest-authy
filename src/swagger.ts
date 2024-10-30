import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
  OpenAPIObject,
} from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { CONSTANTS } from './util/constants';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

export class SwaggerConfig {
  config: Omit<OpenAPIObject, 'paths'>;
  app: INestApplication;
  url = `${CONSTANTS.SWAGGER_ENDPOINT}`;

  constructor(app: INestApplication) {
    this.app = app;
    this.init();
  }

  private init(): void {
    this.config = new DocumentBuilder()
      .setTitle('Authy API')
      .setDescription('User Management API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    this.configDocuments();
  }

  private configDocuments() {
    this.addDocument('users', { include: [UserModule] });
    this.addDocument('auth', { include: [AuthModule] });
  }

  private addDocument(apiPath: string, options?: SwaggerDocumentOptions) {
    const document = SwaggerModule.createDocument(
      this.app,
      this.config,
      options,
    );
    SwaggerModule.setup(`${this.url}/${apiPath}`, this.app, document);
  }
}
