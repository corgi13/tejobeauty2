import { Module } from '@nestjs/common';
import { CouponsController } from './coupons.controller';
import { PrismaService } from '../../prisma.service';

@Module({ controllers: [CouponsController], providers: [PrismaService] })
export class CouponsModule {}


