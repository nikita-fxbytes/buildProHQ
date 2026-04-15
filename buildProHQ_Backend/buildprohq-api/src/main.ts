import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter, ResponseInterceptor } from './infrastructure/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = config.get<number>('PORT', 3000);
  const corsOrigin = config.get<string>('CORS_ORIGIN', '*');

  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  /**
   * Backwards-compatible routing:
   * Some clients call versioned routes without the global `/api` prefix (e.g. `/v1/...`).
   *
   * IMPORTANT: Use an internal rewrite (not redirect) because some HTTP clients
   * don't follow redirects for PATCH/POST, leading to persistent 404s.
   */
  app.use((req: any, _res: any, next: any) => {
    const url: string = typeof req?.url === 'string' ? req.url : '';
    if (url.startsWith('/v1/')) {
      req.url = `/api${url}`;
    }
    next();
  });

  app.use(cookieParser());
  app.use(
    helmet({
      // Allow images/files to be embedded by the frontend running on a different origin
      // (e.g. http://localhost:3000 -> http://localhost:3001).
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.enableCors({
    origin:
      corsOrigin === '*' ? true : corsOrigin.split(',').map((o) => o.trim()),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  const swaggerPath = config.get<string>('SWAGGER_PATH', 'api/docs');
  const swaggerConfig = new DocumentBuilder()
    .setTitle(config.get<string>('APP_NAME', 'BuildPro HQ API'))
    .setDescription(
      'Core backend API for BuildPro HQ construction task workflows',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const swaggerDoc = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(swaggerPath, app, swaggerDoc);

  await app.listen(port);
  console.log(`\n🚀 BuildPro HQ API is running on: http://localhost:${port}/api`);
  console.log(`📖 Documentation available at: http://localhost:${port}/${swaggerPath}\n`);
}
bootstrap();
