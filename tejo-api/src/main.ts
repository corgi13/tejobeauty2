import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import cookieParser = require('cookie-parser');
import rateLimit from 'express-rate-limit';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, raw } from 'body-parser';
import compression from 'compression';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));

  // Compression middleware
  app.use(compression());

  // Cookie parser
  app.use(cookieParser());

  // Body parsers - Stripe webhook must receive raw body BEFORE json parser
  app.use('/payments/webhook', raw({ type: '*/*' }));
  app.use(json({ limit: '10mb' }));

  // CORS configuration
  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Rate limiting with different strategies
  app.use(
    '/auth',
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      limit: 5, // 5 requests per window
      standardHeaders: true,
      legacyHeaders: false,
      message: 'Too many authentication attempts, please try again later.',
      skipSuccessfulRequests: true,
    }),
  );

  app.use(
    '/search',
    rateLimit({ 
      windowMs: 60 * 1000, // 1 minute
      limit: 100, // 100 requests per minute
      standardHeaders: true, 
      legacyHeaders: false 
    }),
  );

  app.use(
    '/api',
    rateLimit({ 
      windowMs: 60 * 1000, // 1 minute
      limit: 1000, // 1000 requests per minute
      standardHeaders: true, 
      legacyHeaders: false 
    }),
  );

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, 
    transform: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Swagger documentation
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Tejo Beauty API')
      .setDescription('Premium beauty products API with advanced features')
      .setVersion('1.0.0')
      .addBearerAuth()
      .addTag('auth', 'Authentication endpoints')
      .addTag('products', 'Product management')
      .addTag('users', 'User management')
      .addTag('orders', 'Order processing')
      .addTag('payments', 'Payment processing')
      .addTag('search', 'Search functionality')
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
      },
    });
  }

  const port = process.env.PORT || 4000;
  await app.listen(port);
  
  logger.log(`🚀 Tejo Beauty API is running on: http://localhost:${port}`);
  logger.log(`📚 API Documentation available at: http://localhost:${port}/docs`);
  logger.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});


