import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { VerifyNewsletterDto } from './dto/verify-newsletter.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class NewsletterService {
  constructor(private prisma: PrismaService) {}

  async subscribe(createNewsletterDto: CreateNewsletterDto) {
    const { email } = createNewsletterDto;

    // Check if already subscribed
    const existing = await this.prisma.newsletter.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.isVerified) {
        throw new ConflictException('Email is already subscribed to newsletter');
      } else {
        // Resend verification email
        await this.sendVerificationEmail(existing);
        return { message: 'Verification email sent' };
      }
    }

    // Create new subscription
    const verificationToken = randomBytes(32).toString('hex');
    const newsletter = await this.prisma.newsletter.create({
      data: {
        email,
        verificationToken,
      },
    });

    // Send verification email
    await this.sendVerificationEmail(newsletter);

    return { message: 'Subscription created. Please check your email to verify.' };
  }

  async verify(verifyNewsletterDto: VerifyNewsletterDto) {
    const { token } = verifyNewsletterDto;

    const newsletter = await this.prisma.newsletter.findUnique({
      where: { verificationToken: token },
    });

    if (!newsletter) {
      throw new NotFoundException('Invalid verification token');
    }

    await this.prisma.newsletter.update({
      where: { id: newsletter.id },
      data: {
        isVerified: true,
        verificationToken: null,
      },
    });

    return { message: 'Email verified successfully' };
  }

  async unsubscribe(email: string) {
    const newsletter = await this.prisma.newsletter.findUnique({
      where: { email },
    });

    if (!newsletter) {
      throw new NotFoundException('Email not found in newsletter list');
    }

    await this.prisma.newsletter.update({
      where: { id: newsletter.id },
      data: { isActive: false },
    });

    return { message: 'Unsubscribed successfully' };
  }

  async resendVerification(email: string) {
    const newsletter = await this.prisma.newsletter.findUnique({
      where: { email },
    });

    if (!newsletter) {
      throw new NotFoundException('Email not found in newsletter list');
    }

    if (newsletter.isVerified) {
      throw new ConflictException('Email is already verified');
    }

    await this.sendVerificationEmail(newsletter);

    return { message: 'Verification email sent' };
  }

  async findAll() {
    return this.prisma.newsletter.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getStats() {
    const [total, verified, unverified] = await Promise.all([
      this.prisma.newsletter.count({ where: { isActive: true } }),
      this.prisma.newsletter.count({ where: { isActive: true, isVerified: true } }),
      this.prisma.newsletter.count({ where: { isActive: true, isVerified: false } }),
    ]);

    return {
      total,
      verified,
      unverified,
    };
  }

  private async sendVerificationEmail(newsletter: any) {
    // TODO: Implement actual email sending
    // For now, just log the verification link
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-newsletter?token=${newsletter.verificationToken}`;
    console.log(`Newsletter verification email sent to ${newsletter.email}: ${verificationUrl}`);
    
    // In production, you would use a service like SendGrid, Mailgun, or AWS SES
    // Example with SendGrid:
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
      to: newsletter.email,
      from: 'noreply@tejo-beauty.com',
      subject: 'Verify your newsletter subscription',
      html: `
        <h2>Welcome to Tejo-Beauty Newsletter!</h2>
        <p>Thank you for subscribing to our newsletter. Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>If you didn't subscribe to our newsletter, you can safely ignore this email.</p>
      `,
    };
    
    await sgMail.send(msg);
    */
  }
}
