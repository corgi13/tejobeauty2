import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaService } from '../../prisma.service';

@Module({ providers: [OrdersService, PrismaService], controllers: [OrdersController], exports: [OrdersService] })
export class OrdersModule {}


