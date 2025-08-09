import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { PrismaService } from '../../prisma.service';

@Module({ controllers: [SettingsController], providers: [PrismaService] })
export class SettingsModule {}


