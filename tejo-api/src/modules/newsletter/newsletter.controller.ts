import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { NewsletterService } from './newsletter.service';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { VerifyNewsletterDto } from './dto/verify-newsletter.dto';
import { AdminGuard } from '../../common/admin.guard';

@ApiTags('newsletter')
@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post('subscribe')
  @ApiOperation({ summary: 'Subscribe to newsletter' })
  @ApiResponse({ status: 201, description: 'Subscription created successfully' })
  @ApiResponse({ status: 409, description: 'Email already subscribed' })
  async subscribe(@Body() createNewsletterDto: CreateNewsletterDto) {
    return this.newsletterService.subscribe(createNewsletterDto);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify newsletter subscription' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 404, description: 'Invalid verification token' })
  async verify(@Body() verifyNewsletterDto: VerifyNewsletterDto) {
    return this.newsletterService.verify(verifyNewsletterDto);
  }

  @Post('unsubscribe')
  @ApiOperation({ summary: 'Unsubscribe from newsletter' })
  @ApiResponse({ status: 200, description: 'Unsubscribed successfully' })
  @ApiResponse({ status: 404, description: 'Email not found' })
  async unsubscribe(@Body('email') email: string) {
    return this.newsletterService.unsubscribe(email);
  }

  @Post('resend-verification')
  @ApiOperation({ summary: 'Resend verification email' })
  @ApiResponse({ status: 200, description: 'Verification email sent' })
  @ApiResponse({ status: 404, description: 'Email not found' })
  @ApiResponse({ status: 409, description: 'Email already verified' })
  async resendVerification(@Body('email') email: string) {
    return this.newsletterService.resendVerification(email);
  }

  @Get()
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all newsletter subscriptions (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of newsletter subscriptions' })
  async findAll() {
    return this.newsletterService.findAll();
  }

  @Get('stats')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get newsletter statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Newsletter statistics' })
  async getStats() {
    return this.newsletterService.getStats();
  }
}
