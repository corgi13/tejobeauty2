import { Controller, Get, Req } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UsersController {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  @Get('me')
  async me(@Req() req: any) {
    // decode cookie if present
    const token: string | undefined = req.cookies?.['access_token'];
    let user = null as any;
    if (token) {
      try {
        const payload = this.jwt.verify(token, { secret: process.env.JWT_ACCESS_SECRET! });
        user = await this.prisma.user.findUnique({ where: { id: payload.sub }, select: { id: true, firstName: true, lastName: true, email: true, isAdmin: true, createdAt: true } });
      } catch {}
    }
    return { user };
  }

  @Get('me/loyalty')
  async loyalty(@Req() req: any) {
    let userId = req.user?.id as string | undefined;
    if (!userId && req.cookies?.['access_token']) {
      try { const p = this.jwt.verify(req.cookies['access_token'], { secret: process.env.JWT_ACCESS_SECRET! }); userId = p.sub; } catch {}
    }
    if (!userId) return { current: null };
    const [user, settings] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId } }),
      this.prisma.settings.findFirst(),
    ]);
    const tiers = (settings?.loyaltyTiers as any[]) || JSON.parse(process.env.LOYALTY_TIERS_JSON || '[]');
    tiers.sort((a, b) => a.threshold - b.threshold);
    const spend = Number(user?.lifetimeSpend || 0);
    let current = tiers[0] || null;
    let next = null as any;
    for (let i = 0; i < tiers.length; i++) {
      if (spend >= tiers[i].threshold) current = tiers[i];
      else { next = tiers[i]; break; }
    }
    const remaining = next ? Math.max(0, next.threshold - spend) : 0;
    return { current, next, remaining, spend };
  }
}


