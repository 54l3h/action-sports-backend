import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import serverless from 'serverless-http';

const expressApp = express();
let handler: any;

async function bootstrap() {
  expressApp.use(express.json({ limit: '50mb' }));
  expressApp.use(express.urlencoded({ extended: true, limit: '50mb' }));

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
    {
      bodyParser: false,
      rawBody: true,
    },
  );

  const config = new DocumentBuilder()
    .setTitle('Action Sports API')
    .setDescription('The Action Sports API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({ 
      whitelist: true, 
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.enableCors();

  await app.init();
  
  handler = serverless(expressApp, {
    binary: ['image/*', 'application/octet-stream'],
  });
}

bootstrap().catch((err) => {
  console.error('Nest serverless bootstrap failed:', err);
});

export default async function handlerWrapper(req: any, res: any) {
  if (!handler) {
    await new Promise<void>((resolve) => {
      const check = () => (handler ? resolve() : setTimeout(check, 50));
      check();
    });
  }
  return handler(req, res);
}