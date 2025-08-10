import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { JwtGuard } from '../../common/jwt.guard';
import { AdminGuard } from '../../common/admin.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private prisma: PrismaService) {}

  @Get('product/:productId')
  list(@Param('productId') productId: string) {
    return this.prisma.review.findMany({ where: { productId }, orderBy: { createdAt: 'desc' } });
  }

  @Get('pending')
  @UseGuards(AdminGuard)
  pending() {
    return this.prisma.review.findMany({ where: { approved: false }, orderBy: { createdAt: 'desc' } });
  }

  @Post()
  @UseGuards(JwtGuard)
  async create(@Body() body: { productId: string; rating: number; comment: string }) {
    const r = await this.prisma.review.create({ data: { ...body, userId: 'unknown', approved: false } });
    const stats = await this.prisma.review.aggregate({ where: { productId: body.productId }, _avg: { rating: true }, _count: { _all: true } });
    const avg = Number(stats._avg.rating ?? 0);
    const count = stats._count._all;
    await this.prisma.product.update({ where: { id: body.productId }, data: { rating: avg, reviewCount: count } });
    return r;
  }

  @Put(':id/approve')
  @UseGuards(AdminGuard)
  async approve(@Param('id') id: string) {
    return this.prisma.review.update({ where: { id }, data: { approved: true } });
  }
}


