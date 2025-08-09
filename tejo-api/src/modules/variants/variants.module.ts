import { Module } from '@nestjs/common';
import { VariantsController } from './variants.controller';
import { PrismaService } from '../../prisma.service';

@Module({ controllers: [VariantsController], providers: [PrismaService] })
export class VariantsModule {}


