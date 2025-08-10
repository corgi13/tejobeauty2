import { Body, Controller, Post } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Controller('coupons')
export class CouponsController {
  constructor(private prisma: PrismaService) {}

  @Post('validate')
  async validate(@Body() body: { code: string; now?: string }) {
    const now = body.now ? new Date(body.now) : new Date();
    const c = await this.prisma.coupon.findUnique({ where: { code: body.code } });
    if (!c || !c.isActive) return { valid: false };
    if ((c.validFrom && c.validFrom > now) || (c.validUntil && c.validUntil < now)) return { valid: false };
    if (c.maxUses && c.usedCount >= c.maxUses) return { valid: false };
    return { valid: true, type: c.type, value: c.value };
  }
}


