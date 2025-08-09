import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Controller('settings')
export class SettingsController {
  constructor(private prisma: PrismaService) {}

  @Get('public')
  async pub() {
    const s = await this.prisma.settings.findFirst();
    return {
      freeShippingThreshold: Number(s?.freeShippingThreshold ?? process.env.FREE_SHIPPING_THRESHOLD ?? 0),
      loyaltyTiers: s?.loyaltyTiers ?? JSON.parse(process.env.LOYALTY_TIERS_JSON || '[]'),
    };
  }
}


