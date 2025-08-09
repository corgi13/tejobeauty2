import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';

class LoginDto { email!: string; password!: string }
class RegisterDto { name?: string; email!: string; password!: string }

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService, private users: UsersService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.auth.validate(dto.email, dto.password);
    const { access, refresh } = this.auth.signTokens(user.id);
    res.cookie('access_token', access, { httpOnly: true, sameSite: 'lax', secure: false, path: '/' });
    res.cookie('refresh_token', refresh, { httpOnly: true, sameSite: 'lax', secure: false, path: '/' });
    return { ok: true };
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const passwordHash = await argon2.hash(dto.password);
    const user = await this.users.create({ name: dto.name, email: dto.email, passwordHash });
    return { id: user.id };
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Res({ passthrough: true }) res: Response, @Body() body: any) {
    // naive refresh using refresh_token cookie
    const token = (res.req as any)?.cookies?.['refresh_token'];
    if (!token) return { ok: false };
    try {
      const { sub } = (this as any).auth['jwt'].verify(token, { secret: process.env.JWT_REFRESH_SECRET! });
      const { access, refresh } = (this as any).auth.signTokens(sub);
      res.cookie('access_token', access, { httpOnly: true, sameSite: 'lax', secure: false, path: '/' });
      res.cookie('refresh_token', refresh, { httpOnly: true, sameSite: 'lax', secure: false, path: '/' });
      return { ok: true };
    } catch {
      return { ok: false };
    }
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return { ok: true };
  }
}


