import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  async validate(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await argon2.verify(user.passwordHash, password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  signTokens(userId: string) {
    const access = this.jwt.sign(
      { sub: userId },
      { secret: process.env.JWT_ACCESS_SECRET!, expiresIn: '30m' },
    );
    const refresh = this.jwt.sign(
      { sub: userId, type: 'refresh' },
      { secret: process.env.JWT_REFRESH_SECRET!, expiresIn: '30d' },
    );
    return { access, refresh };
  }
}


