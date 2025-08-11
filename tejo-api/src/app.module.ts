import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { AuthModule } from './modules/auth/auth.module';
import { BlogModule } from './modules/blog/blog.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { SearchModule } from './modules/search/search.module';
import { NewsletterModule } from './modules/newsletter/newsletter.module';
import { HealthController } from './health.controller';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validationSchema: {
        type: 'object',
        required: ['DATABASE_URL', 'JWT_SECRET', 'REDIS_URL'],
        properties: {
          NODE_ENV: {
            type: 'string',
            enum: ['development', 'production', 'test'],
            default: 'development',
          },
          PORT: {
            type: 'number',
            default: 4000,
          },
          DATABASE_URL: {
            type: 'string',
          },
          JWT_SECRET: {
            type: 'string',
            minLength: 32,
          },
          REDIS_URL: {
            type: 'string',
          },
          MEILISEARCH_URL: {
            type: 'string',
          },
          MEILISEARCH_KEY: {
            type: 'string',
          },
          FRONTEND_ORIGIN: {
            type: 'string',
          },
        },
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
      {
        ttl: 900000, // 15 minutes
        limit: 1000, // 1000 requests per 15 minutes
      },
    ]),
    UsersModule,
    ProductsModule,
    AuthModule,
    BlogModule,
    CouponsModule,
    ReviewsModule,
    OrdersModule,
    PaymentsModule,
    UploadsModule,
    SearchModule,
    NewsletterModule,
  ],
  controllers: [HealthController],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}


