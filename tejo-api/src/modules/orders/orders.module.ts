import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaService } from '../../prisma.service';

@Module({ imports: [JwtModule.register({})], providers: [OrdersService, PrismaService], controllers: [OrdersController], exports: [OrdersService] })
export class OrdersModule {}


