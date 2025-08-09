import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PrismaService } from '../../prisma.service';
import { AdminGuard } from '../../common/admin.guard';

@Controller('orders')
export class OrdersController {
  constructor(private orders: OrdersService, private prisma: PrismaService) {}

  @Get()
  @UseGuards(AdminGuard)
  list(@Query('skip') skip = '0', @Query('take') take = '50') {
    return this.prisma.order.findMany({
      skip: Number(skip),
      take: Number(take),
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });
  }

  @Post()
  async create(@Req() req: any, @Body() body: { items: Array<{ productId: string; variantId?: string; qty: number }>; currency?: string }) {
    const userId = req.user?.id ?? null;
    return this.orders.createFromCart(userId, body.items, body.currency ?? 'EUR');
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.orders['prisma'].order.findUnique({ where: { id }, include: { items: true } });
  }
}


