import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { PrismaService } from './prisma.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { BlogModule } from './modules/blog/blog.module';
import { RevalidateModule } from './modules/revalidate/revalidate.module';
import { SettingsModule } from './modules/settings/settings.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { SearchModule } from './modules/search/search.module';
import { FeedsModule } from './modules/feeds/feeds.module';
import { PartnerRequestsModule } from './modules/partner-requests/partner-requests.module';
import { ReindexModule } from './modules/reindex/reindex.module';

@Module({
  imports: [UsersModule, AuthModule, ProductsModule, BlogModule, RevalidateModule, SettingsModule, OrdersModule, PaymentsModule, UploadsModule, SearchModule, FeedsModule, PartnerRequestsModule, ReindexModule],
  controllers: [HealthController],
  providers: [PrismaService],
})
export class AppModule {}


