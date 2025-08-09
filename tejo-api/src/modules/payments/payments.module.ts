import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { OrdersModule } from '../orders/orders.module';
import { PrismaService } from '../../prisma.service';

@Module({ imports: [OrdersModule], controllers: [PaymentsController], providers: [PrismaService] })
export class PaymentsModule {}


