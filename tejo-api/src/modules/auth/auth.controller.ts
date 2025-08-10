import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtGuard } from '../../common/jwt.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Verify user email address' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 404, description: 'Invalid verification token' })
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  @Post('resend-verification')
  @ApiOperation({ summary: 'Resend email verification' })
  @ApiResponse({ status: 200, description: 'Verification email sent' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Email already verified' })
  async resendVerification(@Body('email') email: string) {
    return this.authService.resendVerification(email);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(@Req() req: any) {
    return this.authService.logout(req.user.sub);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 404, description: 'Invalid or expired token' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}


