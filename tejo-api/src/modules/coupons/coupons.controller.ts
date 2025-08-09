import { Body, Controller, Post } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Controller('coupons')
export class CouponsController {
  constructor(private prisma: PrismaService) {}

  @Post('validate')
  async validate(@Body() body: { code: string; now?: string }) {
    const now = body.now ? new Date(body.now) : new Date();
    const c = await this.prisma.coupon.findUnique({ where: { code: body.code } });
    if (!c || !c.active) return { valid: false };
    if ((c.startsAt && c.startsAt > now) || (c.endsAt && c.endsAt < now)) return { valid: false };
    if (c.usageLimit && c.usedCount >= c.usageLimit) return { valid: false };
    return { valid: true, type: c.type, value: c.value };
  }
}


