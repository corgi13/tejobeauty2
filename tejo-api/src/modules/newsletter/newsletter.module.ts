import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { NewsletterService } from './newsletter.service';
import { NewsletterController } from './newsletter.controller';
import { PrismaService } from '../../prisma.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [NewsletterController],
  providers: [NewsletterService, PrismaService],
  exports: [NewsletterService],
})
export class NewsletterModule {}
