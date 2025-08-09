import { Module } from '@nestjs/common';
import { FeedsController } from './feeds.controller';
import { PrismaService } from '../../prisma.service';

@Module({ controllers: [FeedsController], providers: [PrismaService] })
export class FeedsModule {}


