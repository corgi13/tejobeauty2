import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private jwt: JwtService) {}
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const token: string | undefined = req.cookies?.['access_token'];
    if (!token) return false;
    try {
      const payload = this.jwt.verify(token, { secret: process.env.JWT_ACCESS_SECRET! });
      req.user = { id: payload.sub };
      return true;
    } catch {
      return false;
    }
  }
}


