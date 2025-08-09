import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const token: string | undefined = req.cookies?.['access_token'];
    if (!token) return false;
    try {
      const payload = this.jwt.verify(token, { secret: process.env.JWT_ACCESS_SECRET! });
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (user) req.user = { id: user.id, isAdmin: user.isAdmin };
      return !!user?.isAdmin;
    } catch {
      return false;
    }
  }
}


