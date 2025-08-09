import { Module } from '@nestjs/common';
import { PartnerRequestsController } from './partner-requests.controller';
import { PrismaService } from '../../prisma.service';

@Module({ controllers: [PartnerRequestsController], providers: [PrismaService] })
export class PartnerRequestsModule {}


