import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import cookieParser = require('cookie-parser');
import rateLimit from 'express-rate-limit';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, raw } from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use(cookieParser());
  // Stripe webhook must receive raw body BEFORE json parser
  app.use('/payments/webhook', raw({ type: '*/*' }));
  app.use(json());
  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });
  app.use(
    '/auth',
    rateLimit({
      windowMs: 60_000,
      limit: 30,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );
  app.use(
    '/search',
    rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: true, legacyHeaders: false }),
  );

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder().setTitle('Tejo API').setVersion('0.1').build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  const port = process.env.PORT || 4000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`);
}

bootstrap();


