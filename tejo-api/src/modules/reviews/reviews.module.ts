import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ReviewsController } from './reviews.controller';
import { PrismaService } from '../../prisma.service';

@Module({ imports: [JwtModule.register({})], controllers: [ReviewsController], providers: [PrismaService] })
export class ReviewsModule {}


