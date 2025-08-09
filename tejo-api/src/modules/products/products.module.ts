import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from '../../prisma.service';
import { AdminGuard } from '../../common/admin.guard';

@Module({
  imports: [JwtModule.register({})],
  providers: [ProductsService, PrismaService, AdminGuard],
  controllers: [ProductsController],
})
export class ProductsModule {}


