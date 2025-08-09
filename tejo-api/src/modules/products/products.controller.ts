import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, Req } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AdminGuard } from '../../common/admin.guard';
import axios from 'axios';
import { PrismaService } from '../../prisma.service';
import { JwtService } from '@nestjs/jwt';

@Controller('products')
export class ProductsController {
  constructor(private products: ProductsService, private prisma: PrismaService, private jwt: JwtService) {}

  @Get()
  list(@Query('skip') skip = '0', @Query('take') take = '20', @Query('category') category?: string, @Query('brand') brand?: string, @Query('priceMin') priceMin?: string, @Query('priceMax') priceMax?: string) {
    const where: any = {};
    if (category) where.category = category;
    if (brand) where.brand = brand;
    if (priceMin || priceMax) where.price = {
      ...(priceMin ? { gte: Number(priceMin) } : {}),
      ...(priceMax ? { lte: Number(priceMax) } : {}),
    };
    return this.prisma.product.findMany({ skip: Number(skip), take: Number(take), where, orderBy: { createdAt: 'desc' } });
  }

  @Get(':slug')
  async get(@Param('slug') slug: string, @Req() req: any) {
    const p = await this.products.getBySlug(slug);
    if (!p) return p;
    // B2B price override if user in group
    const token: string | undefined = req.cookies?.['access_token'];
    if (token) {
      try {
        const payload = this.jwt.verify(token, { secret: process.env.JWT_ACCESS_SECRET! });
        const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
        if (user?.customerGroup) {
          const b2b = await this.prisma.b2BPrice.findFirst({ where: { productId: p.id, customerGroup: user.customerGroup } });
          if (b2b?.price) (p as any).price = b2b.price;
        }
      } catch {}
    }
    return p;
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() body: any) {
    return this.products.create(body).then(async (p) => {
      await axios.post(`${process.env.FRONTEND_ORIGIN || 'http://localhost:3000'}/api/revalidate`, { tag: 'products' }, { headers: { 'X-Revalidate-Secret': process.env.REVALIDATE_SECRET } }).catch(() => undefined);
      return p;
    });
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() body: any) {
    return this.products.update(id, body).then(async (p) => {
      await axios.post(`${process.env.FRONTEND_ORIGIN || 'http://localhost:3000'}/api/revalidate`, { tag: 'products' }, { headers: { 'X-Revalidate-Secret': process.env.REVALIDATE_SECRET } }).catch(() => undefined);
      return p;
    });
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.products.remove(id).then(async (p) => {
      await axios.post(`${process.env.FRONTEND_ORIGIN || 'http://localhost:3000'}/api/revalidate`, { tag: 'products' }, { headers: { 'X-Revalidate-Secret': process.env.REVALIDATE_SECRET } }).catch(() => undefined);
      return p;
    });
  }
}


